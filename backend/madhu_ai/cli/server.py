from fastapi import FastAPI
import uvicorn
import os

def serve():
    print("=" * 50)
    print("SERVER STARTED")
    print("=" * 50)

    app = FastAPI()

    @app.get("/")
    def home():
        return {"status": "MadhuAI Backend Running"}

    port = int(os.getenv("PORT", 8000))

    print(f"PORT = {port}")
    print("Starting Uvicorn...")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="debug",
    )