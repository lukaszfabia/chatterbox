from datetime import datetime
import uuid
from sqlalchemy import UUID, Column, DateTime, String, Date
import bcrypt
from sqlalchemy.ext.declarative import declarative_base
from app.domain.events.user_created_event import UserCreatedEvent
from app.domain.events.user_deleted_event import UserDeletedEvent
from app.domain.events.user_updated_event import UserUpdatedEvent

Base = declarative_base()


class User(Base):
    """Represents a user entity in the system with event-driven capabilities.

    This class maps to the 'users' database table and includes methods for:
    - Password hashing/verification (using bcrypt)
    - Generating domain events (CQRS/Event-Driven)
    - Soft-delete functionality

    Attributes:
        id (UUID): Primary key, auto-generated.
        deleted_at (Date): Timestamp for soft deletion (None if active).
        created_at (DateTime): Record creation timestamp.
        updated_at (DateTime): Last update timestamp (auto-updated).
        username (str): Unique username.
        email (str): Unique email address.
        password (str): Hashed password (nullable for SSO users).
        sso_provider (str): SSO provider name if applicable.
    """

    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    deleted_at = Column(Date, default=None)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, onupdate=datetime.now)
    username = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=True)
    sso_provider = Column(String, nullable=True)

    def __repr__(self) -> str:
        """Provides a developer-friendly string representation.

        Returns:
            str: User representation in format '<User(id=..., username=..., email=...)>'
        """
        return f"<User(id={self.id}, username={self.username}, email={self.email})>"

    @staticmethod
    def hash_password(password: str) -> str:
        """Hashes a plaintext password using bcrypt.

        Args:
            password: Plaintext password to hash.

        Returns:
            str: BCrypt-hashed password (UTF-8 encoded).

        Example:
            >>> User.hash_password("secret")
            '$2b$12$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW'
        """
        password_bytes = password.encode("utf-8")
        return bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode("utf-8")

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str | None) -> bool:
        """Verifies a plain password against a hashed version.

        Args:
            plain_password: Input password to verify.
            hashed_password: Stored hash to compare against (None for SSO users).

        Returns:
            bool: True if passwords match, False otherwise.

        Note:
            Returns False immediately if hashed_password is None (SSO users).
        """
        if hashed_password is None:
            return False
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), hashed_password.encode("utf-8")
        )

    def get_created_user_event(self) -> UserCreatedEvent:
        """Generates a UserCreatedEvent for event-driven workflows.

        Returns:
            UserCreatedEvent: With userID, email, and username.
        """
        return UserCreatedEvent(
            userID=str(self.id), email=self.email, username=self.username
        )

    def get_user_updated_event(self) -> UserUpdatedEvent:
        """Generates a UserUpdatedEvent after profile changes.

        Returns:
            UserUpdatedEvent: With userID, email, and username.
        """
        return UserUpdatedEvent(
            userID=str(self.id), email=self.email, username=self.username
        )

    def get_deleted_user_event(self) -> UserDeletedEvent:
        """Generates a UserDeletedEvent for soft-delete scenarios.

        Returns:
            UserDeletedEvent: With userID and email.
        """
        return UserDeletedEvent(userID=str(self.id), email=self.email)
