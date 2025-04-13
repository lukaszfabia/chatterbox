from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class UserUpdatedEvent:
    """Immutable domain event representing user profile modifications.

    This event contains optional fields to represent partial updates,
    allowing consumers to handle only changed attributes.

    Attributes:
        userID (Optional[str]): User identifier (None if not changed).
        email (Optional[str]): New email if updated, None otherwise.
        username (Optional[str]): New username if updated, None otherwise.

    Example:
        >>> event = UserUpdatedEvent(
        ...     userID="550e8400-e29b-41d4-a716-446655440000",
        ...     username="new_username",
        ...     email=None
        ... )
    """

    userID: Optional[str]
    email: Optional[str]
    username: Optional[str]
