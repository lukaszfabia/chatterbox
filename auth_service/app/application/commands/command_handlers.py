from typing import Optional
from app.application.serivce import Service
from app.domain.commands import CreateUserCommand, UpdateUserCommand
from app.domain.dto.model import TokenDTO
from app.domain.models import User


class CreateUserCommandService(Service):

    def __init__(self, rabbit_handler, user_repo):
        super().__init__(rabbit_handler, user_repo)

    async def handle(self, ent: CreateUserCommand) -> Optional[TokenDTO]:
        if await self.repo.is_user_exists(email=ent.email, username=ent.username):
            return None

        user: User = await self.repo.create(
            email=ent.email, username=ent.username, password=ent.password
        )

        if user is None:
            return None

        await self.rabbit_handler.publish(user.get_created_user_event())

        return TokenDTO(
            access_token=self.jwt.create_access_token(user.id),
            refresh_token=self.jwt.create_refresh_token(user.id),
        )


class UpdateUserCommandService(Service):
    def __init__(self, rabbit_handler, user_repo):
        super().__init__(rabbit_handler, user_repo)

    async def handle(self, ent: UpdateUserCommand, user: User):
        try:

            updated = await self.repo.update_user(
                user, username=ent.username, email=ent.email, password=ent.password
            )
            if user is None:
                raise ValueError("User is none")

            await self.rabbit_handler.publish(updated.get_user_updated_event())
        except Exception as e:
            raise e


class DeleteUserCommandService(Service):
    def __init__(self, rabbit_handler, user_repo):
        super().__init__(rabbit_handler, user_repo)

    async def handle(self, user: User):
        try:
            await self.repo.delete_user(user)

            await self.rabbit_handler.publish(user.get_deleted_user_event())
        except Exception as e:
            raise e


class LogoutUserCommandService(Service):
    def __init__(self, rabbit_handler, user_repo):
        super().__init__(rabbit_handler, user_repo)

    async def handle(self, user: User):
        await self.rabbit_handler.publish(user.get_logged_out_user_event())
