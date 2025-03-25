from fastapi import APIRouter, Body
from fastapi import status
from fastapi import Depends
from app.application.command_handlers import CreateUserCommandHandler
from app.application.query_handlers import AuthUserQueryHandler

# from app.config import (
#     DECODE_ALGO,
#     GOOGLE_CLIENT_ID,
#     GOOGLE_TOKEN_URL,
#     HANDLED_PROVIDERS,
#     GOOGLE_CLIENT_SECRET,
#     GOOGLE_REDIRECT_URI,
#     oauth2_scheme,
# )
from app.dependencies import get_handler
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
    handler: AuthUserQueryHandler = Depends(get_handler),
):
    user, token = await handler.handle(ent=credentials)

    await handler.publish_event(event=user.get_auth_user_event())

    return token


@auth_router.post(
    "/register",
    description="create an account",
    response_model=TokenDTO,
    status_code=status.HTTP_202_ACCEPTED,
)
async def register(
    credentials: CreateUserCommand = Body(..., example=CreateUserCommand.exmaple()),
    handler: CreateUserCommandHandler = Depends(get_handler),
):
    user, token = await handler.handle(ent=credentials)

    # publish event
    event = user.get_created_user_event()

    await handler.rabbit_handler.publish(event)

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
