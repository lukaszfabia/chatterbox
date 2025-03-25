from datetime import timedelta, timezone, datetime
import uuid

from fastapi import Depends
from pydantic import BaseModel
from app.config import DECODE_ALGO, JWT_SECRET, oauth2_scheme
import jwt

from app.domain.exceptions import InvalidToken, TokenExpired


class Settings(BaseModel):
    authjwt_secret_key: str = JWT_SECRET
    authjwt_algorithm: str = DECODE_ALGO
    access_token_expiration: int = timedelta(seconds=60 * 60 * 24)  # 24h
    refresh_token_expiration: timedelta = timedelta(seconds=60 * 60 * 24 * 30)


settings = Settings()


class JWTSerivce:

    @staticmethod
    def __create_token(sub: str, expires_delta: timedelta):
        """Factory to make tokens, encodes info about obejct(user)

        Args:
            sub (str): info to encode
            expires_delta (timedelta): expire date

        Returns:
            bytes/str: token
        """
        data = {"sub": sub}

        expire = datetime.now(timezone.utc) + expires_delta
        data.update({"exp": expire})
        encoded_jwt = jwt.encode(
            data, settings.authjwt_secret_key, algorithm=settings.authjwt_algorithm
        )
        return encoded_jwt

    @staticmethod
    def create_access_token(sub: uuid.UUID):
        """Get new access token"""
        return JWTSerivce.__create_token(
            sub=str(sub), expires_delta=settings.access_token_expiration
        )

    @staticmethod
    def create_refresh_token(sub: uuid.UUID):
        """Get new refresh token"""
        return JWTSerivce.__create_token(
            sub=str(sub), expires_delta=settings.refresh_token_expiration
        )

    @staticmethod
    def __verify_access_token(token: str):
        """Checks expire state of the token

        Args:
            token (str): token to check

        Raises:
            HTTPException: Token has expired or Invalid token

        Returns:
            Mapping: payload
        """
        try:
            payload = jwt.decode(
                token,
                settings.authjwt_secret_key,
                algorithms=[settings.authjwt_algorithm],
            )
            return payload
        except jwt.ExpiredSignatureError:
            raise TokenExpired()
        except jwt.JWTError:
            raise InvalidToken()

    @staticmethod
    def get_current_user(token: str = Depends(oauth2_scheme)):
        """(Middleware) Validate current user

        Args:
            token (str, optional): incoming Bearer token. Defaults to Depends(oauth2_scheme).

        Returns:
            _type_: payload
        """
        return JWTSerivce.__verify_access_token(token)
