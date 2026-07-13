from fastapi import FastAPI

app = FastAPI(title="MadhuAI Test")

@app.get("/")
def root():
    return {"status": "working"}