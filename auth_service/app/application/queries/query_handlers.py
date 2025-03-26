from app.domain.exceptions import InvalidCredentials
from app.domain.queries import AuthUserQuery
from app.domain.dto.model import TokenDTO
from app.infrastructure.rabbitmq import RabbitMQHandler
from app.infrastructure.repository.user_repo import UserRepository
from app.infrastructure.utils.jwt.jwt import JWTSerivce


class AuthUserQueryService:
    def __init__(self, rabbit_handler: RabbitMQHandler, user_repo: UserRepository):
        self.rabbit_handler = rabbit_handler
        self.repo = user_repo
        self.jwt = JWTSerivce()

    async def handle(self, ent: AuthUserQuery) -> TokenDTO:
        user = await self.repo.get_user_by_email_or_username(s=ent.email_or_username)
        if not user:
            raise InvalidCredentials()

        if not user.verify_password(ent.password, user.password):
            raise InvalidCredentials()

        await self.rabbit_handler.publish(user.get_auth_user_event())

        return TokenDTO(
            access_token=self.jwt.create_access_token(user),
            refresh_token=self.jwt.create_refresh_token(user),
        )
