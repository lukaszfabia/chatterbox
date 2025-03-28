from collections.abc import Callable
import functools
from typing import Any, Optional
import uuid
from fastapi import logger
from pydantic import EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_, and_


from app.domain.models import User


def handle_tx(func: Callable) -> Callable:
    @functools.wraps(func)
    async def wrapper(self, *args, **kwargs) -> Any:
        try:
            result = await func(self, *args, **kwargs)
            await self.db.commit()
            if isinstance(result, User):
                await self.db.refresh(result)
            return result
        except Exception as e:
            logger.error(f"Database transaction failed in {func.__name__}: {e}")
            await self.db.rollback()

            return None

    return wrapper


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_email_or_username(self, s: str) -> Optional[User]:
        return (
            await self.db.execute(
                select(User).filter(
                    or_(User.email == s, User.username == s),
                    User.deleted_at.is_(None),
                )
            )
        ).scalar_one_or_none()

    async def get_user_by_uid(self, id: str) -> Optional[User]:
        uid = uuid.UUID(id)

        return (
            await self.db.execute(
                select(User).filter(User.id == uid, User.deleted_at.is_(None))
            )
        ).scalar_one_or_none()

    async def is_user_exists(self, username: str, email: str) -> bool:
        stmt = select(User).filter(
            and_(User.email == email, User.username == username),
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none() is not None

    @handle_tx
    async def create(self, username: str, email: str, password: str) -> Optional[User]:
        user = User(
            password=User.hash_password(password=password),
            email=email,
            username=username,
        )
        self.db.add(user)

        return user

    @handle_tx
    async def update_user(
        self, user: User, username: str, email: EmailStr, password: str
    ) -> Optional[User]:

        return user.update(username=username, email=email, password=password)

    @handle_tx
    async def delete_user(self, user: User):
        user.mark_as_deleted()

        return user
