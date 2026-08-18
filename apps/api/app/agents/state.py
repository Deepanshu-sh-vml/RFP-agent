from __future__ import annotations

from typing import TypedDict

from app.rag.retrieval import RetrievedChunk


class ChatState(TypedDict, total=False):
    thread_id: str
    user_message: str
    route: str
    retrieved_chunks: list[RetrievedChunk]
    final_answer: str
