"""
Token blocklist model — stores revoked JWT refresh tokens.
KEEP this model; it is part of the authentication system.
"""
from __future__ import annotations

import uuid
from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import DateTime, ForeignKey, String
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.user import User


class TokenBlocklist(Base, UUIDPrimaryKeyMixin):
    """
    Stores revoked/blocklisted JWT tokens to prevent reuse after logout.
    This is a core auth model — keep it.
    """

    __tablename__ = "token_blocklist"

    jti: Mapped[str] = mapped_column(
        String(36), unique=True, nullable=False, index=True
    )
    token_type: Mapped[str] = mapped_column(
        String(10), nullable=False
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default="now()",
    )

    # ── Relationships ──
    user: Mapped[User] = relationship("User", back_populates="blocklisted_tokens")

    def __repr__(self) -> str:
        return f"<TokenBlocklist(jti={self.jti!r}, token_type={self.token_type!r})>"