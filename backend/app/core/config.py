from pydantic import Field
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = Field(
        default="postgresql+psycopg://permit:localdevonly@localhost:5432/permit_pilot",
        alias="DATABASE_URL",
    )
    jwt_secret: str = Field(default="change-me", alias="JWT_SECRET")
    jwt_algorithm: str = Field(default="HS256", alias="JWT_ALGORITHM")
    jwt_expires_minutes: int = Field(default=60, alias="JWT_EXPIRES_MINUTES")
    auth_mode: str = Field(default="jwt", alias="AUTH_MODE")
    cors_origins: str = Field(
        default="http://localhost:3000,http://127.0.0.1:3000,http://localhost:5173,http://127.0.0.1:5173",
        alias="CORS_ORIGINS",
    )
    seed_pic_data: bool = Field(default=False, alias="SEED_PIC_DATA")
    pic_schema_validate_responses: bool = Field(default=True, alias="PIC_SCHEMA_VALIDATE_RESPONSES")

    # ── Login.gov OIDC ─────────────────────────────────────────────────────
    logingov_client_id: str = Field(default="", alias="LOGINGOV_CLIENT_ID")
    logingov_issuer: str = Field(
        default="https://idp.int.identitysandbox.gov",
        alias="LOGINGOV_ISSUER",
    )
    logingov_acr_values: str = Field(
        default="http://idmanagement.gov/ns/assurance/ial/2",
        alias="LOGINGOV_ACR_VALUES",
    )
    logingov_private_key: str = Field(default="", alias="LOGINGOV_PRIVATE_KEY")
    logingov_redirect_uri: str = Field(
        default="http://localhost:3000/auth/callback",
        alias="LOGINGOV_REDIRECT_URI",
    )

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
