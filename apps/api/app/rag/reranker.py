from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache

from app.core.config import get_settings
from app.rag.retrieval import RetrievedChunk

try:
    import torch
except Exception:  # pragma: no cover - optional dependency fallback
    torch = None  # type: ignore[assignment]

try:
    from sentence_transformers import CrossEncoder
except Exception:  # pragma: no cover - optional dependency fallback
    CrossEncoder = None  # type: ignore[assignment]


@dataclass(frozen=True)
class RankedChunk:
    chunk: RetrievedChunk
    rerank_score: float


@lru_cache(maxsize=1)
def get_reranker() -> CrossEncoder:
    settings = get_settings()
    if CrossEncoder is None:
        return None  # type: ignore[return-value]
    return CrossEncoder(settings.reranker_model_name, max_length=512)


def rerank_chunks(query: str, chunks: list[RetrievedChunk]) -> list[RankedChunk]:
    if not chunks:
        return []

    reranker = get_reranker()
    if reranker is None:
        return [
            RankedChunk(chunk=chunk, rerank_score=float(len(set(query.lower().split()) & set(chunk.text.lower().split()))))
            for chunk in chunks
        ]

    pairs = [(query, chunk.text) for chunk in chunks]
    scores = reranker.predict(pairs)
    if torch is not None and isinstance(scores, torch.Tensor):
        scores = scores.tolist()

    ranked = [RankedChunk(chunk=chunk, rerank_score=float(score)) for chunk, score in zip(chunks, scores)]
    return sorted(ranked, key=lambda item: item.rerank_score, reverse=True)
