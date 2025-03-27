from abc import ABC, abstractmethod
import functools
from typing import Any, Callable, Optional

from fastapi import logger

from app.domain.models import User
from app.infrastructure.jwt import JWTSerivce
from app.infrastructure.rabbitmq import RabbitMQHandler
from app.infrastructure.repository.user_repo import UserRepository


def trigger_event(event_method: str) -> Callable:
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        async def wrapper(self, ent, *args, **kwargs) -> Any:
            result = await func(self, ent, *args, **kwargs)

            if result and hasattr(result, event_method):
                event = getattr(result, event_method)()
                await self.rabbit_handler.publish(event)

            return result

        return wrapper

    return decorator


class Service(ABC):
    def __init__(self, rabbit_handler: RabbitMQHandler, user_repo: UserRepository):
        self.rabbit_handler = rabbit_handler
        self.repo = user_repo
        self.jwt = JWTSerivce()

    @abstractmethod
    async def handle(self): ...

    async def get_auth_user(self) -> User:
        user = self.jwt.get_current_user()
        user = await self.repo.get_user_by_uid(user["sub"])

        if user is None:
            raise ValueError("Unauthorized")

        return user
