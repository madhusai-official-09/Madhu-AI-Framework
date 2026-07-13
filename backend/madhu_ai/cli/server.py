from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os

from madhu_ai.core.chatbot import MadhuAI


def serve():

    app = FastAPI(
        title="Madhu AI",
        version="1.0.0"
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    bot = MadhuAI()

    # DO NOT LOAD KNOWLEDGE HERE
    # bot.load_knowledge()

    bot.mount(app)

    port = int(os.getenv("PORT", 8000))

    print(f"Starting server on port {port}")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info",
    )