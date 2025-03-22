from app.domain.exceptions import (
    InvalidCredentials,
    UserAlreadyExists,
    FailedToRegister,
)
from app.domain.schemas.model import TokenModel
from app.infrastructure.repository.user_repo import UserRepository
from app.infrastructure.utils.jwt.jwt import JWTSerivce
from app.domain.models import User


class AuthService:

    def __init__(self, user_repo: UserRepository):
        self.repo = user_repo
        self.jwt = JWTSerivce()

    async def login(self, email_or_username: str, password: str) -> TokenModel:
        user = await self.repo.get_user_by_email_or_username(s=email_or_username)
        if not user:
            raise InvalidCredentials()

        if not user.verify_password(password, user.password):
            raise InvalidCredentials()

        token = TokenModel(
            access_token=self.jwt.create_access_token(user),
            refresh_token=self.jwt.create_refresh_token(user),
        )

        return token

    async def register(
        self,
        email: str,
        username: str,
        password: str,
    ) -> tuple[User, TokenModel]:

        if await self.repo.is_user_exists(email=email, username=username):
            raise UserAlreadyExists()

        # create user
        new_user = await self.repo.create(
            email=email, username=username, password=password
        )

        if new_user is None:
            raise FailedToRegister()

        token = await self.login(email_or_username=email, password=password)

        return (new_user, token)
