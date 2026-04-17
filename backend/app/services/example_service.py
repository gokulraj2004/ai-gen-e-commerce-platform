"""
EXAMPLE service — business logic for items and tags.
DELETE this file when you create your own domain services.
"""
from typing import Optional
from uuid import UUID

from fastapi import HTTPException, status
from sqlalchemy import select, func, or_
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.examples import Item, Tag, item_tags
from app.schemas.examples import (
    ItemCreate,
    ItemResponse,
    ItemUpdate,
    TagCreate,
    TagResponse,
)
from app.schemas.common import PaginatedResponse


class ExampleService:
    """Service layer for example CRUD operations."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_item(self, item_id: UUID) -> Optional[ItemResponse]:
        """Get a single item by ID, returning a Pydantic schema or None."""
        stmt = (
            select(Item)
            .options(selectinload(Item.tags))
            .where(Item.id == item_id)
        )
        result = await self.db.execute(stmt)
        item = result.scalar_one_or_none()
        if item is None:
            return None
        return ItemResponse.model_validate(item)

    async def _get_item_orm(self, item_id: UUID) -> Optional[Item]:
        """Get a single item ORM model by ID (for internal use)."""
        stmt = (
            select(Item)
            .options(selectinload(Item.tags))
            .where(Item.id == item_id)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def list_items(
        self,
        page: int = 1,
        page_size: int = 20,
        search: Optional[str] = None,
        tags: Optional[list[str]] = None,
        sort_by: str = "created_at_desc",
    ) -> PaginatedResponse[ItemResponse]:
        """List items with pagination, search, filtering, and sorting."""
        stmt = select(Item).options(selectinload(Item.tags))
        count_stmt = select(func.count(Item.id))

        if search:
            search_filter = or_(
                Item.title.ilike(f"%{search}%"),
                Item.description.ilike(f"%{search}%"),
            )
            stmt = stmt.where(search_filter)
            count_stmt = count_stmt.where(search_filter)

        if tags:
            stmt = stmt.join(Item.tags).where(Tag.name.in_(tags))
            count_stmt = count_stmt.join(Item.tags).where(Tag.name.in_(tags))

        # Sorting
        if sort_by == "title_asc":
            stmt = stmt.order_by(Item.title.asc())
        elif sort_by == "title_desc":
            stmt = stmt.order_by(Item.title.desc())
        else:
            stmt = stmt.order_by(Item.created_at.desc())

        # Count total
        total_result = await self.db.execute(count_stmt)
        total = total_result.scalar() or 0

        # Pagination
        offset = (page - 1) * page_size
        stmt = stmt.offset(offset).limit(page_size)

        result = await self.db.execute(stmt)
        items = result.scalars().unique().all()

        return PaginatedResponse[ItemResponse](
            items=[ItemResponse.model_validate(item) for item in items],
            total=total,
            page=page,
            page_size=page_size,
            total_pages=(total + page_size - 1) // page_size if total > 0 else 0,
        )

    async def _get_or_create_tags(self, tag_names: list[str]) -> list[Tag]:
        """Get existing tags by name or create them if they don't exist."""
        if not tag_names:
            return []

        # Find existing tags
        stmt = select(Tag).where(Tag.name.in_(tag_names))
        result = await self.db.execute(stmt)
        existing_tags = list(result.scalars().all())
        existing_names = {tag.name for tag in existing_tags}

        # Create missing tags
        new_tags = []
        for name in tag_names:
            if name not in existing_names:
                new_tag = Tag(name=name)
                self.db.add(new_tag)
                new_tags.append(new_tag)

        if new_tags:
            await self.db.flush()

        return existing_tags + new_tags

    async def create_item(self, data: ItemCreate, user_id: UUID) -> ItemResponse:
        """Create a new item."""
        item = Item(
            title=data.title,
            description=data.description,
            user_id=user_id,
        )

        if data.tag_names:
            tags_list = await self._get_or_create_tags(data.tag_names)
            item.tags = tags_list

        self.db.add(item)
        await self.db.commit()
        await self.db.refresh(item, attribute_names=["tags"])
        return ItemResponse.model_validate(item)

    async def update_item(self, item_id: UUID, data: ItemUpdate) -> Optional[ItemResponse]:
        """Update an item by ID."""
        item = await self._get_item_orm(item_id)
        if item is None:
            return None

        update_data = data.model_dump(exclude_unset=True)
        tag_names = update_data.pop("tag_names", None)

        for field, value in update_data.items():
            setattr(item, field, value)

        if tag_names is not None:
            tags_list = await self._get_or_create_tags(tag_names)
            item.tags = tags_list

        await self.db.commit()
        await self.db.refresh(item, attribute_names=["tags"])
        return ItemResponse.model_validate(item)

    async def update_item_with_ownership(
        self,
        item_id: UUID,
        data: ItemUpdate,
        user_id: UUID,
    ) -> Optional[ItemResponse]:
        """Update an item, checking ownership atomically."""
        item = await self._get_item_orm(item_id)
        if item is None:
            return None

        if item.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only update your own items",
            )

        update_data = data.model_dump(exclude_unset=True)
        tag_names = update_data.pop("tag_names", None)

        for field, value in update_data.items():
            setattr(item, field, value)

        if tag_names is not None:
            tags_list = await self._get_or_create_tags(tag_names)
            item.tags = tags_list

        await self.db.commit()
        await self.db.refresh(item, attribute_names=["tags"])
        return ItemResponse.model_validate(item)

    async def delete_item(self, item_id: UUID) -> bool:
        """Delete an item by ID."""
        item = await self._get_item_orm(item_id)
        if item is None:
            return False
        await self.db.delete(item)
        await self.db.commit()
        return True

    async def delete_item_with_ownership(
        self,
        item_id: UUID,
        user_id: UUID,
    ) -> Optional[bool]:
        """Delete an item, checking ownership atomically."""
        item = await self._get_item_orm(item_id)
        if item is None:
            return None

        if item.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You can only delete your own items",
            )

        await self.db.delete(item)
        await self.db.commit()
        return True

    async def list_tags(self) -> list[TagResponse]:
        """List all tags."""
        stmt = select(Tag).order_by(Tag.name)
        result = await self.db.execute(stmt)
        tags = result.scalars().all()
        return [TagResponse.model_validate(tag) for tag in tags]

    async def create_tag(self, data: TagCreate) -> TagResponse:
        """Create a new tag."""
        # Check for existing tag with the same name
        existing_stmt = select(Tag).where(Tag.name == data.name)
        existing_result = await self.db.execute(existing_stmt)
        existing_tag = existing_result.scalar_one_or_none()
        if existing_tag is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Tag with name '{data.name}' already exists",
            )

        tag = Tag(name=data.name)
        self.db.add(tag)
        try:
            await self.db.commit()
        except IntegrityError:
            await self.db.rollback()
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Tag with name '{data.name}' already exists",
            )
        await self.db.refresh(tag)
        return TagResponse.model_validate(tag)