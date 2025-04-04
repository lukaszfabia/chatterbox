from typing import Optional
from pydantic import BaseModel, EmailStr


class CreateUserCommand(BaseModel):
    email: EmailStr
    username: str
    password: str

    @staticmethod
    def exmaple():
        return {"email": "joe.doe@example.com", "password": "secret", "username": "joe"}


class DeleteUserCommand(BaseModel):
    userID: str

    @staticmethod
    def exmaple():
        return {"userID": "aljshdgakjdghaskjd"}


class UpdateUserCommand(BaseModel):
    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: Optional[str] = None

    @staticmethod
    def exmaple():
        return {"email": "joe.doe@example.com", "username": "joe", "password": "******"}


class LogoutUserCommand(BaseModel): ...
