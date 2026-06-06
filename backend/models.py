from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime


class Bot(Base):
    __tablename__ = "bots"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)
    purpose = Column(Text)
    personality = Column(Text)
    system_prompt = Column(Text)
    model = Column(String, default="llama3.2")
    avatar_emoji = Column(String, default="🤖")
    avatar_img = Column(Text, nullable=True)      # base64 string
    has_files = Column(Boolean, default=False)
    file_names = Column(Text, nullable=True)       # JSON list stored as string
    created_at = Column(DateTime, default=datetime.utcnow)

    chats = relationship("Chat", back_populates="bot", cascade="all, delete-orphan")


class Chat(Base):
    __tablename__ = "chats"

    id = Column(Integer, primary_key=True, index=True)
    bot_id = Column(Integer, ForeignKey("bots.id"))
    title = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)

    bot = relationship("Bot", back_populates="chats")
    messages = relationship("Message", back_populates="chat", cascade="all, delete-orphan")


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, index=True)
    chat_id = Column(Integer, ForeignKey("chats.id"))
    role = Column(String)
    content = Column(Text)
    timestamp = Column(DateTime, default=datetime.utcnow)

    chat = relationship("Chat", back_populates="messages")
