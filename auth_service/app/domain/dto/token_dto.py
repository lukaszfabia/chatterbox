from pydantic import BaseModel, Field
from typing import Optional


class TokenDTO(BaseModel):
    """Data Transfer Object (DTO) for JWT token pair responses.

    Represents a standardized format for returning authentication tokens to clients,
    containing both short-lived access token and long-lived refresh token.

    Attributes:
        access_token (str): JWT token for API authorization (short-lived, typically 15-60 minutes)
        refresh_token (str): JWT token for obtaining new access tokens (long-lived, typically 7-30 days)
        token_type (str): Always 'bearer' per OAuth2 standards (default: 'bearer')

    Example:
        >>> TokenDTO.example()
        {
            'access_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            'refresh_token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            'token_type': 'bearer'
        }
    """

    access_token: str = Field(..., description="Short-lived JWT for API access")
    refresh_token: str = Field(..., description="Long-lived JWT for token renewal")

    @staticmethod
    def example() -> dict:
        """Provides a standard example for API documentation.

        Returns:
            dict: Example token response following OAuth2 standards.
                  Note: Tokens are truncated for readability in actual usage.
        """
        return {
            "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
            "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        }

    class Config:
        json_schema_extra = {
            "example": {
                "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
                "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
            },
            "description": "Successful authentication response containing JWT token pair",
        }
