from app.application.events.handler import EventHandler
from typing import Dict


class Dispatcher:
    """
    Dispatcher for routing events to their corresponding handlers.

    This class maintains a registry of event handlers and dispatches
    events to the appropriate handler based on the queue name.
    """

    def __init__(self):
        """
        Initializes an empty registry for event handlers.
        """
        self.handlers: Dict[str, EventHandler] = {}

    def register(self, q_name: str, handler: EventHandler):
        """
        Registers an event handler for a given queue name.

        Args:
            q_name (str): The name of the queue/event type.
            handler (EventHandler): The handler instance to associate with this queue.
        """
        self.handlers[q_name] = handler

    def handle_event(self, q_name: str, msg):
        """
        Dispatches the message to the registered handler for the given queue name.

        Args:
            q_name (str): The name of the queue/event type.
            msg: The message or event data to handle.

        Raises:
            KeyError: If no handler is registered for the given queue name.
        """
        if q_name in self.handlers:
            self.handlers[q_name].handle(msg)
        else:
            raise KeyError(f"No handler registered for queue: {q_name}")
