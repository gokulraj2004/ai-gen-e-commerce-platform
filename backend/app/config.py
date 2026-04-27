"""
Application configuration using Pydantic Settings.
All values are loaded from environment variables or .env file.
"""
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # Application
    app_name: str = "E-Commerce Platform"
    app_env: str = "development"
    debug: bool = True
    secret_key: str

    # Backend
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000

    # Database
    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "e_commerce_platform"
    db_user: str = "postgres"
    db_password: str = "postgres"
    database_url: str | None = None

    # Authentication
    jwt_secret_key: str
    jwt_access_token_expire_minutes: int = 30
    jwt_refresh_token_expire_days: int = 7
    jwt_algorithm: str = "HS256"

    # CORS
    cors_origins: str = "http://localhost:3000,http://localhost:5173"

    @field_validator("secret_key")
    @classmethod
    def validate_secret_key(cls, v: str) -> str:
        if v == "change-me-to-a-random-secret-key":
            raise ValueError(
                "secret_key must be set to a secure random value. "
                "Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(64))\""
            )
        return v

    @field_validator("jwt_secret_key")
    @classmethod
    def validate_jwt_secret_key(cls, v: str) -> str:
        if v == "change-me-to-a-random-jwt-secret":
            raise ValueError(
                "jwt_secret_key must be set to a secure random value. "
                "Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(64))\""
            )
        return v

    @property
    def async_database_url(self) -> str:
        """Construct async database URL for SQLAlchemy."""
        if self.database_url:
            url = self.database_url
            if url.startswith("postgresql://"):
                return url.replace("postgresql://", "postgresql+asyncpg://", 1)
            return url
        return (
            f"postgresql+asyncpg://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    @property
    def sync_database_url(self) -> str:
        """Construct sync database URL for Alembic migrations."""
        if self.database_url:
            url = self.database_url
            if url.startswith("postgresql+asyncpg://"):
                return url.replace("postgresql+asyncpg://", "postgresql://", 1)
            return url
        return (
            f"postgresql://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    @property
    def cors_origins_list(self) -> list[str]:
        """Parse CORS origins from comma-separated string."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()