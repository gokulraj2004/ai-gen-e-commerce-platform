"""
Pydantic schemas (request/response models) package.
Import and re-export all schemas for convenient access.
"""
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    RefreshRequest,
    LogoutRequest,
    UserResponse,
    UserUpdateRequest,
)
from app.schemas.common import (
    ErrorResponse,
    MessageResponse,
    PaginatedResponse,
    HealthResponse,
)

# ── EXAMPLE SCHEMAS — DELETE when removing example models ──
from app.schemas.examples import (
    ItemCreate,
    ItemUpdate,
    ItemResponse,
    TagCreate,
    TagResponse,
    ItemListResponse,
    TagListResponse,
)

__all__ = [
    # Auth
    "LoginRequest",
    "RegisterRequest",
    "TokenResponse",
    "RefreshRequest",
    "LogoutRequest",
    "UserResponse",
    "UserUpdateRequest",
    # Common
    "ErrorResponse",
    "MessageResponse",
    "PaginatedResponse",
    "HealthResponse",
    # EXAMPLE — DELETE these exports
    "ItemCreate",
    "ItemUpdate",
    "ItemResponse",
    "TagCreate",
    "TagResponse",
    "ItemListResponse",
    "TagListResponse",
]