from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.ext.declarative import declarative_base
from app.config import pwd_context

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    deleted_at = Column(Date, default=None)

    username = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=False, unique=True)
    hashed_password = Column(String, nullable=True)
    sso_provider = Column(String, nullable=True)

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email})>"

    @staticmethod
    def hash_password(password: str) -> str:
        """Hashes the password using bcrypt"""
        return pwd_context.hash(password)

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str | None) -> bool:
        """Verifies a plain password against a hashed password"""
        if hashed_password is None:
            return False
        return pwd_context.verify(plain_password, hashed_password)
