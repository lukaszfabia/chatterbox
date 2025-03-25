from fastapi import APIRouter, Body
from fastapi import status
from fastapi import Depends
from app.application.commands.command_handlers import CreateUserCommandService
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
)
from app.domain.commands import CreateUserCommand
from app.domain.queries import AuthUserQuery
from app.domain.dto.model import TokenDTO
from fastapi import Depends


auth_router = APIRouter(tags=["auth endpoints"], prefix="/auth")


@auth_router.post(
    "/login",
    tags=["login with email or username"],
    status_code=status.HTTP_200_OK,
    response_model=TokenDTO,
)
async def login(
    credentials: AuthUserQuery = Body(..., example=AuthUserQuery.exmaple()),
    serivce: AuthUserQueryService = Depends(get_create_user_command_service),
):
    token = await serivce.handle(ent=credentials)

    return token


@auth_router.post(
    "/register",
    description="create an account",
    response_model=TokenDTO,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    credentials: CreateUserCommand = Body(..., example=CreateUserCommand.exmaple()),
    handler: CreateUserCommandService = Depends(get_auth_user_query_service),
):
    token = await handler.handle(ent=credentials)

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
