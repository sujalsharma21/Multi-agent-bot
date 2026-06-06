from fastapi import FastAPI
from database import engine
from models import Base
from routes.bots import router as bot_router
from routes.chat import router as chat_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
Base.metadata.create_all(bind=engine)

app.include_router(bot_router)
app.include_router(chat_router)

@app.get("/")
def root():
    return {"message": "Backend Running"}