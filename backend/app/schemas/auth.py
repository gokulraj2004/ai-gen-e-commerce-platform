"""
Authentication-related Pydantic schemas.
KEEP — these are part of the core auth system.
"""
import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field, ConfigDict


class LoginRequest(BaseModel):
    """Schema for user login."""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)


class RegisterRequest(BaseModel):
    """Schema for user registration."""
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)


class TokenResponse(BaseModel):
    """Schema for JWT token pair response."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int


class RefreshRequest(BaseModel):
    """Schema for token refresh request."""
    refresh_token: str


class LogoutRequest(BaseModel):
    """Schema for logout request (blocklist refresh token)."""
    refresh_token: str


class UserResponse(BaseModel):
    """Schema for user profile response."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    email: str
    first_name: str
    last_name: str
    is_active: bool
    created_at: datetime
    updated_at: datetime


class UserUpdateRequest(BaseModel):
    """Schema for updating user profile."""
    first_name: str | None = Field(None, min_length=1, max_length=100)
    last_name: str | None = Field(None, min_length=1, max_length=100)