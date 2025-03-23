from dataclasses import dataclass

from pydantic import BaseModel, EmailStr


class CreateUserCommand(BaseModel):
    email: EmailStr
    username: str
    password: str

    @staticmethod
    def exmaple():
        return {"email": "joe.doe@example.com", "password": "secret", "username": "joe"}
