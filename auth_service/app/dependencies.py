from fastapi import Depends
from app.application.commands.command_handlers import CreateUserCommandService
from app.application.queries.query_handlers import AuthUserQueryService
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


async def get_create_user_command_service():
    user_repo = await get_user_repository()
    rabbit_handler = await get_rabbitmq()

    return CreateUserCommandService(user_repo=user_repo, rabbit_handler=rabbit_handler)


async def get_auth_user_query_service():
    user_repo = await get_user_repository()
    rabbit_handler = await get_rabbitmq()

    return AuthUserQueryService(user_repo=user_repo, rabbit_handler=rabbit_handler)
