from datetime import datetime
from typing import Optional
import uuid
from sqlalchemy import UUID, Column, DateTime, String, Date
from sqlalchemy.ext.declarative import declarative_base
import bcrypt

from app.domain.events import (
    UserDeletedEvent,
    UserLoggedInEvent,
    UserLoggedOutEvent,
    UserCreatedEvent,
    UserUpdatedEvent,
)

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    deleted_at = Column(Date, default=None)

    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, onupdate=datetime.now)

    username = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=True)
    sso_provider = Column(String, nullable=True)

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email})>"

    def update(
        self,
        username: Optional[str],
        password: Optional[str],
        email: Optional[str],
    ):
        if self.__can_be_set(username, self.username):
            self.username = username

        if self.__can_be_set(email, self.email):
            self.email = email

        # add more validation in the future
        if self.__can_be_set(password, self.password):
            self.password = self.hash_password(password)

        return self

    def mark_as_deleted(self):
        self.deleted_at = datetime.now()

    def __can_be_set(self, s: Optional[str], to_comapre: str) -> bool:
        return s and s != to_comapre and 3 < len(s) < 124

    @staticmethod
    def hash_password(password: str) -> str:
        """Hashes the password using bcrypt"""
        password_bytes = password.encode("utf-8")
        return bcrypt.hashpw(password_bytes, bcrypt.gensalt()).decode("utf-8")

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str | None) -> bool:
        """Verifies a plain password against a hashed password"""
        if hashed_password is None:
            return False
        return bcrypt.checkpw(
            plain_password.encode("utf-8"), hashed_password.encode("utf-8")
        )

    def get_created_user_event(self) -> UserCreatedEvent:
        return UserCreatedEvent(
            userID=str(self.id), email=self.email, username=self.username
        )

    def get_logged_in_user_event(self) -> UserLoggedInEvent:
        return UserLoggedInEvent(userID=str(self.id))

    def get_logged_out_user_event(self) -> UserLoggedOutEvent:
        return UserLoggedOutEvent(userID=str(self.id))

    def get_user_updated_event(self) -> UserUpdatedEvent:
        return UserUpdatedEvent(
            userID=str(self.id), email=self.email, username=self.username
        )

    def get_deleted_user_event(self) -> UserDeletedEvent:
        return UserDeletedEvent(userID=str(self.id), email=self.email)
