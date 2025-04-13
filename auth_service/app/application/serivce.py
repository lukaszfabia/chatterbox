from abc import ABC, abstractmethod
from app.infrastructure.jwt import JWTService
from app.infrastructure.rabbitmq import RabbitMQHandler
from app.infrastructure.repository.user_repo import UserRepository


class Service(ABC):
    """
    Abstract base class for application services in the system.

    Provides shared dependencies and utility methods for derived services,
    including access to:
    - RabbitMQ event publishing
    - User repository operations
    - JWT token decoding

    Attributes:
        rabbit_handler (RabbitMQHandler): Handler for publishing domain events.
        repo (UserRepository): Repository interface for user data.
        jwt (JWTService): Service for JWT token handling and user extraction.
    """

    def __init__(self, rabbit_handler: RabbitMQHandler, user_repo: UserRepository):
        """
        Initializes the base service with common dependencies.

        Args:
            rabbit_handler (RabbitMQHandler): Event publisher.
            user_repo (UserRepository): User data access layer.
        """
        self.rabbit_handler = rabbit_handler
        self.repo = user_repo
        self.jwt = JWTService()

    @abstractmethod
    async def handle(self):
        """
        Abstract method to be implemented by child services
        to handle specific commands or queries.
        """
        ...

    def get_curr_user_id(self, token: str) -> str:
        """
        Extracts the current user's ID from a JWT token.

        Args:
            token (str): The JWT access token.

        Returns:
            str: The user's unique identifier extracted from the token.
        """
        user = self.jwt.get_current_user(token)
        return user["sub"]
