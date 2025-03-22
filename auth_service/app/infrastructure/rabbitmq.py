import aio_pika
import json
from typing import Any, Dict, Callable, Awaitable
from dataclasses import dataclass
import logging


logging.basicConfig(level=logging.INFO)
log = logging.getLogger("RabbitMQ logger")


@dataclass(frozen=True)
class RabbitConfig:
    login: str
    password: str
    port: int
    host: str


class RabbitMQHandler:
    def __init__(self, config: RabbitConfig):
        self.connection = None
        self.channel = None
        self.config = config

    async def connect(self):
        self.connection = await aio_pika.connect_robust(
            host=self.config.host,
            login=self.config.login,
            password=self.config.password,
            port=self.config.port,
        )
        self.channel = await self.connection.channel()

    async def publish(self, ent: Any, message: Dict[str, Any]):
        """Use **reflection** to define queue name

        Args:
            ent (str): event class
            message (Dict[str, Any]): json with data of this class
        """
        if not self.channel:
            log.info("Reconnecting to channel")
            await self.connect()

        queue_name = ent.__class__.__str__()

        await self.channel.declare_queue(queue_name, durable=True)
        log.info(f"{queue_name} has been declared")

        await self.channel.default_exchange.publish(
            aio_pika.Message(
                body=json.dumps(message).encode(),
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
            ),
            routing_key=queue_name,
        )
        log.info(f" [x] Sent '{message}' to queue '{queue_name}'")

    async def consume(
        self, queue_name: str, callback: Callable[[Dict[str, Any]], Awaitable[None]]
    ):
        if not self.channel:
            await self.connect()

        queue = await self.channel.declare_queue(queue_name, durable=True)

        async with queue.iterator() as queue_iter:
            async for message in queue_iter:
                async with message.process():
                    body = message.body.decode()
                    message_data = json.loads(body)
                    log.info(f" [x] Received {message_data}")
                    await callback(message_data)

    async def close(self):
        if self.connection:
            await self.connection.close()
