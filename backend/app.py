from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from madhu_ai.core.chatbot import MadhuAI

app = FastAPI(
    title="MadhuAI",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
    "http://localhost:5173",
    "https://madhu-ai-framework.vercel.app/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Creating MadhuAI...")

bot = MadhuAI()

print("Mounting routes...")

bot.mount(app)

print("Backend Ready 🚀")