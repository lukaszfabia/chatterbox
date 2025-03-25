from abc import ABC, abstractmethod
from app.infrastructure.rabbitmq import RabbitMQHandler
from app.infrastructure.repository.user_repo import UserRepository


class Handler:
    def __init__(self, rabbit_handler: RabbitMQHandler, user_repo: UserRepository):
        self.rabbit_handler = rabbit_handler
        self.repo = user_repo

    async def handle(self, ent):
        pass
