from __future__ import annotations

from app.agents.state import ChatState
from app.rag.reranker import rerank_chunks
from app.rag.retrieval import search_chunks


def build_answer(state: ChatState) -> ChatState:
    question = state.get("user_message", "")
    chunks = search_chunks(question)
    ranked = rerank_chunks(question, chunks)
    selected = [item.chunk for item in ranked[:4]]

    if not selected:
        state["retrieved_chunks"] = []
        state["final_answer"] = "I could not find a grounded internal source for that question."
        return state

    state["retrieved_chunks"] = selected
    bullet_sources = "\n".join(
        f"- {chunk.source_name or chunk.source_url}: {chunk.text[:240]}" for chunk in selected
    )
    state["final_answer"] = (
        "Here is the best grounded answer I can provide from internal sources:\n\n"
        f"{bullet_sources}"
    )
    return state
