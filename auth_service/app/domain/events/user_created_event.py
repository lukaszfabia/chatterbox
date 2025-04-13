from dataclasses import dataclass


@dataclass(frozen=True)
class UserCreatedEvent:
    """Immutable domain event representing user creation in the system.

    This event is triggered after successful user registration and contains
    essential user data for downstream consumers: profile service.
    As a frozen dataclass, it guarantees immutability during event processing.

    Attributes:
        userID (str): Unique identifier of the created user (UUID as string).
        email (str): User's email address, used for communication.
        username (str): Public username identifier.

    Example:
        >>> event = UserCreatedEvent(
        ...     userID="550e8400-e29b-41d4-a716-446655440000",
        ...     email="user@example.com",
        ...     username="johndoe"
        ... )
        >>> event.userID
        '550e8400-e29b-41d4-a716-446655440000'
    """

    userID: str
    email: str
    username: str
