from fastapi import FastAPI
import uvicorn
import os

def serve():
    print("=== SERVER STARTING ===")

    app = FastAPI()

    @app.get("/")
    def root():
        return {"status": "ok"}

    port = int(os.getenv("PORT", "8000"))
    print(f"Using port: {port}")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="debug",
    )