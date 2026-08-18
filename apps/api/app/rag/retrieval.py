from __future__ import annotations

from dataclasses import dataclass

from app.core.config import get_settings
from app.rag.embeddings import embed_text
from app.rag.qdrant_client import get_client, search_chunks as qdrant_search_chunks

settings = get_settings()


@dataclass(frozen=True)
class RetrievedChunk:
    source_url: str
    source_hash: str
    text: str
    source_name: str | None = None
    source_type: str | None = None
    score: float | None = None


def search_chunks(query: str, top_k: int | None = None, client: QdrantClient | None = None) -> list[RetrievedChunk]:
    qdrant = client or get_client()
    vector = embed_text(query)
    result = qdrant_search_chunks(qdrant, settings.qdrant_collection, vector, top_k or settings.top_k)

    chunks: list[RetrievedChunk] = []
    for point in result:
        payload = point["payload"] or {}
        chunks.append(
            RetrievedChunk(
                source_url=str(payload.get("source_url", "")),
                source_hash=str(payload.get("source_hash", "")),
                text=str(payload.get("text", "")),
                source_name=payload.get("source_name"),
                source_type=payload.get("source_type"),
                score=float(point["score"]) if point.get("score") is not None else None,
            )
        )
    return chunks
