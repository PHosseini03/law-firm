"""FastAPI application factory."""
import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi.errors import RateLimitExceeded
from starlette.exceptions import HTTPException as StarletteHTTPException

from .config import settings
from .db import get_connection
from .messages import SERVER_ERROR, TOO_MANY_REQUESTS, http_message, validation_message
from .responses import fail, ok
from .routers import site
from .security import BodySizeLimitMiddleware, SecurityHeadersMiddleware, limiter
from .seed import seed

logger = logging.getLogger("demo")


def create_app() -> FastAPI:
    app = FastAPI(title=f"{settings.site_name} API", version="1.0.0")
    app.state.limiter = limiter

    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(BodySizeLimitMiddleware)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.allowed_origins,
        allow_methods=["GET", "POST"],
        allow_headers=["Content-Type"],
        allow_credentials=False,
    )

    @app.exception_handler(RequestValidationError)
    async def on_validation(_: Request, exc: RequestValidationError):
        return JSONResponse(fail(validation_message(list(exc.errors()))), status_code=422)

    @app.exception_handler(RateLimitExceeded)
    async def on_rate_limit(_: Request, __: RateLimitExceeded):
        return JSONResponse(fail(TOO_MANY_REQUESTS), status_code=429)

    @app.exception_handler(StarletteHTTPException)
    async def on_http(_: Request, exc: StarletteHTTPException):
        return JSONResponse(fail(http_message(exc.status_code, exc.detail)), status_code=exc.status_code)

    @app.exception_handler(Exception)
    async def on_error(request: Request, exc: Exception):
        logger.exception("Unhandled error on %s", request.url.path, exc_info=exc)
        return JSONResponse(fail(SERVER_ERROR), status_code=500)

    @app.get("/api/health")
    def health():
        return ok({"status": "ok", "site": settings.site_name})

    app.include_router(site.router, prefix="/api")
    seed(get_connection())
    return app


app = create_app()
