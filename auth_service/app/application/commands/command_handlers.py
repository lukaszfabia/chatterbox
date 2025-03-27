from typing import Optional
from app.application.serivce import Service, trigger_event
from app.domain.commands import CreateUserCommand, DeleteUserCommand, UpdateUserCommand
from app.domain.dto.model import TokenDTO
from app.domain.models import User


class CreateUserCommandService(Service):

    def __init__(self, rabbit_handler, user_repo):
        super().__init__(rabbit_handler, user_repo)

    @trigger_event(("get_created_user_event"))
    async def handle(self, ent: CreateUserCommand) -> Optional[TokenDTO]:
        if await self.repo.is_user_exists(email=ent.email, username=ent.username):
            return None

        new_user: User = await self.repo.create(
            email=ent.email, username=ent.username, password=ent.password
        )

        if new_user is None:
            return None

        self.rabbit_handler.publish(new_user.get_created_user_event())

        return TokenDTO(
            access_token=self.jwt.create_access_token(new_user),
            refresh_token=self.jwt.create_refresh_token(new_user),
        )


class UpdateUserCommandService(Service):
    def __init__(self, rabbit_handler, user_repo):
        super().__init__(rabbit_handler, user_repo)

    @trigger_event(("get_user_updated_event"))
    async def handle(self, ent: UpdateUserCommand):

        user = await self.get_auth_user()

        return await self.repo.update_user(
            user, username=ent.username, email=ent.email, password=ent.password
        )


class DeleteUserCommandService(Service):
    def __init__(self, rabbit_handler, user_repo):
        super().__init__(rabbit_handler, user_repo)

    @trigger_event(("get_deleted_user_event"))
    async def handle(self, _: DeleteUserCommand):
        user = await self.get_auth_user()

        return await self.repo.delete_user(user)
