from __future__ import annotations

from app.agents.nodes.reasoning import build_answer
from app.agents.nodes.router import route_message
from app.agents.nodes.signpost import build_signpost
from app.agents.state import ChatState


def run_chat_graph(state: ChatState) -> ChatState:
    route = route_message(state.get("user_message", ""))
    state["route"] = route
    if route == "signpost":
        return build_signpost(state)
    return build_answer(state)
