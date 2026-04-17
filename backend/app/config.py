"""
Application configuration loaded from environment variables using Pydantic Settings.
All secrets and tunables are configured via .env or environment variables.
"""
import warnings
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import model_validator


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    # ── Application ──
    app_name: str = "Platform"
    app_env: str = "development"
    debug: bool = False
    secret_key: str = ""
    app_version: str = "1.0.0"

    # ── Backend ──
    backend_host: str = "0.0.0.0"
    backend_port: int = 8000

    # ── Database ──
    db_host: str = "localhost"
    db_port: int = 5432
    db_name: str = "app_db"
    db_user: str = "postgres"
    db_password: str = ""
    database_url: str | None = None

    # ── Authentication ──
    jwt_secret_key: str = ""
    jwt_access_token_expire_minutes: int = 30
    jwt_refresh_token_expire_days: int = 7
    jwt_algorithm: str = "HS256"

    # ── CORS ──
    cors_origins: str = "http://localhost:3000,http://localhost:5173"

    @model_validator(mode="after")
    def validate_secrets(self) -> "Settings":
        """Ensure critical secrets are explicitly set and not placeholder values."""
        placeholder_values = {
            "",
            "change-me-to-a-random-secret-key",
            "change-me-to-a-random-jwt-secret",
        }

        if self.secret_key in placeholder_values:
            if self.app_env == "development":
                warnings.warn(
                    "SECRET_KEY is not set or uses a placeholder value. "
                    "Set a strong SECRET_KEY via environment variable or .env file. "
                    "This is REQUIRED in production.",
                    UserWarning,
                    stacklevel=2,
                )
                # Allow development to proceed with a warning
                if self.secret_key == "":
                    self.secret_key = "insecure-dev-only-secret-key"
            else:
                raise ValueError(
                    "SECRET_KEY must be explicitly set to a strong random value in non-development environments. "
                    "Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(64))\""
                )

        if self.jwt_secret_key in placeholder_values:
            if self.app_env == "development":
                warnings.warn(
                    "JWT_SECRET_KEY is not set or uses a placeholder value. "
                    "Set a strong JWT_SECRET_KEY via environment variable or .env file. "
                    "This is REQUIRED in production.",
                    UserWarning,
                    stacklevel=2,
                )
                if self.jwt_secret_key == "":
                    self.jwt_secret_key = "insecure-dev-only-jwt-secret"
            else:
                raise ValueError(
                    "JWT_SECRET_KEY must be explicitly set to a strong random value in non-development environments. "
                    "Generate one with: python -c \"import secrets; print(secrets.token_urlsafe(64))\""
                )

        if self.db_password in ("", "postgres") and self.app_env != "development":
            raise ValueError(
                "DB_PASSWORD must be set to a strong, unique password in non-development environments."
            )
        elif self.db_password in ("", "postgres") and self.app_env == "development":
            warnings.warn(
                "DB_PASSWORD is empty or uses the default 'postgres'. "
                "Set a strong password for production use.",
                UserWarning,
                stacklevel=2,
            )
            if self.db_password == "":
                self.db_password = "postgres"

        return self

    @property
    def async_database_url(self) -> str:
        """Build the async database URL for asyncpg."""
        if self.database_url:
            url = self.database_url
            if url.startswith("postgresql://"):
                return url.replace("postgresql://", "postgresql+asyncpg://", 1)
            if url.startswith("postgresql+asyncpg://"):
                return url
            return url
        return (
            f"postgresql+asyncpg://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    @property
    def sync_database_url(self) -> str:
        """Build the sync database URL for Alembic migrations."""
        if self.database_url:
            url = self.database_url
            if url.startswith("postgresql+asyncpg://"):
                return url.replace("postgresql+asyncpg://", "postgresql://", 1)
            if url.startswith("postgresql://"):
                return url
            return url
        return (
            f"postgresql://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )

    @property
    def cors_origin_list(self) -> list[str]:
        """Parse comma-separated CORS origins into a list."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


settings = Settings()