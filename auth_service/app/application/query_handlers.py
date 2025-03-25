from typing import Optional
from app.application.handler import Handler
from app.domain.exceptions import InvalidCredentials
from app.domain.models import User
from app.domain.queries import AuthUserQuery
from app.domain.dto.model import TokenDTO
from app.infrastructure.utils.jwt.jwt import JWTSerivce


class AuthUserQueryHandler:
    def __init__(self, rabbit_handler, user_repo):
        super().__init__(rabbit_handler, user_repo)
        self.jwt = JWTSerivce()

    async def handle(self, ent: AuthUserQuery) -> tuple[User, TokenDTO]:
        user = await self.repo.get_user_by_email_or_username(s=ent.email_or_username)
        if not user:
            raise InvalidCredentials()

        if not user.verify_password(ent.password, user.password):
            raise InvalidCredentials()

        return (
            user,
            TokenDTO(
                access_token=self.jwt.create_access_token(user),
                refresh_token=self.jwt.create_refresh_token(user),
            ),
        )
