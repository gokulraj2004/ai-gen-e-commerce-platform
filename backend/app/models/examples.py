"""
EXAMPLE MODELS — Demonstrates SQLAlchemy ORM patterns.
DELETE this entire file and create your own domain models.

To remove:
1. Delete this file (app/models/examples.py)
2. Remove imports from app/models/__init__.py
3. Remove the 'items' relationship from User model
4. Delete related schemas (app/schemas/examples.py)
5. Delete related API routes (app/api/v1/examples.py)
6. Delete related service (app/services/example_service.py)
7. Generate a new Alembic migration to drop the tables
"""
from __future__ import annotations

import uuid
from datetime import datetime, timezone
from typing import TYPE_CHECKING

from sqlalchemy import (
    Column,
    DateTime,
    ForeignKey,
    String,
    Table,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

if TYPE_CHECKING:
    from app.models.user import User

# ── Association table for many-to-many: items <-> tags ──
item_tags = Table(
    "item_tags",
    Base.metadata,
    Column(
        "item_id",
        UUID(as_uuid=True),
        ForeignKey("items.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "tag_id",
        UUID(as_uuid=True),
        ForeignKey("tags.id", ondelete="CASCADE"),
        primary_key=True,
    ),
    Column(
        "created_at",
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        default=lambda: datetime.now(timezone.utc),
    ),
)


class Item(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """
    Generic item entity — demonstrates common model patterns.
    REPLACE with your domain entities (e.g., Product, Post, Task, Project, etc.)
    """

    __tablename__ = "items"

    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # ── Relationships ──
    user: Mapped[User] = relationship("User", back_populates="items")
    tags: Mapped[list[Tag]] = relationship(
        "Tag",
        secondary=item_tags,
        back_populates="items",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Item(id={self.id}, title={self.title!r})>"


class Tag(Base, UUIDPrimaryKeyMixin):
    """
    Generic tag entity — demonstrates many-to-many relationships.
    REPLACE with your domain entities.
    """

    __tablename__ = "tags"

    name: Mapped[str] = mapped_column(
        String(100), unique=True, nullable=False, index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        server_default=func.now(),
        default=lambda: datetime.now(timezone.utc),
    )

    # ── Relationships ──
    items: Mapped[list[Item]] = relationship(
        "Item",
        secondary=item_tags,
        back_populates="tags",
        lazy="selectin",
    )

    def __repr__(self) -> str:
        return f"<Tag(id={self.id}, name={self.name!r})>"