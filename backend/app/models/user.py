"""
User model — core authentication entity.
KEEP this model; it is part of the authentication system.
"""
from __future__ import annotations

from typing import TYPE_CHECKING

from sqlalchemy import Boolean, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.examples import Item
    from app.models.token_blocklist import TokenBlocklist


class User(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """
    User account for authentication and authorization.
    This is a core model — keep it and extend as needed.
    """

    __tablename__ = "users"

    email: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False, index=True
    )
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name: Mapped[str] = mapped_column(String(100), nullable=False)
    last_name: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, nullable=False, default=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    # ── Relationships ──
    # EXAMPLE relationship — DELETE when removing example models
    items: Mapped[list[Item]] = relationship(
        "Item", back_populates="user", cascade="all, delete-orphan", lazy="selectin"
    )

    # Auth relationship — KEEP
    blocklisted_tokens: Mapped[list[TokenBlocklist]] = relationship(
        "TokenBlocklist", back_populates="user", cascade="all, delete-orphan", lazy="selectin"
    )

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email!r})>"