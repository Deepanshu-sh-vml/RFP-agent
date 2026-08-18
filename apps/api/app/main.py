from fastapi import FastAPI

from app.core.config import get_settings
from app.core.logging import configure_logging
from app.db.models import Feedback, IngestionRecord, Message, ResourceSource, Thread  # noqa: F401
from app.db.session import Base
from app.api.v1.chat import ChatRequest, handle_chat

configure_logging()
settings = get_settings()

app = FastAPI(title=settings.app_name)


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post(f"{settings.api_v1_prefix}/chat")
def chat(request: ChatRequest):
    return handle_chat(request)
