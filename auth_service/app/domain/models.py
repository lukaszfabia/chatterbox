from sqlalchemy import Column, Integer, String, Date
from sqlalchemy.ext.declarative import declarative_base
import bcrypt

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    deleted_at = Column(Date, default=None)

    username = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=False, unique=True)
    password = Column(String, nullable=True)
    sso_provider = Column(String, nullable=True)

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email})>"

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
