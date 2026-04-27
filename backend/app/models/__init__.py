"""
SQLAlchemy models package.
Import all models here so Alembic can discover them for auto-generating migrations.
"""
from app.models.base import Base
from app.models.user import User
from app.models.examples import Item, Tag, item_tags
from app.models.token_blocklist import TokenBlocklist

__all__ = [
    "Base",
    "User",
    "Item",
    "Tag",
    "item_tags",
    "TokenBlocklist",
]