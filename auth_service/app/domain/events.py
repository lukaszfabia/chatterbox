from dataclasses import dataclass
import uuid


@dataclass(frozen=True)
class UserCreatedEvent:
    userID: uuid.UUID
    email: str
    username: str


@dataclass(frozen=True)
class UserAuthEvent:
    userID: uuid.UUID
    email: str
