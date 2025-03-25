from app.domain.commands import CreateUserCommand
from app.domain.exceptions import FailedToRegister, UserAlreadyExists
from app.domain.dto.model import TokenDTO
from app.infrastructure.rabbitmq import RabbitMQHandler
from app.infrastructure.repository.user_repo import UserRepository
from app.infrastructure.utils.jwt.jwt import JWTSerivce


class CreateUserCommandService:
    def __init__(self, rabbit_handler: RabbitMQHandler, user_repo: UserRepository):
        self.jwt = JWTSerivce()
        self.rabbit_handler = rabbit_handler
        self.repo = user_repo

    async def handle(self, ent: CreateUserCommand) -> TokenDTO:
        if await self.repo.is_user_exists(email=ent.email, username=ent.username):
            raise UserAlreadyExists()

        # create user
        new_user = await self.repo.create(
            email=ent.email, username=ent.username, password=ent.password
        )

        if new_user is None:
            raise FailedToRegister()

        await self.rabbit_handler.publish(new_user.get_created_user_event())

        token = TokenDTO(
            access_token=self.jwt.create_access_token(new_user),
            refresh_token=self.jwt.create_refresh_token(new_user),
        )

        return token
