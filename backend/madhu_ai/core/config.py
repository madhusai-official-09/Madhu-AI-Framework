from dataclasses import dataclass
import os
from dotenv import load_dotenv
from ..core.constants import *

load_dotenv()


@dataclass
class Config:
    provider: str = "groq"

    api_key: str = ""
    model: str = ""

    temperature: float = DEFAULT_TEMPERATURE
    max_tokens: int = DEFAULT_MAX_TOKENS

    stream: bool = False
    timeout: int = 30

    def __post_init__(self):

        if self.provider == "groq":
            self.api_key = os.getenv("GROQ_API_KEY", "")
            self.model = DEFAULT_MODEL