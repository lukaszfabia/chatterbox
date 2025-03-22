from fastapi import APIRouter, Body, HTTPException
from fastapi import status
from fastapi import Depends
import jwt
from app.config import (
    DECODE_ALGO,
    GOOGLE_CLIENT_ID,
    GOOGLE_TOKEN_URL,
    HANDLED_PROVIDERS,
    GOOGLE_CLIENT_SECRET,
    GOOGLE_REDIRECT_URI,
    oauth2_scheme,
)
from app.dependencies import get_auth_service
from app.domain.exceptions import UnsupportedProvider
from app.domain.schemas.model import TokenModel
from app.domain.schemas.body import LoginCredentials, RegisterCredentials
from fastapi import Depends
import requests
from app.application.service.auth_service import AuthService


auth_router = APIRouter(tags=["auth endpoints"], prefix="/auth")


@auth_router.post(
    "/login",
    tags=["login with email or username"],
    status_code=status.HTTP_200_OK,
    response_model=TokenModel,
)
async def login(
    credentials: LoginCredentials = Body(..., example=LoginCredentials.exmaple()),
    auth_service: AuthService = Depends(get_auth_service),
):
    return await auth_service.login(
        email_or_username=credentials.username_or_email, password=credentials.password
    )


@auth_router.post(
    "/register",
    description="create an account",
    response_model=TokenModel,
    status_code=status.HTTP_202_ACCEPTED,
)
async def register(
    credentials: RegisterCredentials = Body(..., example=RegisterCredentials.exmaple()),
    auth_service: AuthService = Depends(get_auth_service),
):
    token, user = await auth_service.register(
        email=credentials.email,
        username=credentials.username,
        password=credentials.password,
    )

    # call to profile service to save data like email, username, id

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
