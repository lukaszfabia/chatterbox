import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.infrastructure.rest.v1.auth_routes import auth_router
from dotenv import load_dotenv
from app.config import APP_NAME, SECRET
from starlette.middleware.sessions import SessionMiddleware


def create_app() -> FastAPI:
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

    app = FastAPI(
        title=f"{APP_NAME} - Auth Service",
        description="Authenticate users and handle login flows using OAuth2 with various providers.",
        version="1.0.0",
        contact={
            "name": "Lukasz Fabia",
            "email": "ufabia03@gmail.com",
        },
        openapi_url="/api/v1/openapi.json",
        docs_url="/api/v1/docs",
        redoc_url="/api/v1/redoc",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.add_middleware(SessionMiddleware, secret_key=SECRET)

    app.include_router(auth_router, prefix="/api", tags=["Auth"])
    return app


app = create_app()
