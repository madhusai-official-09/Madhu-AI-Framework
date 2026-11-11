from pydantic import BaseModel

from .history import Message


class ChatRequest(BaseModel):
    message: str
    project_id: str


class ChatResponse(BaseModel):
    reply: str


class PublicChatRequest(BaseModel):
    message: str
    project_id: str
    history: list[Message] = []