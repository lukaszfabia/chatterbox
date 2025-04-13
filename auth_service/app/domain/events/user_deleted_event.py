from dataclasses import dataclass


@dataclass(frozen=True)
class UserDeletedEvent:
    """Immutable domain event representing user deletion (soft delete).

    This event is emitted after a user account is marked as deleted and contains
    minimal identifying information for downstream systems to react accordingly.

    Attributes:
        userID (str): Unique identifier of the deleted user (UUID as string).
        email (str): User's email address at time of deletion (for audit purposes).

    Example:
        >>> event = UserDeletedEvent(
        ...     userID="550e8400-e29b-41d4-a716-446655440000",
        ...     email="user@example.com"
        ... )
    """

    userID: str
    email: str
