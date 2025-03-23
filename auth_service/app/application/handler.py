from abc import ABC, abstractmethod
from typing import Any
from app.infrastructure.rabbitmq import RabbitMQHandler
from app.infrastructure.repository.user_repo import UserRepository


class Handler(ABC):
    def __init__(self, rabbit_handler: RabbitMQHandler, user_repo: UserRepository):
        self.rabbit_handler = rabbit_handler
        self.repo = user_repo

    @abstractmethod
    async def handle(self, ent: Any):
        pass

    @abstractmethod
    async def publish_event(self, event: Any):
        pass
