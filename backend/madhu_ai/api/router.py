import json
import shutil
import tempfile

from fastapi import APIRouter, Depends,File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from .auth import get_current_user
from ..core.logger import logger
from ..schemas.chat import ChatRequest, ChatResponse
from ..schemas.history import Message
from .knowledge import router as knowledge_router


def create_router(bot):
    router = APIRouter()

    @router.get("/health")
    def health():
        return {
            "status": "healthy",
            "service": "MadhuAI",
            "provider": bot.config.provider,
        }

    @router.get("/history", response_model=list[Message])
    def history(current_user=Depends(get_current_user)):
        return bot.memory.get_messages()

    @router.post("/chat", response_model=ChatResponse)
    def chat(request: ChatRequest,
             current_user=Depends(get_current_user),
             ):
        try:
            reply = bot.chat(request.message)
            return ChatResponse(reply=reply)

        except Exception as e:
            logger.exception(e)
            raise HTTPException(status_code=500, detail="Chat failed")

    @router.post("/chat/stream")
    def chat_stream(request: ChatRequest,
                    current_user=Depends(get_current_user),):

        def generate():
            try:
                for token in bot.stream(request.message):
                    yield f"data: {json.dumps({'token': token})}\n\n"

                yield "data: [DONE]\n\n"

            except Exception as e:
                logger.exception(e)
                yield f"data: {json.dumps({'error':'Streaming failed'})}\n\n"

        return StreamingResponse(
            generate(),
            media_type="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
            },
        )

    @router.post("/upload")
    def upload(file: UploadFile = File(...),
               current_user=Depends(get_current_user),):
        try:
            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=".pdf",
            ) as temp:

                shutil.copyfileobj(file.file, temp)
                temp_path = temp.name

            chunks = bot.add_pdf(temp_path)

            return {
                "success": True,
                "chunks": chunks,
            }

        except Exception as e:
            logger.exception(e)
            raise HTTPException(status_code=500, detail="Upload failed")

    router.include_router(knowledge_router)

    return router