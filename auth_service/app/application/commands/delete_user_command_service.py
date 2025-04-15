from typing import Optional
from app.application.serivce import Service
from app.domain.commands.delete_user_command import DeleteUserCommand
from app.domain.events.user_logged_out_event import UserLoggedOutEvent
from app.domain.models.user import User


class DeleteUserCommandService(Service):
    """
    Service responsible for handling the DeleteUserCommand.

    This service attempts to soft-delete a user based on their ID
    and publishes a UserDeletedEvent if the operation succeeds.

    Attributes:
        rabbit_handler: Event publisher for propagating domain events.
        user_repo: Repository for accessing and modifying user records.
    """

    def __init__(self, rabbit_handler, user_repo):
        """
        Initializes the DeleteUserCommandService.

        Args:
            rabbit_handler: An event publisher (e.g., RabbitMQ handler).
            user_repo: A repository with access to user data operations.
        """
        super().__init__(rabbit_handler, user_repo)

    async def handle(self, ent: DeleteUserCommand):
        """
        Handles the DeleteUserCommand by soft-deleting the user and publishing a deletion event.

        Args:
            ent (DeleteUserCommand): The command containing the user ID to delete.

        Raises:
            ValueError: If the user is not found or already deleted.
            Exception: If any other error occurs during the deletion process.
        """
        try:
            user: Optional[User] = await self.repo.delete_user(userID=ent.userID)
            if user is None:
                raise ValueError(
                    f"User with ID {ent.userID} not found or already deleted"
                )

            await self.rabbit_handler.publish(user.get_deleted_user_event())
            await self.rabbit_handler.publish(UserLoggedOutEvent(userID=user.id))
        except Exception as e:
            raise e
