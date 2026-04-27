"""
Pydantic schemas package.
Re-exports all schema classes for convenient imports.
"""
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    RefreshTokenRequest,
    UserResponse,
    UserUpdateRequest,
)
from app.schemas.examples import (
    ItemCreate,
    ItemUpdate,
    ItemResponse,
    TagCreate,
    TagResponse,
    ItemListResponse,
    TagListResponse,
)
from app.schemas.common import (
    PaginatedResponse,
    MessageResponse,
    ErrorResponse,
    HealthResponse,
)

__all__ = [
    "LoginRequest",
    "RegisterRequest",
    "TokenResponse",
    "RefreshTokenRequest",
    "UserResponse",
    "UserUpdateRequest",
    "ItemCreate",
    "ItemUpdate",
    "ItemResponse",
    "TagCreate",
    "TagResponse",
    "ItemListResponse",
    "TagListResponse",
    "PaginatedResponse",
    "MessageResponse",
    "ErrorResponse",
    "HealthResponse",
]