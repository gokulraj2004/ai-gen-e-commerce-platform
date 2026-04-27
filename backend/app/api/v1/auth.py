"""
Authentication endpoints: register, login, refresh, logout, profile.
These are CORE endpoints — KEEP for your application.
"""
from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentUser, DbSession
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    RefreshRequest,
    LogoutRequest,
    UserResponse,
    UserUpdateRequest,
)
from app.schemas.common import MessageResponse
from app.services.auth_service import AuthService

router = APIRouter()


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
async def register(data: RegisterRequest, db: DbSession) -> UserResponse:
    """Register a new user account with email and password."""
    service = AuthService(db)
    user = await service.register(data)
    return UserResponse.model_validate(user)


@router.post(
    "/login",
    response_model=TokenResponse,
    summary="Login and receive tokens",
)
async def login(data: LoginRequest, db: DbSession) -> TokenResponse:
    """Authenticate with email and password, receive access and refresh tokens."""
    service = AuthService(db)
    tokens = await service.authenticate(data)
    return tokens


@router.post(
    "/refresh",
    response_model=TokenResponse,
    summary="Refresh access token",
)
async def refresh(data: RefreshRequest, db: DbSession) -> TokenResponse:
    """Use a valid refresh token to obtain a new access/refresh token pair."""
    service = AuthService(db)
    tokens = await service.refresh_tokens(data.refresh_token)
    return tokens


@router.post(
    "/logout",
    response_model=MessageResponse,
    summary="Logout and revoke refresh token",
)
async def logout(
    data: LogoutRequest,
    db: DbSession,
    current_user: CurrentUser,
) -> MessageResponse:
    """Revoke the provided refresh token, effectively logging out."""
    service = AuthService(db)
    await service.logout(data.refresh_token, current_user.id)
    return MessageResponse(message="Successfully logged out")


@router.get(
    "/me",
    response_model=UserResponse,
    summary="Get current user profile",
)
async def get_me(current_user: CurrentUser) -> UserResponse:
    """Return the profile of the currently authenticated user."""
    return UserResponse.model_validate(current_user)


@router.put(
    "/me",
    response_model=UserResponse,
    summary="Update current user profile",
)
async def update_me(
    data: UserUpdateRequest,
    db: DbSession,
    current_user: CurrentUser,
) -> UserResponse:
    """Update the profile fields of the currently authenticated user."""
    service = AuthService(db)
    updated_user = await service.update_profile(current_user, data)
    return UserResponse.model_validate(updated_user)