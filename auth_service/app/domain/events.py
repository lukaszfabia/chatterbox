from dataclasses import dataclass
from pydantic import BaseModel


@dataclass(frozen=True)
class UserCreatedEvent:
    userID: int
    email: str
    username: str


@dataclass(frozen=True)
class UserAuthEvent:
    userID: int
    email: str
