from dataclasses import dataclass


@dataclass(frozen=True)
class UserLoggedInEvent:
    """Immutable domain event representing successful user authentication.

    Attributes:
        userID (str): Unique identifier of the authenticated user (UUID as string).

    Example:
        >>> event = UserLoggedInEvent(userID="550e8400-e29b-41d4-a716-446655440000")
    """

    userID: str
