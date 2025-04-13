from pydantic import BaseModel, EmailStr, field_validator


class AuthUserQuery(BaseModel):
    """Authentication request model supporting both email and username login.

    Validates credentials according to security requirements and provides
    a sample request structure for API documentation.

    Attributes:
        email_or_username: Login identifier (valid email or non-empty username).
        password: Secret credential (minimum 8 characters).

    Example:
        >>> AuthUserQuery.example()
        {'email_or_username': 'joe.doe@example.com', 'password': 'secret123'}
    """

    email_or_username: str
    password: str

    @classmethod
    def examples(cls) -> dict[str, dict]:
        """Returns multiple validation scenarios for documentation."""
        return {
            "valid_email": {
                "email_or_username": "test@example.com",
                "password": "secure123",
            },
            "valid_username": {
                "email_or_username": "user123",
                "password": "longpassword",
            },
        }

    @field_validator("email_or_username")
    def check_email_or_username(cls, value: str) -> str:
        """Validates that the input is either:
        1. A properly formatted email (if contains '@'), or
        2. A non-empty username string.

        Args:
            value: Raw input value to validate.

        Returns:
            str: Validated identifier.

        Raises:
            ValueError: For invalid email format or empty username.
        """
        if "@" in value:
            try:
                EmailStr.validate(value)
            except ValueError as e:
                raise ValueError("Invalid email format") from e
        elif not value.strip():
            raise ValueError("Username cannot be empty")
        return value

    @field_validator("password")
    def check_password_strength(cls, password: str) -> str:
        """Enforces minimum password security requirements.

        Args:
            password: Raw password to validate.

        Returns:
            str: Validated password if meets requirements.

        Raises:
            ValueError: If password is shorter than 8 characters.
        """
        if len(password) < 8:
            raise ValueError("Password must be at least 8 characters")
        return password
