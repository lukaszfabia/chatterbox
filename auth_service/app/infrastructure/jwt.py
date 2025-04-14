from datetime import timedelta, timezone, datetime
import uuid
from fastapi import Depends
from pydantic import BaseModel, Field
import jwt
from app.config import DECODE_ALGO, JWT_SECRET, oauth2_scheme
from app.infrastructure.rest.exceptions import InvalidToken, TokenExpired
from typing import Dict, Any


class JwtSettings(BaseModel):
    """Configuration settings for JWT token handling.

    Attributes:
        authjwt_secret_key (str): Secret key for signing tokens.
        authjwt_algorithm (str): Algorithm used for encoding/decoding.
        access_token_expiration (timedelta): Lifetime of access tokens (default: 24h).
        refresh_token_expiration (timedelta): Lifetime of refresh tokens (default: 30d).
    """

    authjwt_secret_key: str = JWT_SECRET
    authjwt_algorithm: str = DECODE_ALGO
    access_token_expiration: timedelta = Field(
        default=timedelta(hours=24), description="Access token TTL"
    )
    refresh_token_expiration: timedelta = Field(
        default=timedelta(days=30), description="Refresh token TTL"
    )


settings = JwtSettings()


class JWTService:
    """Service handling JWT token creation and validation.

    Provides static methods for:
    - Generating access/refresh tokens
    - Verifying token validity
    - Extracting user information from tokens

    Security Features:
    - Automatic expiration checking
    - Algorithm verification
    - Secure secret key usage
    """

    @staticmethod
    def __create_token(sub: str, expires_delta: timedelta) -> str:
        """Internal factory for generating JWT tokens.

        Args:
            sub: Subject identifier (typically user UUID)
            expires_delta: Token lifetime duration

        Returns:
            str: Encoded JWT token

        Example:
            >>> JWTService.__create_token("user123", timedelta(hours=1))
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        """
        payload = {
            "sub": sub,
            "exp": datetime.now(timezone.utc) + expires_delta,
            "iat": datetime.now(timezone.utc),
            "jti": str(uuid.uuid4()),
        }
        return jwt.encode(
            payload, settings.authjwt_secret_key, algorithm=settings.authjwt_algorithm
        )

    @staticmethod
    def create_access_token(user_id: uuid.UUID) -> str:
        """Generates a short-lived access token.

        Args:
            user_id: Unique identifier of the authenticated user

        Returns:
            str: JWT access token valid for 24h by default
        """
        return JWTService.__create_token(
            sub=str(user_id), expires_delta=settings.access_token_expiration
        )

    @staticmethod
    def create_refresh_token(user_id: uuid.UUID) -> str:
        """Generates a long-lived refresh token.

        Args:
            user_id: Unique identifier of the authenticated user

        Returns:
            str: JWT refresh token valid for 30d by default
        """
        return JWTService.__create_token(
            sub=str(user_id), expires_delta=settings.refresh_token_expiration
        )

    @staticmethod
    def __verify_token(token: str) -> Dict[str, Any]:
        """Validates JWT token and extracts payload.

        Args:
            token: JWT token to verify

        Returns:
            dict: Decoded token payload

        Raises:
            TokenExpired: If token has expired
            InvalidToken: If token is malformed/invalid

        Example:
            >>> JWTService.__verify_token("valid.token.here")
            {'sub': 'user123', 'exp': 1234567890, ...}
        """
        try:
            return jwt.decode(
                token,
                settings.authjwt_secret_key,
                algorithms=[settings.authjwt_algorithm],
                options={"require": ["exp", "sub"]},
            )
        except jwt.ExpiredSignatureError:
            raise TokenExpired()
        except (jwt.InvalidTokenError, jwt.DecodeError) as e:
            raise InvalidToken(detail=str(e))

    @staticmethod
    def get_current_user(token: str = Depends(oauth2_scheme)) -> Dict[str, Any]:
        """FastAPI dependency for authenticating requests.

        Args:
            token: Bearer token from Authorization header

        Returns:
            dict: Decoded token payload if valid

        Raises:
            HTTPException: 401 if token is invalid/expired
        """
        print("[DEBUG] Token:", token)
        return JWTService.__verify_token(token)
