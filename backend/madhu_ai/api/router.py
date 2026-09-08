import json
import shutil
import tempfile

from pathlib import Path
from fastapi import APIRouter, Depends,File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from .auth import get_current_user
from ..core.logger import logger
from ..schemas.chat import ChatRequest, ChatResponse, PublicChatRequest
from ..schemas.history import Message
from .knowledge import router as knowledge_router
from ..memory.projects import ProjectStore
from ..schemas.project import ProjectCreate, ProjectResponse


def create_router(bot):
    router = APIRouter()
    project_store = ProjectStore()
    @router.get("/health")
    def health():
        return {
            "status": "healthy",
            "service": "MadhuAI",
            "provider": bot.config.provider,
        }

    @router.get("/history", response_model=list[Message])
    def history(current_user=Depends(get_current_user)):
        user_id = current_user["uid"]
        
        bot.memory.load_user(user_id)
        
        return bot.memory.get_messages()

    @router.post("/chat", response_model=ChatResponse)
    def chat(request: ChatRequest,
             current_user=Depends(get_current_user),
             ):
        try:
            user_id = current_user["uid"]
            project_id = request.project_id
            
            reply = bot.chat(request.message,user_id, project_id,)
            return ChatResponse(reply=reply)

        except Exception as e:
            logger.exception(e)
            raise HTTPException(status_code=500, detail="Chat failed")
        
    @router.post("/public/chat", response_model=ChatResponse)
    def public_chat(request: PublicChatRequest):
        try:
            reply = bot.chat(
                request.message,
                "public",
                request.project_id,
            )
            return ChatResponse(reply=reply)

        except Exception as e:
            logger.exception(e)
            raise HTTPException(status_code=500, detail="Chat failed")

    @router.post("/chat/stream")
    def chat_stream(request: ChatRequest,
                    current_user=Depends(get_current_user),):

        def generate():
            try:
                user_id = current_user["uid"]
                project_id = request.project_id
                
                for token in bot.stream(request.message,user_id, project_id,):
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
        
    @router.post("/projects", response_model=ProjectResponse)
    def create_project(
        request: ProjectCreate,
        current_user=Depends(get_current_user),
    ):
        try:
            project = project_store.create(
                current_user["uid"],
                request.name,
            )

            return ProjectResponse(**project)

        except Exception as e:
            logger.exception(e)
            raise HTTPException(
                status_code=500,
                detail="Project creation failed",
            )
            
    @router.get("/projects", response_model=list[ProjectResponse])
    def get_projects(
        current_user=Depends(get_current_user),
    ):
        try:
            projects = project_store.list_for_user(
                current_user["uid"]
            )

            return [
                ProjectResponse(**project)
                for project in projects
            ]

        except Exception as e:
            logger.exception(e)
            raise HTTPException(
                status_code=500,
                detail="Failed to load projects",
            )

    @router.post("/upload")
    def upload(
        project_id: str,
        file: UploadFile = File(...),
        current_user=Depends(get_current_user),
    ):
        try:
            user_id = current_user["uid"]

            if not project_store.belongs_to_user(
                project_id,
                user_id,
            ):
                raise HTTPException(
                    status_code=403,
                    detail="Project not found or access denied",
                )

            with tempfile.NamedTemporaryFile(
                delete=False,
                suffix=".pdf",
            ) as temp:
                shutil.copyfileobj(file.file, temp)
                temp_path = temp.name

            chunks = bot.add_pdf(
                temp_path,
                project_id,
                {
                    "filename": file.filename or "unknown",
                    "size": Path(temp_path).stat().st_size,
                    "status": "indexed",
                },
            )

            return {
                "success": True,
                "chunks": chunks,
            }

        except HTTPException:
            raise

        except Exception as e:
            logger.exception(e)
            raise HTTPException(
                status_code=500,
                detail="Upload failed",
            )

    router.include_router(knowledge_router)

    return router