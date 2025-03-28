from abc import ABC, abstractmethod
from app.domain.models import User
from app.infrastructure.jwt import JWTSerivce
from app.infrastructure.rabbitmq import RabbitMQHandler
from app.infrastructure.repository.user_repo import UserRepository


class Service(ABC):
    def __init__(self, rabbit_handler: RabbitMQHandler, user_repo: UserRepository):
        self.rabbit_handler = rabbit_handler
        self.repo = user_repo
        self.jwt = JWTSerivce()

    @abstractmethod
    async def handle(self): ...

    async def get_auth_user(self, token: str) -> User:
        user = self.jwt.get_current_user(token)

        user = await self.repo.get_user_by_uid(user["sub"])

        if user is None:
            print("user is none")
            raise ValueError("Unauthorized")

        return user
