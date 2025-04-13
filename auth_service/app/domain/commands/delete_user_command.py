import uuid
from pydantic import BaseModel, field_validator, Field


class DeleteUserCommand(BaseModel):
    """Command model for user deletion requests.

    Validates that the provided userID is a properly formatted UUIDv4 string.
    This ensures only valid identifiers can be processed by the deletion handler.

    Attributes:
        userID (str): UUID string identifying the user to delete.
    """

    userID: str = Field(..., description="550e8400-e29b-41d4-a716-446655440000")

    @field_validator("userID")
    def validate_uuid(cls, userID: str) -> str:
        """Validates that the userID is a properly formatted UUID string.

        Args:
            userID: Input string to validate.

        Returns:
            str: Validated UUID string if formatting is correct.

        Raises:
            ValueError: If the input is either:
                - None or empty
                - Not a valid UUID string

        Examples:
            Valid: "550e8400-e29b-41d4-a716-446655440000"
            Invalid: "aljshdgakjdghaskjd" (raises ValueError)
        """
        if not userID:
            raise ValueError("UserID cannot be empty or None")

        try:
            return str(uuid.UUID(userID))
        except ValueError as e:
            raise ValueError(f"Invalid UUID format: {userID}") from e
