from dataclasses import dataclass


@dataclass(frozen=True)
class UserLoggedOutEvent:
    """Immutable domain event representing user session termination.

    Attributes:
        userID (str): Unique identifier of the logged-out user (UUID as string).

    Example:
        >>> event = UserLoggedOutEvent(userID="550e8400-e29b-41d4-a716-446655440000")
    """

    userID: str
