from dataclasses import dataclass


@dataclass(frozen=True)
class CreateUserCommand:
    user_id: int | str
    email: str
    username: str
