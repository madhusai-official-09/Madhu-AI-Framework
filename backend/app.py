from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from madhu_ai.core.firebase import *
from madhu_ai.core.chatbot import MadhuAI
from madhu_ai.config import config
from madhu_ai.core.logger import logger

app = FastAPI(
    title="MadhuAI",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "MadhuAI v2",
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "provider": config.provider,
        "model": config.model,
    }


logger.info("Initializing MadhuAI...")

bot = MadhuAI(config)

bot.mount(app)

logger.info("MadhuAI Backend Ready 🚀")