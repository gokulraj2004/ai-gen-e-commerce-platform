"""
EXAMPLE SCHEMAS — Demonstrates Pydantic model patterns for request/response validation.
DELETE this entire file when you create your own domain schemas.

To remove:
1. Delete this file (app/schemas/examples.py)
2. Remove imports from app/schemas/__init__.py
3. Create your own domain schemas
"""
import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class TagCreate(BaseModel):
    """Schema for creating a tag. REPLACE with your domain schema."""
    name: str = Field(..., min_length=1, max_length=100)


class TagResponse(BaseModel):
    """Schema for tag response. REPLACE with your domain schema."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    name: str
    created_at: datetime


class TagListResponse(BaseModel):
    """Schema for list of tags response."""
    tags: list[TagResponse] = Field(default_factory=list)


class ItemCreate(BaseModel):
    """Schema for creating an item. REPLACE with your domain schema."""
    title: str = Field(..., min_length=1, max_length=255)
    description: str | None = Field(None, max_length=5000)
    tag_names: list[str] = Field(default_factory=list)


class ItemUpdate(BaseModel):
    """Schema for updating an item. REPLACE with your domain schema."""
    title: str | None = Field(None, min_length=1, max_length=255)
    description: str | None = Field(None, max_length=5000)
    tag_names: list[str] | None = None


class ItemResponse(BaseModel):
    """Schema for item response. REPLACE with your domain schema."""
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: str
    description: str | None
    tags: list[TagResponse] = Field(default_factory=list)
    user_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class ItemListResponse(BaseModel):
    """Schema for paginated item list response."""
    items: list[ItemResponse] = Field(default_factory=list)
    total: int = 0
    page: int = 1
    page_size: int = 20
    total_pages: int = 0