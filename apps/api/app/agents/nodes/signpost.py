from __future__ import annotations

from app.agents.state import ChatState


def build_signpost(state: ChatState) -> ChatState:
    state["retrieved_chunks"] = []
    state["final_answer"] = (
        "This question is outside the grounded work-winning knowledge base. "
        "Please contact the relevant internal owner or legal reviewer."
    )
    return state
