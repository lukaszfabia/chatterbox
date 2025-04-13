from collections.abc import Callable
import functools
from typing import Any

from app.domain.models.user import User


def handle_tx(func: Callable) -> Callable:
    """
    Decorator to manage database transactions (commit/rollback) for async repository methods.

    This decorator wraps repository methods that perform write operations to:
    - Commit the transaction if successful.
    - Roll back the transaction on exception.
    - Refresh the `User` instance from the database if returned.

    Args:
        func (Callable): The asynchronous function to wrap (typically a repository method).

    Returns:
        Callable: The wrapped asynchronous function with transaction handling.
    """

    @functools.wraps(func)
    async def wrapper(self, *args, **kwargs) -> Any:
        try:
            result = await func(self, *args, **kwargs)
            await self.db.commit()
            if isinstance(result, User):
                await self.db.refresh(result)
            return result
        except Exception:
            await self.db.rollback()
            return None

    return wrapper
