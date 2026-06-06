import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from models import Bot, Chat, Message
from schemas import BotCreate, BotUpdate

router = APIRouter()


@router.post("/create-bot")
def create_bot(bot: BotCreate, db: Session = Depends(get_db)):
    existing = db.query(Bot).filter(Bot.name == bot.name).first()
    if existing:
        return {"error": "Bot name already exists"}

    system_prompt = f"""You are {bot.name}.\n\nPurpose:\n{bot.purpose}\n\nPersonality:\n{bot.personality}"""

    new_bot = Bot(
        name=bot.name,
        purpose=bot.purpose,
        personality=bot.personality,
        system_prompt=system_prompt,
        model=bot.model,
        avatar_emoji=bot.avatar_emoji or "🤖",
        avatar_img=bot.avatar_img,
        has_files=bot.has_files or False,
        file_names=json.dumps(bot.file_names or []),
    )
    db.add(new_bot)
    db.commit()
    db.refresh(new_bot)
    return {"message": "Bot created successfully", "bot_id": new_bot.id, "bot_name": new_bot.name}


@router.get("/bots")
def get_all_bots(db: Session = Depends(get_db)):
    bots = db.query(Bot).all()
    result = []
    for b in bots:
        result.append({
            "id": b.id, "name": b.name, "purpose": b.purpose,
            "personality": b.personality, "system_prompt": b.system_prompt,
            "model": b.model, "avatar_emoji": b.avatar_emoji, "avatar_img": b.avatar_img,
            "has_files": b.has_files,
            "file_names": json.loads(b.file_names) if b.file_names else [],
            "created_at": b.created_at.isoformat() if b.created_at else None,
        })
    return result


@router.put("/bots/{bot_id}")
def update_bot(bot_id: int, update: BotUpdate, db: Session = Depends(get_db)):
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if not bot:
        return {"error": "Bot not found"}
    if update.name is not None: bot.name = update.name
    if update.purpose is not None: bot.purpose = update.purpose
    if update.personality is not None:
        bot.personality = update.personality
        bot.system_prompt = f"You are {bot.name}.\n\nPurpose:\n{bot.purpose}\n\nPersonality:\n{bot.personality}"
    if update.model is not None: bot.model = update.model
    if update.avatar_emoji is not None: bot.avatar_emoji = update.avatar_emoji
    if update.avatar_img is not None: bot.avatar_img = update.avatar_img
    db.commit()
    db.refresh(bot)
    return {"message": "Bot updated", "bot_id": bot.id}


@router.delete("/bots/{bot_id}")
def delete_bot(bot_id: int, db: Session = Depends(get_db)):
    bot = db.query(Bot).filter(Bot.id == bot_id).first()
    if not bot:
        return {"error": "Bot not found"}
    db.delete(bot)
    db.commit()
    return {"message": "Bot deleted"}


@router.delete("/bots")
def delete_all_bots(db: Session = Depends(get_db)):
    db.query(Bot).delete()
    db.commit()
    return {"message": "All bots deleted"}


@router.get("/bots/{bot_id}/chats")
def get_bot_chats(bot_id: int, db: Session = Depends(get_db)):
    chats = db.query(Chat).filter(Chat.bot_id == bot_id).all()
    return [{"id": c.id, "title": c.title, "created_at": c.created_at.isoformat()} for c in chats]


@router.delete("/bots/{bot_id}/chats")
def delete_bot_chats(bot_id: int, db: Session = Depends(get_db)):
    chats = db.query(Chat).filter(Chat.bot_id == bot_id).all()
    for chat in chats:
        db.query(Message).filter(Message.chat_id == chat.id).delete()
        db.delete(chat)
    db.commit()
    return {"message": "All chats deleted"}
