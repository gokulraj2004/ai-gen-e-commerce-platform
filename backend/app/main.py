"""
Application factory — creates and configures the FastAPI application.
"""
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from sqlalchemy import text

from app.config import settings
from app.core.exceptions import register_exception_handlers
from app.database import async_session_factory
from app.middleware.cors import setup_cors


def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application instance.

    Returns:
        Configured FastAPI application.
    """
    application = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        debug=settings.debug,
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    # ── Middleware ──
    setup_cors(application)

    # ── Exception Handlers ──
    register_exception_handlers(application)

    # ── Health Check ──
    @application.get("/api/health", tags=["health"])
    async def health_check() -> JSONResponse:
        """Health check endpoint that verifies database connectivity."""
        db_status = "disconnected"
        try:
            async with async_session_factory() as session:
                await session.execute(text("SELECT 1"))
                db_status = "connected"
        except Exception:
            db_status = "disconnected"

        status = "healthy" if db_status == "connected" else "unhealthy"
        status_code = 200 if status == "healthy" else 503

        return JSONResponse(
            status_code=status_code,
            content={
                "status": status,
                "database": db_status,
                "version": settings.app_version,
            },
        )

    # ── Routers ──
    # Import here to avoid circular imports
    from app.api.router import api_router
    application.include_router(api_router, prefix="/api")

    return application


app = create_app()