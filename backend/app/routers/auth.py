from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from ..core import (
    build_logingov_authorize_url,
    create_access_token,
    exchange_logingov_code,
    generate_oidc_state,
    get_db,
    hash_password,
    settings,
    verify_password,
)
from ..core.security import decode_token
from ..models import User
from ..schemas import LoginRequest, TokenResponse, UserProfile, UserSettingsUpdate

router = APIRouter(prefix="/auth", tags=["auth"])
DEMO_STAFF_USERNAME = "staff.demo@agency.gov"

# ── Existing demo/JWT login (AUTH_MODE=jwt) ────────────────────────────────


@router.post("/login", response_model=TokenResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)) -> TokenResponse:
    user = db.query(User).filter(User.username == body.username).first()

    if not user:
        # Auto-provision on first login for pilot; swap for registration flow later.
        role = "staff" if body.username == DEMO_STAFF_USERNAME else "applicant"
        user = User(
            username=body.username,
            hashed_password=hash_password(body.password),
            role=role,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    if user.username == DEMO_STAFF_USERNAME and user.role != "staff":
        user.role = "staff"
        db.add(user)
        db.commit()
        db.refresh(user)

    if not verify_password(body.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return TokenResponse(access_token=create_access_token(subject=user.username, role=user.role, email=user.email))


# ── Login.gov OIDC flow (AUTH_MODE=oidc) ───────────────────────────────────


@router.get("/logingov")
def logingov_redirect():
    """Redirect the user to login.gov for authentication."""
    if settings.auth_mode != "oidc":
        raise HTTPException(status_code=400, detail="OIDC auth not enabled (AUTH_MODE != oidc)")

    state = generate_oidc_state()
    nonce = generate_oidc_state()
    url = build_logingov_authorize_url(state=state, nonce=nonce)
    return RedirectResponse(url=url)


@router.get("/callback")
async def logingov_callback(
    code: str = Query(...),
    state: str = Query(default=""),
    db: Session = Depends(get_db),
) -> TokenResponse:
    """Exchange login.gov authorization code for tokens, upsert user, return local JWT."""
    if settings.auth_mode != "oidc":
        raise HTTPException(status_code=400, detail="OIDC auth not enabled")

    claims = await exchange_logingov_code(code)

    # Extract login.gov claims
    lgov_uuid = claims.get("sub", "")
    email = claims.get("email", "")
    given_name = claims.get("given_name", "")
    family_name = claims.get("family_name", "")
    phone_val = claims.get("phone")
    address_claim = claims.get("address") or {}
    verified_at = claims.get("verified_at")

    if not lgov_uuid:
        raise HTTPException(status_code=400, detail="Missing sub claim from login.gov")

    # Upsert user by login_gov_uuid
    user = db.query(User).filter(User.login_gov_uuid == lgov_uuid).first()

    if not user:
        # Also check if a user already exists with this email as username (migration path)
        user = db.query(User).filter(User.username == email).first()

    if user:
        # Update login.gov-sourced fields on every login
        user.login_gov_uuid = lgov_uuid
        user.email = email
        user.first_name = given_name
        user.last_name = family_name
        user.phone = phone_val if isinstance(phone_val, str) else None
        if isinstance(address_claim, dict):
            user.address_street = address_claim.get("street_address", "")
            user.address_city = address_claim.get("locality", "")
            user.address_state = address_claim.get("region", "")
            user.address_zip = address_claim.get("postal_code", "")
        if verified_at is not None:
            user.verified_at = str(verified_at)
        if not user.username:
            user.username = email
    else:
        user = User(
            username=email or lgov_uuid,
            hashed_password="",  # No password for OIDC users
            role="applicant",
            login_gov_uuid=lgov_uuid,
            email=email,
            first_name=given_name,
            last_name=family_name,
            phone=phone_val if isinstance(phone_val, str) else None,
            address_street=address_claim.get("street_address", "") if isinstance(address_claim, dict) else None,
            address_city=address_claim.get("locality", "") if isinstance(address_claim, dict) else None,
            address_state=address_claim.get("region", "") if isinstance(address_claim, dict) else None,
            address_zip=address_claim.get("postal_code", "") if isinstance(address_claim, dict) else None,
            verified_at=str(verified_at) if verified_at is not None else None,
        )
        db.add(user)

    db.commit()
    db.refresh(user)

    return TokenResponse(
        access_token=create_access_token(subject=user.username, role=user.role, email=user.email),
    )


# ── Profile & Settings ─────────────────────────────────────────────────────


def _user_from_token(token: dict, db: Session) -> User:
    """Resolve a User from decoded JWT claims."""
    username = token.get("sub")
    if not username:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/profile", response_model=UserProfile)
def get_profile(
    token: dict = Depends(decode_token),
    db: Session = Depends(get_db),
) -> UserProfile:
    """Return the full profile of the currently logged-in user."""
    user = _user_from_token(token, db)
    return UserProfile(
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        phone=user.phone,
        address_street=user.address_street,
        address_city=user.address_city,
        address_state=user.address_state,
        address_zip=user.address_zip,
        verified_at=user.verified_at,
        entity_type=user.entity_type,
        organization=user.organization,
        role=user.role,
        needs_profile_completion=user.entity_type is None,
    )


@router.put("/settings", response_model=UserProfile)
def update_settings(
    body: UserSettingsUpdate,
    token: dict = Depends(decode_token),
    db: Session = Depends(get_db),
) -> UserProfile:
    """Update the app-managed profile fields (entity_type, organization)."""
    user = _user_from_token(token, db)

    if body.entity_type is not None:
        user.entity_type = body.entity_type
    if body.organization is not None:
        user.organization = body.organization

    db.commit()
    db.refresh(user)

    return UserProfile(
        username=user.username,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        phone=user.phone,
        address_street=user.address_street,
        address_city=user.address_city,
        address_state=user.address_state,
        address_zip=user.address_zip,
        verified_at=user.verified_at,
        entity_type=user.entity_type,
        organization=user.organization,
        role=user.role,
        needs_profile_completion=user.entity_type is None,
    )
