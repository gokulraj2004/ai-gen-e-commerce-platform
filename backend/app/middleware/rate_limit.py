"""
Rate limiting middleware for authentication endpoints.
Uses an in-memory store (suitable for single-process deployments).
For multi-process/multi-instance deployments, use Redis-backed storage.
"""
import time
from collections import defaultdict
from typing import Callable

from fastapi import FastAPI, Request, Response, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware


class RateLimitStore:
    """Simple in-memory rate limit store with sliding window."""

    def __init__(self):
        # key -> list of timestamps
        self._requests: dict[str, list[float]] = defaultdict(list)

    def is_rate_limited(self, key: str, max_requests: int, window_seconds: int) -> bool:
        """Check if a key has exceeded the rate limit within the time window."""
        now = time.time()
        window_start = now - window_seconds

        # Clean old entries
        self._requests[key] = [
            ts for ts in self._requests[key] if ts > window_start
        ]

        if len(self._requests[key]) >= max_requests:
            return True

        self._requests[key].append(now)
        return False

    def cleanup(self) -> None:
        """Remove expired entries to prevent memory growth."""
        now = time.time()
        keys_to_delete = []
        for key, timestamps in self._requests.items():
            # Remove entries older than 10 minutes (max window we use)
            self._requests[key] = [ts for ts in timestamps if ts > now - 600]
            if not self._requests[key]:
                keys_to_delete.append(key)
        for key in keys_to_delete:
            del self._requests[key]


# Global rate limit store
_rate_limit_store = RateLimitStore()

# Rate limit configuration: path -> (max_requests, window_seconds)
RATE_LIMIT_RULES: dict[str, tuple[int, int]] = {
    "/api/v1/auth/login": (5, 60),       # 5 attempts per minute
    "/api/v1/auth/register": (3, 60),    # 3 attempts per minute
    "/api/v1/auth/refresh": (10, 60),    # 10 attempts per minute
}


def _get_client_ip(request: Request) -> str:
    """Extract client IP from request, considering proxy headers."""
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # Take the first IP (client IP) from the chain
        return forwarded_for.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "unknown"


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Middleware that applies rate limiting to configured endpoints."""

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        # Only apply rate limiting to POST requests on configured paths
        if request.method == "POST":
            path = request.url.path.rstrip("/")
            rule = RATE_LIMIT_RULES.get(path)

            if rule is not None:
                max_requests, window_seconds = rule
                client_ip = _get_client_ip(request)
                rate_limit_key = f"{path}:{client_ip}"

                if _rate_limit_store.is_rate_limited(rate_limit_key, max_requests, window_seconds):
                    return JSONResponse(
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        content={
                            "detail": "Too many requests. Please try again later.",
                        },
                        headers={
                            "Retry-After": str(window_seconds),
                        },
                    )

        response = await call_next(request)
        return response


def setup_rate_limiting(app: FastAPI) -> None:
    """Attach rate limiting middleware to the FastAPI application."""
    app.add_middleware(RateLimitMiddleware)