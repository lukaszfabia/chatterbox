from dataclasses import dataclass
from typing import Optional


@dataclass(frozen=True)
class UserCreatedEvent:
    userID: str
    email: str
    username: str


@dataclass(frozen=True)
class UserLoggedInEvent:
    userID: str


@dataclass(frozen=True)
class UserLoggedOutEvent:
    userID: str


@dataclass(frozen=True)
class UserUpdatedEvent:
    userID: Optional[str]
    email: Optional[str]
    username: Optional[str]


@dataclass(frozen=True)
class UserDeletedEvent:
    userID: str
    email: str
