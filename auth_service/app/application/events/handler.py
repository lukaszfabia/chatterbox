from abc import ABC, abstractmethod


class EventHandler(ABC):
    def __init__(self):
        super().__init__()

    @abstractmethod
    def handle(self, msg): ...
