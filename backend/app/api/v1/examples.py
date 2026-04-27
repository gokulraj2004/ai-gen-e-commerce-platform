"""
EXAMPLE CRUD endpoints — demonstrates FastAPI route patterns.
DELETE this entire file and create your own domain endpoints.

To remove:
1. Delete this file
2. Remove the examples router import from app/api/router.py
3. Create your domain router files (e.g., v1/products.py, v1/orders.py)
"""
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, status

from app.api.deps import CurrentUser, DbSession
from app.schemas.examples import (
    ItemCreate,
    ItemResponse,
    ItemUpdate,
    TagCreate,
    TagResponse,
)
from app.schemas.common import PaginatedResponse
from app.services.example_service import ExampleService

router = APIRouter()


# ── Item Endpoints (EXAMPLE - DELETE & replace) ──


@router.get(
    "/items",
    response_model=PaginatedResponse[ItemResponse],
    summary="List items (paginated)",
)
async def list_items(
    db: DbSession,
    current_user: CurrentUser,
    page: int = Query(default=1, ge=1, description="Page number"),
    per_page: int = Query(default=20, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(default=None, description="Search title/description"),
    tags: Optional[list[str]] = Query(default=None, description="Filter by tag names"),
    sort_by: str = Query(
        default="created_at_desc",
        regex="^(title_asc|title_desc|created_at_desc)$",
        description="Sort order",
    ),
) -> PaginatedResponse[ItemResponse]:
    """List items with pagination, search, tag filtering, and sorting."""
    service = ExampleService(db)
    result = await service.list_items(
        page=page,
        page_size=per_page,
        search=search,
        tags=tags,
        sort_by=sort_by,
    )
    return result


@router.get(
    "/items/{item_id}",
    response_model=ItemResponse,
    summary="Get a single item",
)
async def get_item(
    item_id: UUID,
    db: DbSession,
    current_user: CurrentUser,
) -> ItemResponse:
    """Retrieve a single item by its ID."""
    service = ExampleService(db)
    item = await service.get_item(item_id)
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )
    return item


@router.post(
    "/items",
    response_model=ItemResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create an item",
)
async def create_item(
    data: ItemCreate,
    db: DbSession,
    current_user: CurrentUser,
) -> ItemResponse:
    """Create a new item owned by the current user."""
    service = ExampleService(db)
    item = await service.create_item(data, current_user.id)
    return item


@router.put(
    "/items/{item_id}",
    response_model=ItemResponse,
    summary="Update an item",
)
async def update_item(
    item_id: UUID,
    data: ItemUpdate,
    db: DbSession,
    current_user: CurrentUser,
) -> ItemResponse:
    """Update an existing item. Only the owner can update."""
    service = ExampleService(db)
    item = await service.get_item_model(item_id)
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )
    if item.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this item",
        )
    updated = await service.update_item(item, data)
    return updated


@router.delete(
    "/items/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete an item",
)
async def delete_item(
    item_id: UUID,
    db: DbSession,
    current_user: CurrentUser,
) -> None:
    """Delete an item. Only the owner can delete."""
    service = ExampleService(db)
    item = await service.get_item_model(item_id)
    if item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Item not found",
        )
    if item.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this item",
        )
    await service.delete_item(item)


# ── Tag Endpoints (EXAMPLE - DELETE & replace) ──


@router.get(
    "/tags",
    response_model=dict,
    summary="List all tags",
)
async def list_tags(db: DbSession) -> dict:
    """List all available tags. No authentication required."""
    service = ExampleService(db)
    tags = await service.list_tags()
    return {"tags": tags}


@router.post(
    "/tags",
    response_model=TagResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Create a tag",
)
async def create_tag(
    data: TagCreate,
    db: DbSession,
    current_user: CurrentUser,
) -> TagResponse:
    """Create a new tag."""
    service = ExampleService(db)
    tag = await service.create_tag(data)
    return tag