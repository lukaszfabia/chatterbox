from typing import Any, Optional
from app.application.serivce import Service
from app.domain.commands.update_user_command import UpdateUserCommand
from app.domain.models.user import User


class UpdateUserCommandService(Service):
    """
    Service responsible for handling the UpdateUserCommand.

    This class retrieves the current user ID from the provided token,
    updates the user information in the repository, and emits a UserUpdatedEvent.

    Attributes:
        rabbit_handler: Event publisher for publishing domain events.
        user_repo: Repository used to perform user-related database operations.
    """

    def __init__(self, rabbit_handler, user_repo):
        """
        Initializes the service with a message broker handler and a user repository.

        Args:
            rabbit_handler: Component responsible for publishing events to RabbitMQ or another broker.
            user_repo: The repository that provides access to user data.
        """
        super().__init__(rabbit_handler, user_repo)

    async def handle(self, ent: UpdateUserCommand, token: Any):
        """
        Handles the update user command by updating user data and publishing an update event.

        Args:
            ent (UpdateUserCommand): The command containing updated user data (username, email, password).
            token (Any): The token used to authenticate and identify the current user.

        Raises:
            ValueError: If the user could not be found (i.e., update returned None).
            Exception: Any exception raised during the update process.
        """
        try:
            userID = self.get_curr_user_id(token)

            updated: Optional[User] = await self.repo.update_user(
                id=userID,
                username=ent.username,
                email=ent.email,
                password=ent.password,
            )

            if updated is None:
                raise ValueError("User is none")

            await self.rabbit_handler.publish(updated.get_user_updated_event())
        except Exception as e:
            raise e
