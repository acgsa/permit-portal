from datetime import datetime, timedelta, timezone
from typing import Optional
from urllib.parse import urlencode
import hashlib
import secrets
import time
import uuid

import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext

from .config import settings

pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(subject: str, role: str, email: Optional[str] = None) -> str:
    expires = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expires_minutes)
    payload: dict = {"sub": subject, "role": role, "exp": expires}
    if email:
        payload["email"] = email
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def decode_token(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    except JWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        ) from exc


# ── Login.gov OIDC helpers ─────────────────────────────────────────────────


def build_logingov_authorize_url(state: str, nonce: str) -> str:
    """Build the login.gov /authorize redirect URL."""
    params = {
        "client_id": settings.logingov_client_id,
        "response_type": "code",
        "acr_values": settings.logingov_acr_values,
        "scope": "openid email profile address phone",
        "redirect_uri": settings.logingov_redirect_uri,
        "state": state,
        "nonce": nonce,
        "prompt": "select_account",
    }
    return f"{settings.logingov_issuer}/openid_connect/authorize?{urlencode(params)}"


def _build_client_assertion() -> str:
    """Build a ``private_key_jwt`` client assertion JWT for the login.gov token endpoint."""
    now = int(time.time())
    payload = {
        "iss": settings.logingov_client_id,
        "sub": settings.logingov_client_id,
        "aud": f"{settings.logingov_issuer}/api/openid_connect/token",
        "jti": uuid.uuid4().hex,
        "exp": now + 300,
        "iat": now,
    }

    private_key = settings.logingov_private_key
    if not private_key:
        raise HTTPException(status_code=500, detail="Login.gov private key not configured")

    # login.gov requires RS256
    return jwt.encode(payload, private_key, algorithm="RS256")


async def exchange_logingov_code(code: str) -> dict:
    """Exchange an authorization code for tokens at login.gov.

    Returns the decoded ID token claims.
    """
    token_url = f"{settings.logingov_issuer}/api/openid_connect/token"

    data = {
        "grant_type": "authorization_code",
        "code": code,
        "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        "client_assertion": _build_client_assertion(),
    }

    async with httpx.AsyncClient(timeout=15) as client:
        resp = await client.post(token_url, data=data)

    if resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Login.gov token exchange failed")

    tokens = resp.json()
    id_token = tokens.get("id_token", "")

    # Fetch login.gov JWKS to verify the ID token
    certs_url = f"{settings.logingov_issuer}/api/openid_connect/certs"
    async with httpx.AsyncClient(timeout=10) as client:
        certs_resp = await client.get(certs_url)

    if certs_resp.status_code != 200:
        raise HTTPException(status_code=502, detail="Failed to fetch login.gov JWKS")

    jwks = certs_resp.json()

    try:
        claims = jwt.decode(
            id_token,
            jwks,
            algorithms=["RS256"],
            audience=settings.logingov_client_id,
            issuer=settings.logingov_issuer,
        )
    except JWTError as exc:
        raise HTTPException(status_code=401, detail="Invalid login.gov ID token") from exc

    return claims


def generate_oidc_state() -> str:
    """Generate a cryptographically random state parameter."""
    return secrets.token_urlsafe(32)
