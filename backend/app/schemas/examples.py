"""
EXAMPLE SCHEMAS — Demonstrates Pydantic schema patterns.
DELETE this file and create your own domain schemas.

To remove:
1. Delete this file
2. Remove imports from app/schemas/__init__.py
3. Create your own schemas following the same patterns
"""
import uuid
from datetime import datetime

from pydantic import BaseModel, Field


class TagCreate(BaseModel):
    """Schema for creating a tag. REPLACE with your domain schema."""

    name: str = Field(..., min_length=1, max_length=100)


class TagResponse(BaseModel):
    """Schema for tag in responses. REPLACE with your domain schema."""

    id: uuid.UUID
    name: str
    created_at: datetime

    model_config = {"from_attributes": True}


class TagListResponse(BaseModel):
    """Schema for list of tags response."""

    tags: list[TagResponse]


class ItemCreate(BaseModel):
    """Schema for creating an item. REPLACE with your domain schema."""

    title: str = Field(..., min_length=1, max_length=255)
    description: str | None = None
    tag_names: list[str] = Field(default_factory=list)


class ItemUpdate(BaseModel):
    """Schema for updating an item. REPLACE with your domain schema."""

    title: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = None
    tag_names: list[str] | None = None


class ItemResponse(BaseModel):
    """Schema for item in responses. REPLACE with your domain schema."""

    id: uuid.UUID
    title: str
    description: str | None
    tags: list[TagResponse]
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}


class ItemListResponse(BaseModel):
    """Schema for paginated item list response."""

    items: list[ItemResponse]
    total: int
    page: int
    page_size: int
    total_pages: int