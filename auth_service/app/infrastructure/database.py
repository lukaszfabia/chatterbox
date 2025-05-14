from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

import os
from dotenv import load_dotenv


def get_db_url():
    """
    Loads environment variables from a `.env` file and constructs the database URL.

    This function uses the following environment variables:
    - DB_USERNAME: The username for the database.
    - DB_PASSWORD: The password for the database.
    - DB_HOST: The host address of the database.
    - DB_PORT: The port number for the database connection.
    - DB_NAME: The name of the database.

    Returns:
        str: The complete database URL.
    """
    load_dotenv()

    # url = (
    #     f"postgresql+asyncpg://{os.getenv('DB_USERNAME')}:{os.getenv('DB_PASSWORD')}"
    #     f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
    # )

    url = f"postgresql+asyncpg://{os.getenv('DB_USERNAME')}:{os.getenv('DB_PASSWORD')}@{os.getenv('POSTGRES_URL')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"

    return url


engine = create_async_engine(get_db_url(), echo=True)

SessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """
    Provides a database session to be used in asynchronous operations.

    This function is a generator that yields a session instance. The session is
    created and managed using the `SessionLocal` sessionmaker. After the operation,
    the session is automatically closed.

    Returns:
        AsyncGenerator[AsyncSession, None]: An asynchronous generator that yields
        a session instance.
    """
    async with SessionLocal() as session:
        yield session
