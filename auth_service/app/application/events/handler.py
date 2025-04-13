from abc import ABC, abstractmethod


class EventHandler(ABC):
    """
    Abstract base class for event handlers in an event-driven architecture.

    All concrete implementations must define the `handle` method, which is responsible
    for processing incoming messages or events.

    This class can be extended to implement specific logic for handling different
    types of events (e.g., UserCreatedEvent, UserLoggedOutEvent, etc.).
    """

    def __init__(self):
        """
        Initializes the base event handler.

        Can be extended by subclasses to add additional setup logic.
        """
        super().__init__()

    @abstractmethod
    def handle(self, msg):
        """
        Abstract method to handle an incoming event message.

        Args:
            msg: The message or event to be handled. The type of `msg` should be defined
                 by the implementing subclass based on the specific use case.

        Raises:
            NotImplementedError: If not implemented by a subclass.
        """
        ...
