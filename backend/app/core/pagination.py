"""
Pagination helpers for building paginated query results.
"""
import math
from typing import TypeVar

T = TypeVar("T")


def calculate_pagination(total: int, page: int, page_size: int) -> dict[str, int]:
    """
    Calculate pagination metadata.

    Returns a dict with: total, page, page_size, total_pages.
    """
    total_pages = math.ceil(total / page_size) if page_size > 0 else 0
    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": total_pages,
    }


def get_offset(page: int, page_size: int) -> int:
    """Calculate the SQL OFFSET from page number and page size."""
    return (max(page, 1) - 1) * page_size