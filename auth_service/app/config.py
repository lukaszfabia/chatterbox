from dataclasses import dataclass
import os
from dotenv import load_dotenv

from fastapi.security import OAuth2PasswordBearer
import logging


@dataclass(frozen=True)
class RabbitConfig:
    login: str
    password: str
    port: int
    host: str


config_for_rabbit = RabbitConfig(
    login=os.getenv("RABBITMQ_DEFAULT_USER"),
    password=os.getenv("RABBITMQ_DEFAULT_PASS"),
    port=os.getenv("RABBITMQ_PORT"),
    host=os.getenv("RABBITMQ_HOST"),
)


load_dotenv(os.path.join(os.path.dirname(__file__), "..", ".env"))

logger = logging.getLogger()
logging.basicConfig(level=logging.INFO)

APP_NAME = ""

HANDLED_PROVIDERS = "google"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI")

GOOGLE_TOKEN_URL = os.getenv("GOOGLE_TOKEN_URL")


# JWT
DECODE_ALGO = "HS256"
JWT_SECRET = os.getenv("JWT_SECRET")

DATABASE_URL = os.getenv("DATABASE_URL")
