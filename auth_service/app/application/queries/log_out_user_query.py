from app.application.serivce import Service
from app.domain.events.user_logged_out_event import UserLoggedOutEvent
from app.domain.queries.logout_user_query import LogoutUserQuery


class LogoutUserQueryService(Service):
    """
    Service responsible for handling user logout queries.

    This service publishes a `UserLoggedOutEvent` to notify the system
    that a user has logged out.

    Attributes:
        rabbit_handler: Event handler used to publish logout events.
        user_repo: Repository instance (not used directly here but required by base service).
    """

    def __init__(self, rabbit_handler, user_repo):
        """
        Initializes the LogoutUserQueryService with necessary dependencies.

        Args:
            rabbit_handler: A message broker/event handler used to publish events.
            user_repo: A user repository instance (injected for consistency, not used in this service).
        """
        super().__init__(rabbit_handler, user_repo)

    async def handle(self, q: LogoutUserQuery):
        """
        Handles the logout query by publishing a UserLoggedOutEvent.

        Args:
            q (LogoutUserQuery): Query containing the ID of the user who is logging out.
        """
        await self.rabbit_handler.publish(UserLoggedOutEvent(userID=q.userID))
