from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import uvicorn

from madhu_ai.core.chatbot import MadhuAI


def serve():
    app = FastAPI(
        title="Madhu AI",
        version="1.0.0"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True,
    )

    bot = MadhuAI()

    # Comment this until lazy loading is implemented
    # bot.load_knowledge()

    bot.mount(app)

    port = int(os.getenv("PORT", 8000))

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info",
    )