from pydantic import BaseModel, EmailStr, Field, field_validator


class CreateUserCommand(BaseModel):
    """Command model for user creation requests.

    Validates all required fields for new user registration with strict rules for:
    - Email format
    - Username validity
    - Password strength

    Attributes:
        email (EmailStr): Valid email address for the user.
        username (str): Non-empty username without surrounding whitespace.
        password (str): Password with minimum 8 characters.

    Example:
        >>> CreateUserCommand.example()
        {
            'email': 'joe.doe@example.com',
            'username': 'joe',
            'password': 'secret123'  # Note: example shows improved password
        }
    """

    email: EmailStr = Field(..., description="User's email address.")
    username: str = Field(..., description="Name of user.")
    password: str = Field(..., description="Password with minimum 8 characters.")

    @field_validator("password")
    def check_password_strength(cls, password: str) -> str:
        """Enforces minimum password security requirements.

        Args:
            password: Raw password input to validate.

        Returns:
            str: Validated password if meets requirements.

        Raises:
            ValueError: If password is shorter than 8 characters.

        Examples:
            Valid: "securePassword123"
            Invalid: "123" (raises ValueError)
        """
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters long")
        return password

    @field_validator("username")
    def check_username_validity(cls, username: str) -> str:
        """Ensures usernames meet basic requirements.

        Args:
            username: Raw username input to validate.

        Returns:
            str: Trimmed username if valid.

        Raises:
            ValueError: If username is empty after whitespace removal.

        Note:
            - Trims surrounding whitespace
            - Does not currently restrict special characters
        """
        stripped = username.strip()
        if not stripped:
            raise ValueError("Username cannot be empty or whitespace-only")
        return stripped
