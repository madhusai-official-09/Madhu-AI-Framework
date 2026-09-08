from pydantic import BaseModel


class ChatRequest(BaseModel):
    message: str
    project_id: str


class ChatResponse(BaseModel):
    reply: str
    
class PublicChatRequest(BaseModel):
    message: str
    project_id: str