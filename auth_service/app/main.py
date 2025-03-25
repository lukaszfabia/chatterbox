import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.rest.auth_routes import auth_router
from dotenv import load_dotenv
from app.config import APP_NAME


def create_app() -> FastAPI:
    load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

    app = FastAPI(
        title=f"{APP_NAME} - Auth Serivce",
        description="Help to authenticate user",
        version="1.0.0",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth_router, prefix="/api/v1")
    return app


app = create_app()
