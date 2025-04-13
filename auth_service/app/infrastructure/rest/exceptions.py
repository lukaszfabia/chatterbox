from fastapi import HTTPException
from fastapi import status


# Add custom exceptions..


class OAuthFailed(HTTPException):
    def __init__(
        self,
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Invalid token or failed to parse token id.",
        headers=None,
    ):
        super().__init__(status_code, detail, headers)


class FailedToUpdate(HTTPException):
    def __init__(
        self,
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Failed to update login data, check your new credintials again",
        headers=None,
    ):
        super().__init__(status_code, detail, headers)


class FailedToLoggedOut(HTTPException):
    def __init__(
        self,
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Failed to logout user",
        headers=None,
    ):
        super().__init__(status_code, detail, headers)


class FailedToDelete(HTTPException):
    def __init__(
        self,
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Failed to delete account, try again",
        headers=None,
    ):
        super().__init__(status_code, detail, headers)


class FailedToRegister(HTTPException):
    def __init__(
        self,
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="Failed username or email is taken or password is too weak",
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
