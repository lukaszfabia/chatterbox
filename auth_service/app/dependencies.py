from fastapi import Depends
from app.application.handler import Handler
from app.infrastructure.rabbitmq import RabbitMQHandler
from app.infrastructure.repository.user_repo import UserRepository
from app.infrastructure.database import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import config_for_rabbit


async def get_user_repository(
    db: AsyncSession = Depends(get_session),
) -> UserRepository:
    return UserRepository(db)


async def get_rabbitmq():
    return RabbitMQHandler(config=config_for_rabbit)


# def get_auth_service(
#     user_repository: UserRepository = Depends(get_user_repository),
# ) -> AuthService:
#     return AuthService(user_repository)


async def get_handler():
    user_repo = await get_user_repository()
    rabbit_handler = await get_rabbitmq()

    return Handler(user_repo=user_repo, rabbit_handler=rabbit_handler)
