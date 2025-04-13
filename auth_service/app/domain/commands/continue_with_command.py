from pydantic import BaseModel, EmailStr, Field, field_validator

from app.config import HANDLED_PROVIDERS


class ContinueWithCommand(BaseModel):
    """Command model for continuing authentication via SSO provider.

    Used when a user attempts to continue login or signup using a supported Single Sign-On (SSO) provider.

    Attributes:
        email (EmailStr): User's verified email address.
        sso_provider (str): Name of the SSO provider used to initiate the flow (e.g., 'google').

    Example:
        >>> ContinueWithCommand.example()
        {
            'email': 'alice@example.com',
            'sso_provider': 'google'
        }
    """

    email: EmailStr = Field(..., description="User's email address from SSO provider.")
    sso_provider: str = Field(
        ..., description="Name of the SSO provider (e.g., google)."
    )

    @field_validator("sso_provider")
    def validate_provider(cls, provider: str) -> str:
        """Validates that the SSO provider is among the supported list.

        Args:
            provider: The input provider string.

        Returns:
            str: The valid and lowercased provider string.

        Raises:
            ValueError: If provider is not supported.

        Supported providers:
            - google
            - github
            - facebook (example)

        Note:
            The list of supported providers can be extended.
        """
        normalized = provider.strip().lower()
        if normalized not in HANDLED_PROVIDERS:
            raise ValueError(
                f"Unsupported SSO provider: '{provider}'. Must be one of: {', '.join(HANDLED_PROVIDERS)}"
            )
        return normalized
