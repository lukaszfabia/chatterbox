from fastapi import APIRouter, Body
from fastapi import status
from fastapi import Depends
from app.application.commands.command_handlers import (
    CreateUserCommandService,
    DeleteUserCommandService,
    UpdateUserCommandService,
)
from app.application.queries.query_handlers import AuthUserQueryService

# from app.config import (
#     DECODE_ALGO,
#     GOOGLE_CLIENT_ID,
#     GOOGLE_TOKEN_URL,
#     HANDLED_PROVIDERS,
#     GOOGLE_CLIENT_SECRET,
#     GOOGLE_REDIRECT_URI,
#     oauth2_scheme,
# )
from app.dependencies import (
    get_create_user_command_service,
    get_auth_user_query_service,
    get_update_user_command_service,
    get_delete_user_command_service,
)
from app.domain.commands import CreateUserCommand, UpdateUserCommand, DeleteUserCommand
from app.domain.queries import AuthUserQuery
from app.domain.dto.model import TokenDTO
from fastapi import Depends
from app.domain.exceptions import (
    FailedToRegister,
    InvalidCredentials,
    FailedToDelete,
    FailedToUpdate,
)
from app.config import oauth2_scheme


auth_router = APIRouter(tags=["auth endpoints"], prefix="/auth")


@auth_router.put("/me", description="Update auth data", status_code=status.HTTP_200_OK)
async def update_user_credintials(
    credentials: UpdateUserCommand = Body(..., example=UpdateUserCommand.exmaple()),
    service: UpdateUserCommandService = Depends(get_update_user_command_service),
    token=Depends(oauth2_scheme),
):
    try:
        user = await service.get_auth_user(token)
        await service.handle(ent=credentials, user=user)
    except Exception:
        raise FailedToUpdate()


@auth_router.delete(
    "/me", description="Soft deletes user", status_code=status.HTTP_200_OK
)
async def delete_user(
    credentials: DeleteUserCommand = Body(..., example=DeleteUserCommand.exmaple()),
    service: DeleteUserCommandService = Depends(get_delete_user_command_service),
    token=Depends(oauth2_scheme),
):
    try:
        user = await service.get_auth_user(token)

        await service.handle(user=user)
    except Exception as e:
        raise FailedToDelete()


@auth_router.post(
    "/login",
    tags=["login with email or username"],
    status_code=status.HTTP_200_OK,
    response_model=TokenDTO,
)
async def login(
    credentials: AuthUserQuery = Body(..., example=AuthUserQuery.exmaple()),
    serivce: AuthUserQueryService = Depends(get_auth_user_query_service),
):
    token = await serivce.handle(ent=credentials)

    if token is None:
        raise InvalidCredentials()

    return token


@auth_router.post(
    "/register",
    description="create an account",
    response_model=TokenDTO,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    credentials: CreateUserCommand = Body(..., example=CreateUserCommand.exmaple()),
    service: CreateUserCommandService = Depends(get_create_user_command_service),
):
    token = await service.handle(ent=credentials)

    if token is None:
        raise FailedToRegister()

    return token


# @auth_router.get(
#     "/{provider}/login",
# )
# async def login_with_sso(provider: str):
#     if provider not in HANDLED_PROVIDERS:
#         raise UnsupportedProvider(provider)

#     return await

# @auth_router.get(
#     "/google/callback"
# )
# async def callback(): ...


# @auth_router.get("/google")
# async def auth_google(code: str):
#     token_url = GOOGLE_TOKEN_URL
#     data = {
#         "code": code,
#         "client_id": GOOGLE_CLIENT_ID,
#         "client_secret": GOOGLE_CLIENT_SECRET,
#         "redirect_uri": GOOGLE_REDIRECT_URI,
#         "grant_type": "authorization_code",
#     }
#     response = requests.post(token_url, data=data)
#     access_token = response.json().get("access_token")
#     user_info = requests.get(
#         "https://www.googleapis.com/oauth2/v1/userinfo",
#         headers={"Authorization": f"Bearer {access_token}"},
#     )
#     return user_info.json()


# @auth_router.get("/google/token")
# async def get_token(token: str = Depends(oauth2_scheme)):
#     return jwt.decode(token, GOOGLE_CLIENT_SECRET, algorithms=[DECODE_ALGO])
