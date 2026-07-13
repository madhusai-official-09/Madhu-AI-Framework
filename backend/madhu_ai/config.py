import os

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")

MODEL = os.getenv(
    "MODEL",
    "llama-3.3-70b-versatile"
)

PORT = int(os.getenv("PORT", "8000"))