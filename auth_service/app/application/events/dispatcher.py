from app.application.events.handler import EventHandler


class Dispatcher:
    def __init__(self):
        self.handlers: dict[str, EventHandler] = dict()

    def register(self, q_name: str, handler):
        self.handlers[q_name] = handler

    def handle_event(self, q_name: str, msg):
        if q_name in self.handlers:
            self.handlers[q_name].handle(msg)
