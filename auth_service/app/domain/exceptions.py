# Add custom exceptions..


from fastapi import HTTPException

from fastapi import status


class FailedToRegister(HTTPException):
    def __init__(
        self,
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Failed to register",
        headers=None,
    ):
        super().__init__(status_code, detail, headers)


class UserAlreadyExists(HTTPException):
    def __init__(
        self,
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="User already exists",
        headers=None,
    ):
        super().__init__(status_code, detail, headers)


class TokenExpired(HTTPException):
    def __init__(
        self,
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token has expired",
        headers=None,
    ):
        super().__init__(status_code, detail, headers)


class InvalidToken(HTTPException):
    def __init__(
        self,
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid token",
        headers=None,
    ):
        super().__init__(status_code, detail)


class InvalidSSOLogin(HTTPException):
    pass


class UnsupportedProvider(HTTPException):
    def __init__(self, provider: str):
        detail = f"Provider '{provider}' is not supported."
        super().__init__(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=detail,
        )


class InvalidCredentials(HTTPException):
    def __init__(self):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password or email"
        )
