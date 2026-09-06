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
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "https://madhu-ai-framework.vercel.app",
        "https://madhu-ai-framework-51atyrs0n-madhusai-official-09s-projects.vercel.app",
    ],
    allow_credentials=True,
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