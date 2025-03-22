from pydantic import BaseModel, EmailStr

# Incoming form body


class LoginCredentials(BaseModel):
    username_or_email: str
    password: str

    @staticmethod
    def exmaple():
        return {"username_or_email": "joe", "password": "secret"}


class RegisterCredentials(BaseModel):
    username: str
    password: str
    email: EmailStr

    @staticmethod
    def exmaple():
        return {"email": "joe.doe@example.com", "password": "secret", "username": "joe"}


class GoogleSSOBody(BaseModel):
    code: str
    client_id: str
    client_secret: str
    redirect_uri: str
    grant_type: str

    @staticmethod
    def example():
        return {
            "code": "auth_code_example",
            "client_id": "your-client-id",
            "client_secret": "your-client-secret",
            "redirect_uri": "https://your-redirect-uri.com",
            "grant_type": "authorization_code",
        }
