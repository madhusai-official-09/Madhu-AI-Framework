from dataclasses import dataclass
from functools import lru_cache
import os

from dotenv import load_dotenv

from .core.constants import *

load_dotenv()


@dataclass
class Config:
    provider: str = os.getenv("PROVIDER", "groq")

    api_key: str = ""
    model: str = ""

    temperature: float = float(os.getenv("TEMPERATURE", DEFAULT_TEMPERATURE))
    max_tokens: int = int(os.getenv("MAX_TOKENS", DEFAULT_MAX_TOKENS))

    stream: bool = os.getenv("STREAM", "False").lower() == "true"
    timeout: int = int(os.getenv("TIMEOUT", "30"))

    upload_folder: str = os.getenv("UPLOAD_FOLDER", "uploads")
    chroma_path: str = os.getenv("CHROMA_PATH", "chroma_db")
    embedding_model: str = os.getenv(
        "EMBEDDING_MODEL",
        "all-MiniLM-L6-v2"
    )

    log_level: str = os.getenv("LOG_LEVEL", "INFO")

    def __post_init__(self):
        if self.provider == "groq":
            self.api_key = os.getenv("GROQ_API_KEY", "")
            self.model = os.getenv("GROQ_MODEL", DEFAULT_MODEL)


@lru_cache
def get_config():
    return Config()


config = get_config()