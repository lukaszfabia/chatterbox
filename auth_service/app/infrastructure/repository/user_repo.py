from datetime import datetime
from typing import Optional
import uuid
from pydantic import EmailStr
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import or_, and_, update
from app.domain.models.user import User
from app.infrastructure.repository.decorators import handle_tx


class UserRepository:
    """
    Repository for interacting with the User model in the database.

    Provides methods for common user operations such as:
    - Retrieving a user by email or username
    - Checking if a user exists
    - Creating, updating, and deleting a user
    - All methods utilize database transactions via the `handle_tx` decorator.

    Attributes:
        db (AsyncSession): The async database session instance.
    """

    def __init__(self, db: AsyncSession):
        """
        Initializes the UserRepository with a database session.

        Args:
            db (AsyncSession): The database session instance used for async operations.
        """
        self.db = db

    async def get_user_by_email_or_username(self, s: str) -> Optional[User]:
        """
        Retrieves a user by their email or username.

        Args:
            s (str): The email or username of the user.

        Returns:
            Optional[User]: The user instance if found, None if not found or deleted.
        """
        return (
            await self.db.execute(
                select(User).filter(
                    or_(User.email == s, User.username == s),
                    User.deleted_at.is_(None),
                )
            )
        ).scalar_one_or_none()

    async def get_user_by_uid(self, id: str) -> Optional[User]:
        """
        Retrieves a user by their unique identifier (UUID).

        Args:
            id (str): The user ID as a string.

        Returns:
            Optional[User]: The user instance if found, None if not found or deleted.
        """
        uid = uuid.UUID(id)

        return (
            await self.db.execute(
                select(User).filter(User.id == uid, User.deleted_at.is_(None))
            )
        ).scalar_one_or_none()

    async def is_user_exists(self, username: str, email: str) -> bool:
        """
        Checks if a user exists based on their username and email.

        Args:
            username (str): The user's username.
            email (str): The user's email address.

        Returns:
            bool: True if the user exists, False otherwise.
        """
        stmt = select(User).filter(
            and_(User.email == email, User.username == username),
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none() is not None

    @handle_tx
    async def create(
        self,
        email: str,
        username: str,
        password: str,
    ) -> Optional[User]:
        """
        Creates a new user in the system.

        Args:
            username (str): The desired username of the new user.
            email (str): The email address of the new user.
            password (str): The plaintext password of the new user.

        Returns:
            Optional[User]: The created user instance if successful, None otherwise.
        """
        user = User(
            email=email,
            username=username,
            password=User.hash_password(password=password),
        )

        self.db.add(user)

        return user

    @handle_tx
    async def create_with_sso(self, email: str, sso_provider: str) -> Optional[User]:
        """
        Creates a new user in the system, with sso provider.

        Note:
            Username is created based on email and it is first part of email.

        Example:
            >>> joedoe@example.com -> username = joedoe

        Args:
            email (str): The email address of the new user.
            sso_provider (str): Third party website name, which provides data.

        Returns:
            Optional[User]: The created user instance if successful, None otherwise.
        """
        existsing: Optional[User] = await self.get_user_by_email_or_username(s=email)
        if existsing:
            return existsing

        user = User(
            email=email, sso_provider=sso_provider, username=email.split("@")[0]
        )

        self.db.add(user)

        return user

    @handle_tx
    async def update_user(
        self, id: str, username: str, email: EmailStr, password: str
    ) -> Optional[User]:
        """
        Updates the details of an existing user.

        Args:
            id (str): The ID of the user to update.
            username (str): The new username for the user.
            email (EmailStr): The new email address for the user.
            password (str): The new password for the user.

        Returns:
            Optional[User]: The updated user instance if successful, None otherwise.
        """
        user = await self.db.execute(
            update(User)
            .where(User.id == id, User.deleted_at.is_(None))
            .values(
                username=username,
                email=email,
                password=password,
                updated_at=datetime.now(),
            )
            .returning(User)
        )

        return user.scalar_one_or_none()

    @handle_tx
    async def delete_user(self, userID: str) -> Optional[User]:
        """
        Soft deletes a user by setting the `deleted_at` timestamp.

        Args:
            userID (str): The ID of the user to delete.

        Returns:
            Optional[User]: The deleted user instance if successful, None otherwise.
        """
        uid = uuid.UUID(userID)

        user = await self.db.execute(
            update(User)
            .where(User.id == uid, User.deleted_at.is_(None))
            .values(deleted_at=datetime.now())
            .returning(User)
        )

        return user.scalar_one_or_none()
