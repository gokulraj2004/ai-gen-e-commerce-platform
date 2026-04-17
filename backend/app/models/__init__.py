"""
Import all models here so Alembic can discover them via Base.metadata.

When you add new models, import them in this file.
"""
from app.models.base import Base
from app.models.user import User
from app.models.token_blocklist import TokenBlocklist

# ── EXAMPLE MODELS — DELETE when you create your own domain models ──
from app.models.examples import Item, Tag, item_tags

__all__ = [
    "Base",
    "User",
    "TokenBlocklist",
    # EXAMPLE — DELETE these exports
    "Item",
    "Tag",
    "item_tags",
]