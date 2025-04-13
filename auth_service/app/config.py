from dataclasses import dataclass
import os
from dotenv import load_dotenv
from authlib.integrations.starlette_client import OAuth
from fastapi.security import OAuth2PasswordBearer
import logging

load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))


@dataclass(frozen=True)
class RabbitConfig:
    login: str
    password: str
    port: int
    host: str


config_for_rabbit = RabbitConfig(
    login=os.getenv("RABBITMQ_DEFAULT_USER"),
    password=os.getenv("RABBITMQ_DEFAULT_PASS"),
    port=int(os.getenv("RABBITMQ_PORT")) or 5672,
    host=os.getenv("RABBITMQ_HOST") or "localhost",
)


logger = logging.getLogger()
logging.basicConfig(level=logging.INFO)

APP_NAME = "Chatterbox"

HANDLED_PROVIDERS = "google"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")


# JWT
DECODE_ALGO = "HS256"
JWT_SECRET = os.getenv("JWT_SECRET")
SECRET = os.getenv("SECRET")


oauth = OAuth()
oauth.register(
    name="google",
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)
