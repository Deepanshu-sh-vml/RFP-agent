from __future__ import annotations


def route_message(message: str) -> str:
    lowered = message.lower()
    if any(term in lowered for term in ["legal", "policy", "golden rule"]):
        return "signpost"
    if any(term in lowered for term in ["template", "where is", "find", "video", "clip"]):
        return "rag"
    return "rag"
