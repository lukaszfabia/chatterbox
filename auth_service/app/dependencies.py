from fastapi import Depends

from app.application.commands.continue_with_command import ContinueWithCommandService
from app.application.commands.create_user_command_service import (
    CreateUserCommandService,
)
from app.application.commands.delete_user_command_service import (
    DeleteUserCommandService,
)
from app.application.commands.update_user_command_service import (
    UpdateUserCommandService,
)
from app.application.queries.auth_user_query_service import AuthUserQueryService
from app.application.queries.log_out_user_query import LogoutUserQueryService
from app.infrastructure.rabbitmq import RabbitMQHandler
from app.infrastructure.repository.user_repo import UserRepository
from app.infrastructure.database import get_session
from sqlalchemy.ext.asyncio import AsyncSession
from app.config import config_for_rabbit


def get_user_repository(
    db: AsyncSession = Depends(get_session),
) -> UserRepository:
    return UserRepository(db)


def get_rabbitmq():
    return RabbitMQHandler(config=config_for_rabbit)


def get_create_user_command_service(
    user_repo: UserRepository = Depends(get_user_repository),
    rabbit_handler: RabbitMQHandler = Depends(get_rabbitmq),
) -> CreateUserCommandService:
    return CreateUserCommandService(user_repo=user_repo, rabbit_handler=rabbit_handler)


def get_auth_user_query_service(
    user_repo: UserRepository = Depends(get_user_repository),
    rabbit_handler: RabbitMQHandler = Depends(get_rabbitmq),
) -> AuthUserQueryService:
    return AuthUserQueryService(user_repo=user_repo, rabbit_handler=rabbit_handler)


def get_update_user_command_service(
    user_repo: UserRepository = Depends(get_user_repository),
    rabbit_handler: RabbitMQHandler = Depends(get_rabbitmq),
) -> UpdateUserCommandService:
    return UpdateUserCommandService(user_repo=user_repo, rabbit_handler=rabbit_handler)


def get_delete_user_command_service(
    user_repo: UserRepository = Depends(get_user_repository),
    rabbit_handler: RabbitMQHandler = Depends(get_rabbitmq),
) -> DeleteUserCommandService:
    return DeleteUserCommandService(user_repo=user_repo, rabbit_handler=rabbit_handler)


def get_logout_user_query_service(
    user_repo: UserRepository = Depends(get_user_repository),
    rabbit_handler: RabbitMQHandler = Depends(get_rabbitmq),
) -> LogoutUserQueryService:
    return LogoutUserQueryService(user_repo=user_repo, rabbit_handler=rabbit_handler)


def get_continue_with_command_service(
    user_repo: UserRepository = Depends(get_user_repository),
    rabbit_handler: RabbitMQHandler = Depends(get_rabbitmq),
) -> ContinueWithCommandService:
    return ContinueWithCommandService(
        user_repo=user_repo, rabbit_handler=rabbit_handler
    )
