from fastapi import Depends
from app.infrastructure.auth_service import AuthService
from app.infrastructure.repository.user_repo import UserRepository
from app.infrastructure.database import get_session


def get_auth_service(user_repository: UserRepository = Depends(get_session)):
    return AuthService(user_repository)
