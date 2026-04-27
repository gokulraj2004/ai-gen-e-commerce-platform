"""
Common/shared Pydantic schemas used across the application.
"""
from typing import Any, Generic, TypeVar

from pydantic import BaseModel

T = TypeVar("T")


class MessageResponse(BaseModel):
    """Generic message response."""

    message: str


class ErrorResponse(BaseModel):
    """Standard error response format."""

    detail: str
    status_code: int


class PaginatedResponse(BaseModel):
    """Generic paginated response schema."""

    items: list[Any]
    total: int
    page: int
    page_size: int
    total_pages: int


class HealthResponse(BaseModel):
    """Health check response."""

    status: str
    database: str
    version: str