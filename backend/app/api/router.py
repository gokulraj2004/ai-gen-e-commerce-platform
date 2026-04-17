"""
Main API router aggregating all sub-routers.
"""
from fastapi import APIRouter

from app.api.v1 import auth, examples

api_router = APIRouter()

# Auth routes (KEEP - core authentication system)
api_router.include_router(
    auth.router,
    prefix="/v1/auth",
    tags=["Authentication"],
)

# EXAMPLE routes - DELETE and replace with your domain routes
api_router.include_router(
    examples.router,
    prefix="/v1",
    tags=["Examples"],
)