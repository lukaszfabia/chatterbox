from fastapi import Depends
from app.infrastructure.auth_service import AuthService
from app.infrastructure.repository.user_repo import UserRepository
from app.infrastructure.database import get_session
from sqlalchemy.ext.asyncio import AsyncSession


async def get_user_repository(
    db: AsyncSession = Depends(get_session),
) -> UserRepository:
    return UserRepository(db)


def get_auth_service(
    user_repository: UserRepository = Depends(get_user_repository),
) -> AuthService:
    return AuthService(user_repository)
