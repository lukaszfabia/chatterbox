from typing import Optional
from app.domain.queries import AuthUserQuery
from app.domain.dto.model import TokenDTO
from app.application.serivce import Service


class AuthUserQueryService(Service):

    def __init__(self, rabbit_handler, user_repo):
        super().__init__(rabbit_handler, user_repo)

    async def handle(self, ent: AuthUserQuery) -> Optional[TokenDTO]:
        user = await self.repo.get_user_by_email_or_username(s=ent.email_or_username)
        if not user:
            return None

        if not user.verify_password(ent.password, user.password):
            return None

        await self.rabbit_handler.publish(user.get_auth_user_event())

        return TokenDTO(
            access_token=self.jwt.create_access_token(user.id),
            refresh_token=self.jwt.create_refresh_token(user.id),
        )
