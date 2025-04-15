from typing import Optional
from app.application.serivce import Service
from app.domain.commands.continue_with_command import ContinueWithCommand
from app.domain.dto.token_dto import TokenDTO
from app.domain.events.user_logged_in_event import UserLoggedInEvent
from app.domain.models.user import User


class ContinueWithCommandService(Service):
    """
    Service responsible for handling SSO-based user continuation (login or registration).

    This service processes incoming SSO login attempts and:
    - Creates a new user if one does not exist (based on email).
    - Publishes a user-created event to RabbitMQ.
    - Returns a new pair of access and refresh tokens.

    Attributes:
        rabbit_handler: Messaging handler used to publish events (e.g., to RabbitMQ).
        user_repo: Repository handling persistence and retrieval of user data.
    """

    def __init__(self, rabbit_handler, user_repo):
        """
        Initializes the service with required dependencies.

        Args:
            rabbit_handler: Messaging system interface for event publishing.
            user_repo: User repository handling DB operations.
        """
        super().__init__(rabbit_handler, user_repo)

    async def handle(self, ent: ContinueWithCommand) -> Optional[TokenDTO]:
        """
        Handles a command to log in or register a user via SSO provider.

        Args:
            ent (ContinueWithCommand): The command containing email and SSO provider name.

        Returns:
            Optional[TokenDTO]: JWT token pair if the user was successfully processed, None otherwise.

        Example:
            >>> command = ContinueWithCommand(email="john@example.com", sso_provider="google")
            >>> token = await service.handle(command)
            >>> token.access_token
            'eyJhbGciOi...'
        """
        res: tuple[Optional[User], bool] = await self.repo.create_with_sso(
            email=ent.email, sso_provider=ent.sso_provider
        )

        user, created = res

        if user is None:
            return None

        if created:
            await self.rabbit_handler.publish(user.get_created_user_event())

        await self.rabbit_handler.publish(UserLoggedInEvent(userID=user.id))

        return TokenDTO(
            access_token=self.jwt.create_access_token(user.id),
            refresh_token=self.jwt.create_refresh_token(user.id),
        )
