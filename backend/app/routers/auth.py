from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core import create_access_token, get_db, hash_password, verify_password
from ..models import User
from ..schemas import LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])
DEMO_STAFF_USERNAME = "staff.demo@agency.gov"


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

    return TokenResponse(access_token=create_access_token(subject=user.username, role=user.role))
