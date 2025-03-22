from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_, and_


from app.domain.models import User


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_by_email_or_username(self, s: str) -> Optional[User]:
        return (
            await self.db.execute(
                select(User).filter(or_(User.email == s, User.username == s))
            )
        ).scalar_one_or_none()

    async def is_user_exists(self, username: str, email: str) -> bool:
        return (
            True
            if (
                await self.db.execute(
                    select(User).filter(
                        and_(User.email == email, User.username == username)
                    )
                )
            ).scalar_one_or_none()
            else False
        )

    async def create(self, username: str, email: str, password: str):
        password = User.hash_password(password=password)

        user = User(password=password, email=email, username=username)

        try:
            await self.db.add(user)
            self.db.commit()

            return user

        except Exception as e:
            await self.db.rollback()
            raise e
