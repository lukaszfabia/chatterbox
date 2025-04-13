from typing import Optional
from app.domain.events.user_logged_in_event import UserLoggedInEvent
from app.domain.queries.auth_user_query import AuthUserQuery
from app.domain.dto.token_dto import TokenDTO
from app.application.serivce import Service


class AuthUserQueryService(Service):
    """
    Service responsible for handling authentication queries.

    This service processes user authentication requests by validating credentials,
    publishing login events, and generating JWT tokens for authenticated users.

    Attributes:
        rabbit_handler: Event handler used for publishing domain events.
        user_repo: Repository used for retrieving user data from the database.
    """

    def __init__(self, rabbit_handler, user_repo):
        """
        Initializes the AuthUserQueryService with dependencies.

        Args:
            rabbit_handler: A message broker/event handler used to publish events.
            user_repo: A user repository instance used to fetch user data.
        """
        super().__init__(rabbit_handler, user_repo)

    async def handle(self, ent: AuthUserQuery) -> Optional[TokenDTO]:
        """
        Handles the authentication query by validating user credentials.

        If credentials are correct, publishes a `UserLoggedInEvent` and returns a TokenDTO
        containing access and refresh tokens. Returns `None` if authentication fails.

        Args:
            ent (AuthUserQuery): Query object containing login credentials (username/email and password).

        Returns:
            Optional[TokenDTO]: A token DTO with JWT tokens if authentication is successful, None otherwise.
        """
        user = await self.repo.get_user_by_email_or_username(s=ent.email_or_username)
        if not user:
            return None

        if not user.verify_password(ent.password, user.password):
            return None

        await self.rabbit_handler.publish(UserLoggedInEvent(userID=str(user.id)))

        return TokenDTO(
            access_token=self.jwt.create_access_token(user.id),
            refresh_token=self.jwt.create_refresh_token(user.id),
        )
