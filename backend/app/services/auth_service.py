"""
Authentication service — handles registration, login, token refresh, logout, and profile updates.
This is a CORE service — KEEP for your application.
"""
from datetime import datetime, timezone
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_token,
    hash_password,
    verify_password,
)
from app.models.token_blocklist import TokenBlocklist
from app.models.user import User
from app.schemas.auth import (
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UserUpdateRequest,
)


class AuthService:
    """Handles all authentication-related business logic."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    async def register(self, data: RegisterRequest) -> User:
        """
        Register a new user. Raises 409 if email already exists.
        """
        result = await self.db.execute(
            select(User).where(User.email == data.email.lower())
        )
        existing_user = result.scalar_one_or_none()
        if existing_user is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email already exists",
            )

        user = User(
            email=data.email.lower().strip(),
            hashed_password=hash_password(data.password),
            first_name=data.first_name.strip(),
            last_name=data.last_name.strip(),
        )
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def authenticate(self, data: LoginRequest) -> TokenResponse:
        """
        Authenticate a user by email and password. Returns JWT token pair.
        Raises 401 on invalid credentials.
        """
        result = await self.db.execute(
            select(User).where(User.email == data.email.lower())
        )
        user = result.scalar_one_or_none()

        if user is None or not verify_password(data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password",
            )

        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is deactivated",
            )

        access_token, access_jti = create_access_token(subject=str(user.id))
        refresh_token, refresh_jti = create_refresh_token(subject=str(user.id))

        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
            expires_in=1800,
        )

    async def refresh_tokens(self, refresh_token: str) -> TokenResponse:
        """
        Validate a refresh token and issue a new token pair.
        The old refresh token is blocklisted.
        """
        payload = decode_token(refresh_token)
        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token",
            )

        token_type = payload.get("type")
        if token_type != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type, refresh token required",
            )

        jti = payload.get("jti")
        if jti:
            result = await self.db.execute(
                select(TokenBlocklist).where(TokenBlocklist.jti == jti)
            )
            if result.scalar_one_or_none() is not None:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Refresh token has been revoked",
                )

        user_id_str = payload.get("sub")
        if user_id_str is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )

        try:
            user_id = UUID(user_id_str)
        except ValueError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token payload",
            )

        result = await self.db.execute(select(User).where(User.id == user_id))
        user = result.scalar_one_or_none()
        if user is None or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or deactivated",
            )

        # Blocklist the old refresh token
        if jti:
            exp = payload.get("exp")
            expires_at = datetime.fromtimestamp(exp, tz=timezone.utc) if exp else datetime.now(timezone.utc)
            blocklist_entry = TokenBlocklist(
                jti=jti,
                token_type="refresh",
                user_id=user_id,
                expires_at=expires_at,
            )
            self.db.add(blocklist_entry)
            await self.db.commit()

        new_access_token, _ = create_access_token(subject=str(user.id))
        new_refresh_token, _ = create_refresh_token(subject=str(user.id))

        return TokenResponse(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            token_type="bearer",
            expires_in=1800,
        )

    async def logout(self, refresh_token: str, user_id: UUID) -> None:
        """
        Blocklist the provided refresh token so it can no longer be used.
        """
        payload = decode_token(refresh_token)
        if payload is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid refresh token",
            )

        jti = payload.get("jti")
        if not jti:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token missing JTI claim",
            )

        # Check if already blocklisted
        result = await self.db.execute(
            select(TokenBlocklist).where(TokenBlocklist.jti == jti)
        )
        if result.scalar_one_or_none() is not None:
            return  # Already blocklisted, idempotent

        exp = payload.get("exp")
        expires_at = datetime.fromtimestamp(exp, tz=timezone.utc) if exp else datetime.now(timezone.utc)

        blocklist_entry = TokenBlocklist(
            jti=jti,
            token_type="refresh",
            user_id=user_id,
            expires_at=expires_at,
        )
        self.db.add(blocklist_entry)
        await self.db.commit()

    async def update_profile(self, user: User, data: UserUpdateRequest) -> User:
        """
        Update the user's profile fields. Only provided fields are updated.
        """
        update_data = data.model_dump(exclude_unset=True)

        if "first_name" in update_data:
            user.first_name = update_data["first_name"].strip()
        if "last_name" in update_data:
            user.last_name = update_data["last_name"].strip()

        await self.db.commit()
        await self.db.refresh(user)
        return user