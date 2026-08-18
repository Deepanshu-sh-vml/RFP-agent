from __future__ import annotations

from functools import lru_cache

from app.core.config import get_settings

try:
    from sentence_transformers import SentenceTransformer
except Exception:  # pragma: no cover - optional dependency fallback
    SentenceTransformer = None


@lru_cache(maxsize=1)
def get_embedding_model() -> SentenceTransformer:
    settings = get_settings()
    if SentenceTransformer is None:
        return None  # type: ignore[return-value]
    return SentenceTransformer(settings.embedding_model_name)


def get_embedding_dimension() -> int:
    model = get_embedding_model()
    if model is None:
        return 64
    return int(model.get_sentence_embedding_dimension())


def _fallback_embed(text: str, dimensions: int = 64) -> list[float]:
    import hashlib

    digest = hashlib.sha256(text.encode("utf-8")).digest()
    values: list[float] = []
    for index in range(dimensions):
        byte = digest[index % len(digest)]
        values.append((byte / 255.0) * 2.0 - 1.0)
    return values


def embed_text(text: str) -> list[float]:
    model = get_embedding_model()
    if model is None:
        return _fallback_embed(text, get_embedding_dimension())
    vector = model.encode(text, normalize_embeddings=True)
    return vector.tolist() if hasattr(vector, "tolist") else list(vector)


def embed_texts(texts: list[str]) -> list[list[float]]:
    model = get_embedding_model()
    if model is None:
        dimension = get_embedding_dimension()
        return [_fallback_embed(text, dimension) for text in texts]
    vectors = model.encode(texts, normalize_embeddings=True)
    return [vector.tolist() if hasattr(vector, "tolist") else list(vector) for vector in vectors]
