from contextlib import asynccontextmanager
import datetime
import logging
from typing import List
from fastapi import FastAPI, logger
from fastapi.middleware.cors import CORSMiddleware


@asynccontextmanager
async def lifespan(app: FastAPI):
    # db init
    app.database = app.mongo.db

    try:
        yield
    finally:
        app.mongo.close()
        app.scheduler.shutdown(wait=False)


def create_app() -> FastAPI:
    app = FastAPI(
        title="Official Areo API",
        description="Areo API helps to handle users and weather",
        version="1.0.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # app.include_router(general_router, prefix="/api/v1")
    # app.include_router(user_router, prefix="/api/v1")
    # app.include_router(weather_router, prefix="/api/v1")
    return app


app = create_app()
