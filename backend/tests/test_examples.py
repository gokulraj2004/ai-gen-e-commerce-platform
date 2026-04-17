"""
EXAMPLE tests — demonstrates testing patterns for CRUD endpoints.
DELETE this entire file and create your own domain tests.

To remove:
1. Delete this file
2. Create your domain test files in tests/
"""
import pytest
from httpx import AsyncClient

from app.models.user import User


@pytest.mark.asyncio
async def test_create_item(
    client: AsyncClient, test_user: User, auth_headers: dict
) -> None:
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
    assert data["user_id"] == str(test_user.id)
    assert len(data["tags"]) == 2
    tag_names = {t["name"] for t in data["tags"]}
    assert "test" in tag_names
    assert "example" in tag_names


@pytest.mark.asyncio
async def test_create_item_without_tags(
    client: AsyncClient, auth_headers: dict
) -> None:
    """Test creating an item without tags."""
    response = await client.post(
        "/api/v1/items",
        headers=auth_headers,
        json={
            "title": "No Tags Item",
            "description": "Item without tags",
        },
    )
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "No Tags Item"
    assert data["tags"] == []


@pytest.mark.asyncio
async def test_create_item_unauthenticated(client: AsyncClient) -> None:
    """Test that creating an item without auth returns 403."""
    response = await client.post(
        "/api/v1/items",
        json={"title": "Unauthorized Item"},
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_list_items(
    client: AsyncClient, test_user: User, auth_headers: dict
) -> None:
    """Test listing items with pagination."""
    # Create a few items
    for i in range(3):
        await client.post(
            "/api/v1/items",
            headers=auth_headers,
            json={"title": f"Item {i}", "description": f"Description {i}"},
        )

    response = await client.get(
        "/api/v1/items",
        headers=auth_headers,
        params={"page": 1, "page_size": 10},
    )
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "page" in data
    assert "page_size" in data
    assert "total_pages" in data
    assert data["total"] >= 3
    assert len(data["items"]) >= 3


@pytest.mark.asyncio
async def test_list_items_with_search(
    client: AsyncClient, auth_headers: dict
) -> None:
    """Test searching items by title."""
    await client.post(
        "/api/v1/items",
        headers=auth_headers,
        json={"title": "Unique Searchable Title", "description": "Some desc"},
    )

    response = await client.get(
        "/api/v1/items",
        headers=auth_headers,
        params={"search": "Unique Searchable"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    assert any("Unique Searchable" in item["title"] for item in data["items"])


@pytest.mark.asyncio
async def test_get_item(
    client: AsyncClient, auth_headers: dict
) -> None:
    """Test getting a single item by ID."""
    create_response = await client.post(
        "/api/v1/items",
        headers=auth_headers,
        json={"title": "Get Me", "description": "Find this item"},
    )
    item_id = create_response.json()["id"]

    response = await client.get(
        f"/api/v1/items/{item_id}",
        headers=auth_headers,
    )
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == item_id
    assert data["title"] == "Get Me"


@pytest.mark.asyncio
async def test_get_item_not_found(
    client: AsyncClient, auth_headers: dict
) -> None:
    """Test getting a non-existent item returns 404."""
    response = await client.get(
        "/api/v1/items/00000000-0000-0000-0000-000000000000",
        headers=auth_headers,
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_update_item(
    client: AsyncClient, auth_headers: dict
) -> None:
    """Test updating an item."""
    create_response = await client.post(
        "/api/v1/items",
        headers=auth_headers,
        json={"title": "Original Title", "description": "Original desc"},
    )
    item_id = create_response.json()["id"]

    response = await client.put(
        f"/api/v1/items/{item_id}",
        headers=auth_headers,
        json={"title": "Updated Title", "description": "Updated desc"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["description"] == "Updated desc"


@pytest.mark.asyncio
async def test_update_item_tags(
    client: AsyncClient, auth_headers: dict
) -> None:
    """Test updating an item's tags."""
    create_response = await client.post(
        "/api/v1/items",
        headers=auth_headers,
        json={"title": "Tagged Item", "tag_names": ["old-tag"]},
    )
    item_id = create_response.json()["id"]

    response = await client.put(
        f"/api/v1/items/{item_id}",
        headers=auth_headers,
        json={"tag_names": ["new-tag-1", "new-tag-2"]},
    )
    assert response.status_code == 200
    data = response.json()
    tag_names = {t["name"] for t in data["tags"]}
    assert "new-tag-1" in tag_names
    assert "new-tag-2" in tag_names
    assert "old-tag" not in tag_names


@pytest.mark.asyncio
async def test_delete_item(
    client: AsyncClient, auth_headers: dict
) -> None:
    """Test deleting an item."""
    create_response = await client.post(
        "/api/v1/items",
        headers=auth_headers,
        json={"title": "Delete Me"},
    )
    item_id = create_response.json()["id"]

    response = await client.delete(
        f"/api/v1/items/{item_id}",
        headers=auth_headers,
    )
    assert response.status_code == 204

    # Verify it's gone
    get_response = await client.get(
        f"/api/v1/items/{item_id}",
        headers=auth_headers,
    )
    assert get_response.status_code == 404


@pytest.mark.asyncio
async def test_delete_item_not_found(
    client: AsyncClient, auth_headers: dict
) -> None:
    """Test deleting a non-existent item returns 404."""
    response = await client.delete(
        "/api/v1/items/00000000-0000-0000-0000-000000000000",
        headers=auth_headers,
    )
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_list_tags(client: AsyncClient, db_session) -> None:
    """Test listing all tags (no auth required)."""
    response = await client.get("/api/v1/tags")
    assert response.status_code == 200
    data = response.json()
    assert "tags" in data
    assert isinstance(data["tags"], list)


@pytest.mark.asyncio
async def test_create_tag(
    client: AsyncClient, auth_headers: dict
) -> None:
    """Test creating a new tag."""
    response = await client.post(
        "/api/v1/tags",
        headers=auth_headers,
        json={"name": "new-tag"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "new-tag"
    assert "id" in data


@pytest.mark.asyncio
async def test_create_duplicate_tag(
    client: AsyncClient, auth_headers: dict
) -> None:
    """Test creating a duplicate tag returns 409."""
    await client.post(
        "/api/v1/tags",
        headers=auth_headers,
        json={"name": "duplicate-tag"},
    )

    response = await client.post(
        "/api/v1/tags",
        headers=auth_headers,
        json={"name": "duplicate-tag"},
    )
    assert response.status_code == 409


@pytest.mark.asyncio
async def test_create_tag_unauthenticated(client: AsyncClient) -> None:
    """Test that creating a tag without auth returns 403."""
    response = await client.post(
        "/api/v1/tags",
        json={"name": "unauth-tag"},
    )
    assert response.status_code == 403


@pytest.mark.asyncio
async def test_list_items_with_tag_filter(
    client: AsyncClient, auth_headers: dict
) -> None:
    """Test filtering items by tag names."""
    await client.post(
        "/api/v1/items",
        headers=auth_headers,
        json={"title": "Tagged Item A", "tag_names": ["filter-tag"]},
    )
    await client.post(
        "/api/v1/items",
        headers=auth_headers,
        json={"title": "Tagged Item B", "tag_names": ["other-tag"]},
    )

    response = await client.get(
        "/api/v1/items",
        headers=auth_headers,
        params={"tags": ["filter-tag"]},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["total"] >= 1
    for item in data["items"]:
        tag_names = {t["name"] for t in item["tags"]}
        assert "filter-tag" in tag_names


@pytest.mark.asyncio
async def test_list_items_sorting(
    client: AsyncClient, auth_headers: dict
) -> None:
    """Test sorting items by title ascending."""
    await client.post(
        "/api/v1/items",
        headers=auth_headers,
        json={"title": "Zebra Item"},
    )
    await client.post(
        "/api/v1/items",
        headers=auth_headers,
        json={"title": "Alpha Item"},
    )

    response = await client.get(
        "/api/v1/items",
        headers=auth_headers,
        params={"sort_by": "title_asc"},
    )
    assert response.status_code == 200
    data = response.json()
    titles = [item["title"] for item in data["items"]]
    assert titles == sorted(titles)