"""
EXAMPLE tests — demonstrates testing patterns for CRUD endpoints.
DELETE this file when you remove the example entities.

To remove:
1. Delete this file
2. Create tests for your domain endpoints
"""
import pytest
from httpx import AsyncClient

from app.models.user import User


@pytest.mark.asyncio
async def test_create_item(client: AsyncClient, auth_headers: dict[str, str]) -> None:
    """Test creating a new item."""
    response = await client.post(
        "/api/v1/items",
        headers=auth_headers,
        json={
            "title": "Test Item",
            "description": "A test item description",
            "tag_names": ["test", "example"],
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Test Item"
    assert data["description"] == "A test item description"
    assert len(data["tags"]) == 2
    assert "id" in data
    assert "created_at" in data


@pytest.mark.asyncio
async def test_list_items(client: AsyncClient, auth_headers: dict[str, str]) -> None:
    """Test listing items with pagination."""
    # Create an item first
    await client.post(
        "/api/v1/items",
        headers=auth_headers,
        json={"title": "Listed Item", "description": "For listing test"},
    )

    response = await client.get("/api/v1/items", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "page_size" in data
    assert "total_pages" in data
    assert data["total"] >= 1


@pytest.mark.asyncio
async def test_get_item(client: AsyncClient, auth_headers: dict[str, str]) -> None:
    """Test getting a single item by ID."""
    # Create an item
    create_response = await client.post(
        "/api/v1/items",
        headers=auth_headers,
        json={"title": "Get Me", "description": "Item to retrieve"},
    )
    item_id = create_response.json()["id"]

    response = await client.get(f"/api/v1/items/{item_id}", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == item_id
    assert data["title"] == "Get Me"


@pytest.mark.asyncio
async def test_get_item_not_found(client: AsyncClient, auth_headers: dict[str, str]) -> None:
    """Test getting a non-existent item returns 404."""
    fake_id = "00000000-0000-0000-0000-000000000000"
    response = await client.get(f"/api/v1/items/{fake_id}", headers=auth_headers)
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_item(client: AsyncClient, auth_headers: dict[str, str]) -> None:
    """Test updating an item."""
    # Create an item
    create_response = await client.post(
        "/api/v1/items",
        headers=auth_headers,
        json={"title": "Original Title", "description": "Original description"},
    )
    item_id = create_response.json()["id"]

    # Update it
    response = await client.put(
        f"/api/v1/items/{item_id}",
        headers=auth_headers,
        json={"title": "Updated Title", "description": "Updated description"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["description"] == "Updated description"


@pytest.mark.asyncio
async def test_delete_item(client: AsyncClient, auth_headers: dict[str, str]) -> None:
    """Test deleting an item."""
    # Create an item
    create_response = await client.post(
        "/api/v1/items",
        headers=auth_headers,
        json={"title": "Delete Me"},
    )
    item_id = create_response.json()["id"]

    # Delete it
    response = await client.delete(f"/api/v1/items/{item_id}", headers=auth_headers)
    assert response.status_code == 204

    # Verify it's gone
    get_response = await client.get(f"/api/v1/items/{item_id}", headers=auth_headers)
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_items_require_auth(client: AsyncClient) -> None:
    """Test that item endpoints require authentication."""
    response = await client.get("/api/v1/items")
    assert response.status_code in (401, 403)


@pytest.mark.asyncio
async def test_list_tags(client: AsyncClient, auth_headers: dict[str, str]) -> None:
    """Test listing tags (no auth required for GET)."""
    # Create an item with tags first
    await client.post(
        "/api/v1/items",
        headers=auth_headers,
        json={"title": "Tagged Item", "tag_names": ["alpha", "beta"]},
    )

    # Tags endpoint uses DbSession dependency (no auth for GET)
    # But our route definition uses DbSession which doesn't require auth
    # We need to pass through the dependency injection
    response = await client.get("/api/v1/tags")
    assert response.status_code == 200
    data = response.json()
    assert "tags" in data


@pytest.mark.asyncio
async def test_create_tag(client: AsyncClient, auth_headers: dict[str, str]) -> None:
    """Test creating a tag."""
    response = await client.post(
        "/api/v1/tags",
        headers=auth_headers,
        json={"name": "newtag"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "newtag"
    assert "id" in data


@pytest.mark.asyncio
async def test_create_duplicate_tag(client: AsyncClient, auth_headers: dict[str, str]) -> None:
    """Test creating a duplicate tag returns 409."""
    await client.post(
        "/api/v1/tags",
        headers=auth_headers,
        json={"name": "duplicate"},
    )
    response = await client.post(
        "/api/v1/tags",
        headers=auth_headers,
        json={"name": "duplicate"},
    )
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_search_items(client: AsyncClient, auth_headers: dict[str, str]) -> None:
    """Test searching items by title."""
    await client.post(
        "/api/v1/items",
        headers=auth_headers,
        json={"title": "Searchable Unique Item", "description": "Find me"},
    )

    response = await client.get(
        "/api/v1/items",
        headers=auth_headers,
        params={"search": "Searchable Unique"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert any("Searchable" in item["title"] for item in data["items"])


@pytest.mark.asyncio
async def test_items_pagination(client: AsyncClient, auth_headers: dict[str, str]) -> None:
    """Test item listing pagination parameters."""
    response = await client.get(
        "/api/v1/items",
        headers=auth_headers,
        params={"page": 1, "page_size": 5},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["page"] == 1
    assert data["page_size"] == 5