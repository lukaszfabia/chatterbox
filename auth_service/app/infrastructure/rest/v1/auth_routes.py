import os
from fastapi import APIRouter, Body, Depends, HTTPException, Request, status
from app.application.commands.continue_with_command import ContinueWithCommandService
from app.application.commands.create_user_command_service import (
    CreateUserCommandService,
)
from app.application.commands.delete_user_command_service import (
    DeleteUserCommandService,
)
from app.application.commands.update_user_command_service import (
    UpdateUserCommandService,
)
from app.application.queries.auth_user_query_service import AuthUserQueryService
from app.application.queries.log_out_user_query import LogoutUserQueryService
from app.dependencies import (
    get_continue_with_command_service,
    get_create_user_command_service,
    get_auth_user_query_service,
    get_update_user_command_service,
    get_delete_user_command_service,
    get_logout_user_command_service,
)
from app.domain.commands.continue_with_command import ContinueWithCommand
from app.domain.queries.auth_user_query import AuthUserQuery
from app.domain.commands.create_user_command import CreateUserCommand
from app.domain.commands.update_user_command import UpdateUserCommand
from app.domain.commands.delete_user_command import DeleteUserCommand
from app.domain.dto.token_dto import TokenDTO
from app.domain.queries.logout_user_query import LogoutUserQuery
from app.infrastructure.rest.exceptions import (
    FailedToRegister,
    InvalidCredentials,
    FailedToDelete,
    FailedToUpdate,
    OAuthFailed,
    UnsupportedProvider,
)
from app.config import HANDLED_PROVIDERS, oauth2_scheme, oauth

auth_router = APIRouter(prefix="/v1/auth")


@auth_router.get(
    "/logout",
    description="Logs the user out by invalidating the current session token.",
    status_code=status.HTTP_200_OK,
    summary="Logout the current user",
)
async def logout(
    service: LogoutUserQueryService = Depends(get_logout_user_command_service),
    token: str = Depends(oauth2_scheme),
):
    """
    Logs out the current user by invalidating the session token.

    - **token**: The OAuth2 token that must be passed as a Bearer token.
    """
    try:
        user_id = await service.get_curr_user_id(token)
        query = LogoutUserQuery(userID=user_id)
        await service.handle(q=query)
    except Exception:
        raise FailedToUpdate()


@auth_router.put(
    "/me",
    description="Update the authentication credentials of the currently logged-in user.",
    status_code=status.HTTP_200_OK,
    summary="Update user credentials",
)
async def update_user_credentials(
    credentials: UpdateUserCommand = Body(..., example=UpdateUserCommand.example()),
    service: UpdateUserCommandService = Depends(get_update_user_command_service),
    token: str = Depends(oauth2_scheme),
):
    """
    Updates the credentials of the current user.

    - **credentials**: New credentials that need to be updated.
    - **token**: The OAuth2 token for authentication, passed as a Bearer token.
    """
    try:
        await service.handle(ent=credentials, token=token)
    except Exception:
        raise FailedToUpdate()


@auth_router.delete(
    "/me",
    description="Soft delete the current user account.",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete user account",
)
async def delete_user(
    service: DeleteUserCommandService = Depends(get_delete_user_command_service),
    token: str = Depends(oauth2_scheme),
):
    """
    Soft deletes the current user's account.

    - **token**: The OAuth2 token passed as a Bearer token.
    """
    try:
        user_id = service.get_curr_user_id(token)
        credentials = DeleteUserCommand(userID=user_id)
        await service.handle(ent=credentials)
    except Exception:
        raise FailedToDelete()


@auth_router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    response_model=TokenDTO,
    summary="Login with email or username",
    description="Authenticate user with email or username to receive a JWT token.",
)
async def login(
    credentials: AuthUserQuery = Body(..., example=AuthUserQuery.examples()),
    service: AuthUserQueryService = Depends(get_auth_user_query_service),
):
    """
    Authenticates a user and returns a JWT token.

    - **credentials**: The user's login credentials (email or username).
    """
    token = await service.handle(ent=credentials)

    if token is None:
        raise InvalidCredentials()

    return token


@auth_router.post(
    "/register",
    description="Create a new user account and return a JWT token.",
    response_model=TokenDTO,
    status_code=status.HTTP_201_CREATED,
    summary="Register a new user",
)
async def register(
    credentials: CreateUserCommand = Body(...),
    service: CreateUserCommandService = Depends(get_create_user_command_service),
):
    """
    Registers a new user and returns a JWT token for authentication.

    - **credentials**: The new user's registration details (email, password, etc.).
    """
    token = await service.handle(ent=credentials)

    if token is None:
        raise FailedToRegister()

    return token


@auth_router.get(
    "/{provider}/login",
    summary="Start OAuth2 login flow",
    description="Redirects the user to the SSO provider's login/consent page.",
    status_code=status.HTTP_307_TEMPORARY_REDIRECT,
)
async def login_with_sso(provider: str, request: Request):
    """
    Initiates an OAuth2 login flow for the specified SSO provider.

    Redirects the user to the provider's authorization page.

    Args:
        provider (str): Name of the supported SSO provider (e.g., "google").
        request (Request): The incoming HTTP request object.

    Returns:
        RedirectResponse: Redirects the user to the provider's authorization URL.

    Raises:
        HTTPException: If the provider is not supported.

    Example:
        >>> GET /api/v1/auth/google/login
        -> Redirects to Google SSO consent page
    """

    if provider not in HANDLED_PROVIDERS:
        raise UnsupportedProvider()

    redirect_uri = request.url_for("auth_callback", provider=provider)

    if provider == "google":
        return await oauth.google.authorize_redirect(request, redirect_uri)

    # add other providers


@auth_router.get(
    "/{provider}/login/callback",
    status_code=status.HTTP_201_CREATED,
    response_model=TokenDTO,
)
async def auth_callback(
    provider: str,
    request: Request,
    service: ContinueWithCommandService = Depends(get_continue_with_command_service),
):
    """
    Handles the OAuth2 callback after successful SSO authentication.

    - Verifies the token received from the provider.
    - Extracts user info from the ID token.
    - Passes the user info to the `ContinueWithCommandService` for registration or login.
    - Returns access and refresh tokens.

    Args:
        provider (str): The SSO provider used for authentication (e.g., "google").
        request (Request): The incoming request containing the callback parameters.
        service (ContinueWithCommandService): Service to process user SSO logic.

    Returns:
        TokenDTO: The generated access and refresh tokens for the user.

    Raises:
        UnsupportedProvider: If the provider is not supported.
        OAuthFailed: If token validation or user info extraction fails.
    """

    if provider not in HANDLED_PROVIDERS:
        raise UnsupportedProvider()

    try:
        token = await oauth.google.authorize_access_token(request)

        user = await oauth.google.parse_id_token(token, None)

        ent = ContinueWithCommand(
            email=user.get("email"),
            sso_provider=provider,
        )

        token = await service.handle(ent=ent)
        return token

    except Exception:
        raise OAuthFailed()
