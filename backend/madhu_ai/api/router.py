from fastapi import APIRouter, UploadFile, File
from ..schemas.chat import ChatRequest, ChatResponse
from fastapi.responses import StreamingResponse
from ..schemas.history import Message
from .knowledge import router as knowledge_router
import json
import tempfile
import shutil


def create_router(bot):

    router = APIRouter()

    @router.get("/health")
    def health():
        return {
            "status": "ok",
            "sdk": "MadhuAI"
        }
        
    @router.get("/history", response_model=list[Message])
    def history():
        return bot.memory.get_messages()

    @router.post("/chat", response_model=ChatResponse)
    def chat(request: ChatRequest):

        reply = bot.chat(request.message)

        return ChatResponse(reply=reply)
    
    @router.post("/chat/stream")
    
    def chat_stream(request: ChatRequest):

        def generate():

            for token in bot.stream(request.message):
                yield f"data: {json.dumps({'token': token})}\n\n"

            yield "data: [DONE]\n\n"

        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={"Cache-Control": "no-cache", "Connection": "keep-alive"},
        )
        
    @router.post("/upload")
    def upload(file: UploadFile = File(...)):

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".pdf",
        ) as temp:

            shutil.copyfileobj(file.file, temp)

            path = temp.name

        chunks = bot.add_pdf(path)

        return {
            "success": True,
            "chunks": chunks,
        }

    router.include_router(knowledge_router)

    return router
