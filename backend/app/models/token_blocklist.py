"""
Token blocklist model — KEEP this file. Part of the authentication system.
Used to revoke/invalidate refresh tokens on logout.
"""
import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, UUIDPrimaryKeyMixin


class TokenBlocklist(UUIDPrimaryKeyMixin, Base):
    """
    Stores revoked/blocklisted JWT tokens.
    Part of the core auth system — KEEP this model.
    """

    __tablename__ = "token_blocklist"

    jti: Mapped[str] = mapped_column(
        String(36),
        unique=True,
        nullable=False,
        index=True,
    )
    token_type: Mapped[str] = mapped_column(
        String(10),
        nullable=False,
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
    )
    expires_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
    )

    # Relationships
    user: Mapped["User"] = relationship(  # noqa: F821
        "User",
        back_populates="blocklisted_tokens",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<TokenBlocklist(id={self.id}, jti={self.jti}, type={self.token_type})>"