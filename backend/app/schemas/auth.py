from typing import Optional

from pydantic import BaseModel


class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class UserProfile(BaseModel):
    """Full user profile — login.gov fields + app-managed fields."""
    username: str
    email: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    address_street: Optional[str] = None
    address_city: Optional[str] = None
    address_state: Optional[str] = None
    address_zip: Optional[str] = None
    verified_at: Optional[str] = None
    entity_type: Optional[str] = None
    organization: Optional[str] = None
    role: str = "applicant"
    needs_profile_completion: bool = False


class UserSettingsUpdate(BaseModel):
    """Fields the user can edit in Settings (not from login.gov)."""
    entity_type: Optional[str] = None
    organization: Optional[str] = None
