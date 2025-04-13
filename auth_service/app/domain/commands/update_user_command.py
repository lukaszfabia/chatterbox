from typing import Optional
from pydantic import BaseModel, EmailStr, field_validator


class UpdateUserCommand(BaseModel):
    """Command model for partial user profile updates.

    Validates optional fields for user profile modifications with the same rules as creation,
    but allows null/None values for partial updates. At least one field must be provided.

    Attributes:
        email (Optional[EmailStr]): New email if updating, must be valid format.
        username (Optional[str]): New username if updating, non-empty when provided.
        password (Optional[str]): New password if updating, minimum 8 characters when provided.

    Example:
        >>> UpdateUserCommand.example()
        {
            'email': 'joe.doe@example.com',
            'username': 'joe_updated',
            'password': 'newSecurePassword123'
        }
    """

    email: Optional[EmailStr] = None
    username: Optional[str] = None
    password: Optional[str] = None

    @staticmethod
    def example() -> dict:
        """Provides a standard example payload for API documentation.

        Returns:
            dict: Sample update command with all optional fields populated.
        """
        return {
            "email": "joe.doe@example.com",
            "username": "joe_updated",
            "password": "newSecurePassword123",
        }

    @field_validator("password")
    def check_password_strength(cls, password: Optional[str]) -> Optional[str]:
        """Validates password meets security requirements when provided.

        Args:
            password: Optional new password value.

        Returns:
            Optional[str]: Original password if valid or None.

        Raises:
            ValueError: If provided password is shorter than 8 characters.
        """
        if password is not None and len(password) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return password

    @field_validator("username")
    def check_username_validity(cls, username: Optional[str]) -> Optional[str]:
        """Ensures username validity when provided.

        Args:
            username: Optional new username value.

        Returns:
            Optional[str]: Trimmed username if valid, None otherwise.

        Raises:
            ValueError: If provided username is empty or whitespace-only.
        """
        if username is not None:
            stripped = username.strip()
            if not stripped:
                raise ValueError("Username cannot be empty or whitespace-only")
            return stripped
        return username

    @field_validator("*", mode="after")
    def check_at_least_one_field(cls, values):
        """Ensures at least one field is provided for the update.

        Args:
            values: Dictionary of validated field values.

        Raises:
            ValueError: If all fields are None/empty.
        """
        if all(v is None for v in values.values()):
            raise ValueError("At least one field must be provided for update")
        return values
