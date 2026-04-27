"""
EXAMPLE service — demonstrates service-layer patterns with SQLAlchemy async.
DELETE this entire file and create your own domain services.

To remove:
1. Delete this file
2. Delete app/api/v1/examples.py
3. Create your domain services (e.g., product_service.py, order_service.py)
"""
import math
from typing import Optional
from uuid import UUID

from sqlalchemy import func, select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from fastapi import HTTPException, status

from app.models.examples import Item, Tag, item_tags
from app.schemas.examples import (
    ItemCreate,
    ItemResponse,
    ItemUpdate,
    TagCreate,
    TagResponse,
)
from app.schemas.common import PaginatedResponse


def _escape_like(search: str) -> str:
    """Escape special characters for SQL LIKE patterns."""
    search = search.replace("\\", "\\\\")
    search = search.replace("%", "\\%")
    search = search.replace("_", "\\_")
    return search


class ExampleService:
    """Encapsulates CRUD logic for example Item and Tag entities."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db

    # ── Items ──

    async def list_items(
        self,
        page: int = 1,
        page_size: int = 20,
        search: Optional[str] = None,
        tags: Optional[list[str]] = None,
        sort_by: str = "created_at_desc",
    ) -> PaginatedResponse[ItemResponse]:
        """List items with pagination, search, tag filtering, and sorting."""
        query = select(Item).options(selectinload(Item.tags))
        count_query = select(func.count(Item.id))

        # Search filter
        if search:
            escaped_search = _escape_like(search)
            search_filter = or_(
                Item.title.ilike(f"%{escaped_search}%", escape="\\"),
                Item.description.ilike(f"%{escaped_search}%", escape="\\"),
            )
            query = query.where(search_filter)
            count_query = count_query.where(search_filter)

        # Tag filter
        if tags:
            query = query.join(Item.tags).where(Tag.name.in_(tags)).distinct()
            count_query = (
                count_query.select_from(Item)
                .join(item_tags, Item.id == item_tags.c.item_id)
                .join(Tag, Tag.id == item_tags.c.tag_id)
                .where(Tag.name.in_(tags))
            )

        # Sorting
        if sort_by == "title_asc":
            query = query.order_by(Item.title.asc())
        elif sort_by == "title_desc":
            query = query.order_by(Item.title.desc())
        else:
            query = query.order_by(Item.created_at.desc())

        # Get total count
        total_result = await self.db.execute(count_query)
        total = total_result.scalar() or 0

        # Pagination
        offset = (page - 1) * page_size
        query = query.offset(offset).limit(page_size)

        result = await self.db.execute(query)
        items = result.scalars().unique().all()

        total_pages = math.ceil(total / page_size) if page_size > 0 else 0

        return PaginatedResponse[ItemResponse](
            items=[ItemResponse.model_validate(item) for item in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=total_pages,
        )

    async def get_item(self, item_id: UUID) -> Optional[ItemResponse]:
        """Get a single item by ID, or None if not found."""
        result = await self.db.execute(
            select(Item).options(selectinload(Item.tags)).where(Item.id == item_id)
        )
        item = result.scalar_one_or_none()
        if item is None:
            return None
        return ItemResponse.model_validate(item)

    async def get_item_model(self, item_id: UUID) -> Optional[Item]:
        """Get the raw Item ORM model by ID (for ownership checks)."""
        result = await self.db.execute(
            select(Item).options(selectinload(Item.tags)).where(Item.id == item_id)
        )
        return result.scalar_one_or_none()

    async def create_item(self, data: ItemCreate, user_id: UUID) -> ItemResponse:
        """Create a new item, resolving or creating tags by name."""
        item = Item(
            title=data.title.strip(),
            description=data.description.strip() if data.description else None,
            user_id=user_id,
        )

        if data.tag_names:
            tags = await self._resolve_tags(data.tag_names)
            item.tags = tags

        self.db.add(item)
        await self.db.commit()
        await self.db.refresh(item)

        # Re-fetch with tags loaded
        result = await self.db.execute(
            select(Item).options(selectinload(Item.tags)).where(Item.id == item.id)
        )
        item = result.scalar_one()
        return ItemResponse.model_validate(item)

    async def update_item(self, item: Item, data: ItemUpdate) -> ItemResponse:
        """Update an existing item's fields and tags."""
        if data.title is not None:
            item.title = data.title.strip()
        if data.description is not None:
            item.description = data.description.strip() if data.description else None
        if data.tag_names is not None:
            tags = await self._resolve_tags(data.tag_names)
            item.tags = tags

        await self.db.commit()
        await self.db.refresh(item)

        # Re-fetch with tags loaded
        result = await self.db.execute(
            select(Item).options(selectinload(Item.tags)).where(Item.id == item.id)
        )
        item = result.scalar_one()
        return ItemResponse.model_validate(item)

    async def delete_item(self, item: Item) -> None:
        """Delete an item."""
        await self.db.delete(item)
        await self.db.commit()

    # ── Tags ──

    async def list_tags(self) -> list[TagResponse]:
        """List all tags."""
        result = await self.db.execute(select(Tag).order_by(Tag.name.asc()))
        tags = result.scalars().all()
        return [TagResponse.model_validate(tag) for tag in tags]

    async def create_tag(self, data: TagCreate) -> TagResponse:
        """Create a new tag. Raises 409 if name already exists."""
        name = data.name.lower().strip()
        result = await self.db.execute(select(Tag).where(Tag.name == name))
        existing = result.scalar_one_or_none()
        if existing is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Tag '{name}' already exists",
            )

        tag = Tag(name=name)
        self.db.add(tag)
        await self.db.commit()
        await self.db.refresh(tag)
        return TagResponse.model_validate(tag)

    # ── Helpers ──

    async def _resolve_tags(self, tag_names: list[str]) -> list[Tag]:
        """Resolve tag names to Tag objects, creating any that don't exist."""
        resolved: list[Tag] = []
        for name in tag_names:
            clean_name = name.lower().strip()
            if not clean_name:
                continue
            result = await self.db.execute(
                select(Tag).where(Tag.name == clean_name)
            )
            tag = result.scalar_one_or_none()
            if tag is None:
                tag = Tag(name=clean_name)
                self.db.add(tag)
                await self.db.flush()
            resolved.append(tag)
        return resolved