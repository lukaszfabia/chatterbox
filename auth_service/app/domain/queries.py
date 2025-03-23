# immutable operations
from pydantic import BaseModel


class AuthUserQuery(BaseModel):
    email_or_username: str
    password: str

    @staticmethod
    def exmaple():
        return {"email_or_username": "joe", "password": "secret"}
