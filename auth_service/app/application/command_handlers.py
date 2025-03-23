from app.application.handler import Handler
from app.domain.commands import CreateUserCommand
from app.domain.events import UserCreatedEvent
from app.domain.exceptions import FailedToRegister, UserAlreadyExists
from app.domain.models import User
from app.domain.dto.model import TokenDTO
from app.infrastructure.utils.jwt.jwt import JWTSerivce


class CreateUserCommandHandler(Handler):
    def __init__(self, rabbit_handler, user_repo):
        self.jwt = JWTSerivce()
        super().__init__(rabbit_handler, user_repo)

    async def handle(self, ent: CreateUserCommand) -> tuple[User, TokenDTO]:
        if await self.repo.is_user_exists(email=ent.email, username=ent.username):
            raise UserAlreadyExists()

        # create user
        new_user = await self.repo.create(
            email=ent.email, username=ent.username, password=ent.password
        )

        if new_user is None:
            raise FailedToRegister()

        token = TokenDTO(
            access_token=self.jwt.create_access_token(new_user),
            refresh_token=self.jwt.create_refresh_token(new_user),
        )

        return (new_user, token)

    async def publish_event(self, event: UserCreatedEvent):
        await self.rabbit_handler.publish(event)
