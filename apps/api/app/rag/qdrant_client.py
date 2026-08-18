from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from app.core.config import get_settings

try:
    from qdrant_client import QdrantClient
    from qdrant_client.http import models as rest
except Exception:  # pragma: no cover - optional dependency fallback
    QdrantClient = None  # type: ignore[assignment]
    rest = None  # type: ignore[assignment]

settings = get_settings()

_MEMORY_COLLECTIONS: dict[str, list[VectorChunk]] = {}


@dataclass(frozen=True)
class VectorChunk:
    id: str
    source_url: str
    source_hash: str
    text: str
    payload: dict[str, Any]
    vector: list[float]


def get_client() -> QdrantClient:
    if QdrantClient is None:
        return None  # type: ignore[return-value]
    try:
        client = QdrantClient(host=settings.qdrant_host, port=settings.qdrant_port)
        client.get_collections()
        return client
    except Exception:
        return None  # type: ignore[return-value]


def ensure_collection(client: QdrantClient, collection_name: str, vector_size: int) -> None:
    if client is None:
        _MEMORY_COLLECTIONS.setdefault(collection_name, [])
        return
    try:
        existing = {collection.name for collection in client.get_collections().collections}
        if collection_name in existing:
            return

        client.create_collection(
            collection_name=collection_name,
            vectors_config=rest.VectorParams(size=vector_size, distance=rest.Distance.COSINE),
        )
    except Exception:
        _MEMORY_COLLECTIONS.setdefault(collection_name, [])


def upsert_chunks(client: QdrantClient, collection_name: str, chunks: list[VectorChunk]) -> None:
    if not chunks:
        return
    if client is None:
        bucket = _MEMORY_COLLECTIONS.setdefault(collection_name, [])
        bucket.extend(chunks)
        return
    try:
        points = [
            rest.PointStruct(
                id=chunk.id,
                vector=chunk.vector,
                payload={
                    "source_url": chunk.source_url,
                    "source_hash": chunk.source_hash,
                    "text": chunk.text,
                    **chunk.payload,
                },
            )
            for chunk in chunks
        ]
        client.upsert(collection_name=collection_name, points=points)
    except Exception:
        bucket = _MEMORY_COLLECTIONS.setdefault(collection_name, [])
        bucket.extend(chunks)


def delete_by_source_url(client: QdrantClient, collection_name: str, source_url: str) -> None:
    if client is None:
        bucket = _MEMORY_COLLECTIONS.get(collection_name, [])
        _MEMORY_COLLECTIONS[collection_name] = [chunk for chunk in bucket if chunk.source_url != source_url]
        return
    try:
        client.delete(
            collection_name=collection_name,
            points_selector=rest.FilterSelector(
                filter=rest.Filter(
                    must=[rest.FieldCondition(key="source_url", match=rest.MatchValue(value=source_url))]
                )
            ),
        )
    except Exception:
        bucket = _MEMORY_COLLECTIONS.get(collection_name, [])
        _MEMORY_COLLECTIONS[collection_name] = [chunk for chunk in bucket if chunk.source_url != source_url]


def search_chunks(client: QdrantClient | None, collection_name: str, vector: list[float], limit: int) -> list[dict[str, Any]]:
    if client is None:
        return [
            {
                "payload": {
                    "source_url": chunk.source_url,
                    "source_hash": chunk.source_hash,
                    "text": chunk.text,
                    **chunk.payload,
                },
                "score": 1.0,
            }
            for chunk in _MEMORY_COLLECTIONS.get(collection_name, [])[:limit]
        ]

    if hasattr(client, "search"):
        result = client.search(collection_name=collection_name, query_vector=vector, limit=limit, with_payload=True)
        return [{"payload": point.payload or {}, "score": point.score} for point in result]

    result = client.query_points(
        collection_name=collection_name,
        query=vector,
        limit=limit,
        with_payload=True,
    )
    points = getattr(result, "points", result)
    return [{"payload": point.payload or {}, "score": getattr(point, "score", None)} for point in points]
