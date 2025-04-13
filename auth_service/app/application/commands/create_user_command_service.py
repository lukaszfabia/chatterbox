from typing import Optional
from app.application.serivce import Service
from app.domain.commands.create_user_command import CreateUserCommand
from app.domain.dto.token_dto import TokenDTO
from app.domain.models.user import User


class CreateUserCommandService(Service):
    """
    Service responsible for handling the CreateUserCommand.

    This service creates a new user, publishes a UserCreatedEvent,
    and returns JWT access and refresh tokens upon success.

    Attributes:
        rabbit_handler: Event publisher for sending domain events.
        user_repo: Repository for accessing and modifying user records.
    """

    def __init__(self, rabbit_handler, user_repo):
        """
        Initializes the CreateUserCommandService.

        Args:
            rabbit_handler: An event publisher (e.g., RabbitMQ handler).
            user_repo: A repository with access to user data operations.
        """
        super().__init__(rabbit_handler, user_repo)

    async def handle(self, ent: CreateUserCommand) -> Optional[TokenDTO]:
        """
        Handles the CreateUserCommand by registering a new user and publishing a creation event.

        Args:
            ent (CreateUserCommand): The command containing user registration details.

        Returns:
            Optional[TokenDTO]: Access and refresh tokens if user is successfully created,
                                None otherwise.
        """
        user: Optional[User] = await self.repo.create(
            email=ent.email, username=ent.username, password=ent.password
        )

        if user is None:
            return None

        await self.rabbit_handler.publish(user.get_created_user_event())

        return TokenDTO(
            access_token=self.jwt.create_access_token(user.id),
            refresh_token=self.jwt.create_refresh_token(user.id),
        )
