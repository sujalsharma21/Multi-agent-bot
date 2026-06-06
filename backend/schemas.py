from pydantic import BaseModel
from typing import Optional, List


class BotCreate(BaseModel):
    name: str
    purpose: str
    personality: str
    model: str = "llama3.2"
    avatar_emoji: Optional[str] = "🤖"
    avatar_img: Optional[str] = None
    has_files: Optional[bool] = False
    file_names: Optional[List[str]] = []
    created_at: Optional[str] = None


class BotUpdate(BaseModel):
    name: Optional[str] = None
    purpose: Optional[str] = None
    personality: Optional[str] = None
    model: Optional[str] = None
    avatar_emoji: Optional[str] = None
    avatar_img: Optional[str] = None


class ChatRequest(BaseModel):
    chat_id: int
    message: str


class CreateChatRequest(BaseModel):
    bot_id: int
    title: str
