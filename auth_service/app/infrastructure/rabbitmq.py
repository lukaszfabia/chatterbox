from dataclasses import asdict
import aio_pika
import json
from typing import Any, Dict, Callable, Awaitable
import logging

from pydantic import BaseModel

from app.config import RabbitConfig

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("RabbitMQ logger")


class RabbitMQHandler:
    def __init__(self, config: RabbitConfig):
        self.connection = None
        self.channel = None
        self.config = config

    async def connect(self):
        if not self.connection or self.connection.is_closed:
            self.connection = await aio_pika.connect_robust(
                host=self.config.host,
                login=self.config.login,
                password=self.config.password,
                port=self.config.port,
            )
            self.channel = await self.connection.channel()

    async def close(self):
        if self.connection and not self.connection.is_closed:
            await self.connection.close()
            log.info("RabbitMQ connection closed")

    async def publish(self, ent: Any):
        if not self.channel:
            log.info("Reconnecting to channel")
            await self.connect()

        queue_name = ent.__class__.__name__
        await self.channel.declare_queue(queue_name, durable=True)

        log.info(f"Attempting to serialize: {ent}")

        try:
            body = json.dumps(asdict(ent), default=str).encode("utf-8")
        except TypeError as e:
            log.error(f"Error serializing object: {e}")
            return

        await self.channel.default_exchange.publish(
            aio_pika.Message(
                body=body,
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
            ),
            routing_key=queue_name,
        )
        log.info(f" [x] Sent '{ent}' to queue '{queue_name}'")

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
