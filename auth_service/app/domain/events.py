from dataclasses import asdict, dataclass
import json
import uuid


@dataclass(frozen=True)
class UserCreatedEvent:
    userID: str
    email: str
    username: str


@dataclass(frozen=True)
class UserAuthEvent:
    userID: str
    email: str
