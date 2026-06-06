from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Bot, Chat, Message
from schemas import ChatRequest, CreateChatRequest
from ollama_service import generate_response

router = APIRouter()

@router.post("/create-chat")
def create_chat(request: CreateChatRequest, db: Session = Depends(get_db)):
    bot = db.query(Bot).filter(Bot.id == request.bot_id).first()
    if not bot:
        return {"error": "Bot not found"}
    new_chat = Chat(bot_id=request.bot_id, title=request.title)
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return {"message": "Chat created", "chat_id": new_chat.id}

@router.post("/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    chat = db.query(Chat).filter(Chat.id == request.chat_id).first()
    if not chat:
        return {"error": "Chat not found"}
    bot = db.query(Bot).filter(Bot.id == chat.bot_id).first()

    user_message = Message(chat_id=chat.id, role="user", content=request.message)
    db.add(user_message)
    db.commit()

    reply = generate_response(model=bot.model, system_prompt=bot.system_prompt, user_message=request.message)

    ai_message = Message(chat_id=chat.id, role="assistant", content=reply)
    db.add(ai_message)
    db.commit()

    return {"bot": bot.name, "reply": reply}

@router.get("/chat/{chat_id}")
def get_chat_history(chat_id: int, db: Session = Depends(get_db)):
    messages = db.query(Message).filter(Message.chat_id == chat_id).all()
    return [{"id": m.id, "role": m.role, "content": m.content, "timestamp": m.timestamp.isoformat() if m.timestamp else None} for m in messages]

@router.get("/bots/{bot_id}/chats")
def get_bot_chats(bot_id: int, db: Session = Depends(get_db)):
    chats = db.query(Chat).filter(Chat.bot_id == bot_id).order_by(Chat.created_at.desc()).all()
    return [{"id": c.id, "title": c.title, "created_at": c.created_at.isoformat() if c.created_at else None} for c in chats]

@router.delete("/bots/{bot_id}/chats")
def delete_bot_chats(bot_id: int, db: Session = Depends(get_db)):
    chats = db.query(Chat).filter(Chat.bot_id == bot_id).all()
    for c in chats:
        db.query(Message).filter(Message.chat_id == c.id).delete()
        db.delete(c)
    db.commit()
    return {"message": "All chats deleted"}

@router.delete("/chats/{chat_id}")
def delete_single_chat(chat_id: int, db: Session = Depends(get_db)):
    chat = db.query(Chat).filter(Chat.id == chat_id).first()
    if not chat:
        return {"error": "Chat not found"}
    db.query(Message).filter(Message.chat_id == chat_id).delete()
    db.delete(chat)
    db.commit()
    return {"message": "Chat deleted"}
