"""
Pytest fixtures for async testing with FastAPI and SQLAlchemy.
Provides a test database, async client, and authenticated request helpers.
"""
import asyncio
from typing import AsyncGenerator, Generator
from uuid import uuid4

import pytest
import pytest_asyncio
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

from app.config import settings
from app.database import get_db
from app.main import create_app
from app.models.base import Base
from app.core.security import create_access_token, hash_password
from app.models.user import User


# Use the async_database_url property which handles URL construction correctly
TEST_DATABASE_URL = settings.async_database_url

# For testing, use the configured test DB with asyncpg driver
engine_test = create_async_engine(TEST_DATABASE_URL, echo=False)
TestSessionLocal = async_sessionmaker(
    engine_test, class_=AsyncSession, expire_on_commit=False
)


@pytest.fixture(scope="session")
def event_loop() -> Generator[asyncio.AbstractEventLoop, None, None]:
    """Create a single event loop for the entire test session."""
    loop = asyncio.new_event_loop()
    yield loop
    loop.close()


@pytest_asyncio.fixture(scope="function")
async def db_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Create all tables before each test and drop them after.
    Yields a fresh database session.
    """
    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with TestSessionLocal() as session:
        yield session

    async with engine_test.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture(scope="function")
async def client(db_session: AsyncSession) -> AsyncGenerator[AsyncClient, None]:
    """
    Provide an async HTTP client with the test database session injected.
    """
    app = create_app()

    async def override_get_db() -> AsyncGenerator[AsyncSession, None]:
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac

    app.dependency_overrides.clear()


@pytest_asyncio.fixture(scope="function")
async def test_user(db_session: AsyncSession) -> User:
    """Create and return a test user in the database."""
    user = User(
        id=uuid4(),
        email="testuser@example.com",
        hashed_password=hash_password("TestPassword123!"),
        first_name="Test",
        last_name="User",
        is_active=True,
        is_admin=False,
    )
    db_session.add(user)
    await db_session.commit()
    await db_session.refresh(user)
    return user


@pytest_asyncio.fixture(scope="function")
async def auth_headers(test_user: User) -> dict[str, str]:
    """Return authorization headers with a valid access token for the test user."""
    access_token, _ = create_access_token(subject=str(test_user.id))
    return {"Authorization": f"Bearer {access_token}"}