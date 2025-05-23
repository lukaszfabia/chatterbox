from dataclasses import asdict
import aio_pika
import json
from typing import Any, Dict, Callable, Awaitable
import logging

from app.config import RabbitConfig

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("RabbitMQ logger")


class RabbitMQHandler:
    """
    A class responsible for interacting with RabbitMQ. It provides methods for connecting to RabbitMQ, publishing
    messages to a specified queue, and consuming messages from a queue.

    Attributes:
        connection: The connection to the RabbitMQ server.
        channel: The channel for communication with the RabbitMQ server.
        config: Configuration data for the RabbitMQ connection.
    """

    def __init__(self, config: RabbitConfig):
        """
        Initializes the RabbitMQHandler with the provided configuration.

        Args:
            config (RabbitConfig): The configuration object containing RabbitMQ connection details.
        """
        self.connection = None
        self.channel = None
        self.config = config

    async def connect(self):
        """
        Establishes a connection to RabbitMQ if there is no existing open connection.
        It also creates a channel for communication with the RabbitMQ server.
        """
        if not self.connection or self.connection.is_closed:
            # self.connection = await aio_pika.connect_robust(
            #     host=self.config.host,
            #     login=self.config.login,
            #     password=self.config.password,
            #     port=self.config.port,
            # )

            self.connection = await aio_pika.connect_robust(url=self.config.url)
            self.channel = await self.connection.channel()

    async def close(self):
        """
        Closes the RabbitMQ connection if it is open.
        """
        if self.connection and not self.connection.is_closed:
            await self.connection.close()
            log.info("RabbitMQ connection closed")

    async def publish(self, ent: Any):
        """
        Publishes a message to a RabbitMQ queue. The message is serialized from the provided event object.

        Args:
            ent (Any): The event object to be published. It is expected to be a dataclass object.

        Logs:
            - Attempts to serialize the event object and sends it to the appropriate queue.
            - Logs information about the success or failure of publishing.
        """
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
        """
        Consumes messages from a specified RabbitMQ queue and invokes the provided callback for each message.

        Args:
            queue_name (str): The name of the queue to consume messages from.
            callback (Callable[[Dict[str, Any]], Awaitable[None]]): A function to be called with the message data.

        Logs:
            - Information about each message received from the queue.
        """
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
        """
        Closes the RabbitMQ connection if it is open.

        This method ensures that the connection is properly closed when no longer needed.
        """
        if self.connection:
            await self.connection.close()
