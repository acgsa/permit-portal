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

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
