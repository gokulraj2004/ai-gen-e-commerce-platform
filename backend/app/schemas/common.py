"""
Common/shared Pydantic schemas used across the application.
"""
from typing import Generic, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class MessageResponse(BaseModel):
    """Generic message response."""
    message: str


class ErrorResponse(BaseModel):
    """Standard error response."""
    detail: str
    status_code: int = 400


class PaginatedResponse(BaseModel, Generic[T]):
    """
    Generic paginated response wrapper.
    Usage: PaginatedResponse[ItemResponse]
    """
    items: list[T] = Field(default_factory=list)
    total: int = 0
    page: int = 1
    page_size: int = 20
    total_pages: int = 0


class HealthResponse(BaseModel):
    """Health check response."""
    status: str
    database: str
    version: str