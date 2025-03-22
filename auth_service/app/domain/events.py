from dataclasses import dataclass
from pydantic import BaseModel


@dataclass(frozen=True)
class UserLoggedEvent:
    userID: str
    email: str
    username: str
    isNew: bool
