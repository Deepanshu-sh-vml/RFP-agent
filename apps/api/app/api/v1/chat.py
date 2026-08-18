from __future__ import annotations

from pydantic import BaseModel

from app.agents.graph import run_chat_graph
from app.agents.state import ChatState


class ChatRequest(BaseModel):
    thread_id: str | None = None
    message: str


class ChatResponse(BaseModel):
    route: str
    answer: str


def handle_chat(request: ChatRequest) -> ChatResponse:
    state: ChatState = {
        "thread_id": request.thread_id or "",
        "user_message": request.message,
    }
    result = run_chat_graph(state)
    return ChatResponse(route=result.get("route", "rag"), answer=result.get("final_answer", ""))
