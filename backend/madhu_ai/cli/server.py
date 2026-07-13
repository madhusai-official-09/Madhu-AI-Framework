from fastapi import FastAPI
import uvicorn
import os
from madhu_ai import MadhuAI

print("SERVER.PY IMPORTED")

def serve():
    print("STEP 1 - serve() called")

    app = FastAPI()

    print("STEP 2 - FastAPI created")

    bot = MadhuAI()

    print("STEP 3 - MadhuAI created")

    bot.mount(app)

    print("STEP 4 - Router mounted")

    port = int(os.getenv("PORT", 8000))

    print(f"STEP 5 - Starting uvicorn on {port}")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="debug",
    )