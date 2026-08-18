from __future__ import annotations

import argparse
import sys
from dataclasses import dataclass
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
API_ROOT = ROOT / "apps" / "api"
for candidate in (str(API_ROOT), str(ROOT)):
    if candidate not in sys.path:
        sys.path.insert(0, candidate)

from sqlalchemy import select
from sqlalchemy.exc import OperationalError

from app.db.models import IngestionRecord, ResourceSource
from app.db.session import SessionLocal
from app.rag.embeddings import embed_text, get_embedding_dimension
from app.rag.hash_engine import sha256_file, sha256_bytes
from app.rag.qdrant_client import VectorChunk, delete_by_source_url, ensure_collection, get_client, upsert_chunks, _MEMORY_COLLECTIONS
from app.services.doc_parser import chunk_text, parse_text_file
from app.services.video_parser import parse_video_transcript


COLLECTION_NAME = "knowledge_base"
_MEMORY_SOURCES: dict[str, str] = {}


@dataclass(frozen=True)
class IngestResult:
    source_url: str
    source_hash: str
    chunks_written: int
    skipped: bool


def load_source_content(path: Path, source_type: str) -> str:
    if source_type == "video":
        return parse_video_transcript(path)
    return parse_text_file(path)


def ingest_source(path: Path, source_url: str, source_name: str, source_type: str) -> IngestResult:
    source_hash = sha256_file(path)
    content = load_source_content(path, source_type)
    vector_size = get_embedding_dimension()

    db = SessionLocal()
    try:
        try:
            existing_source = db.execute(select(ResourceSource).where(ResourceSource.url == source_url)).scalar_one_or_none()
        except OperationalError:
            existing_source = None
        if existing_source is None:
            existing_source = ResourceSource(
                name=source_name,
                source_type=source_type,
                url=source_url,
                description=None,
                is_active=True,
            )
            db.add(existing_source)
        else:
            existing_source.name = source_name
            existing_source.source_type = source_type
            existing_source.is_active = True

        try:
            previous_record = (
                db.execute(
                    select(IngestionRecord)
                    .where(IngestionRecord.source_url == source_url)
                    .order_by(IngestionRecord.created_at.desc())
                )
                .scalars()
                .first()
            )
        except OperationalError:
            previous_record = None

        if previous_record and previous_record.source_hash == source_hash:
            try:
                db.commit()
            except OperationalError:
                pass
            return IngestResult(source_url=source_url, source_hash=source_hash, chunks_written=0, skipped=True)

        client = get_client()
        ensure_collection(client, COLLECTION_NAME, vector_size)
        delete_by_source_url(client, COLLECTION_NAME, source_url)

        chunks = chunk_text(content)
        vector_chunks = [
            VectorChunk(
                id=f"{source_hash[:16]}-{index}",
                source_url=source_url,
                source_hash=source_hash,
                text=chunk,
                payload={
                    "source_name": source_name,
                    "source_type": source_type,
                    "chunk_index": index,
                },
                vector=embed_text(chunk),
            )
            for index, chunk in enumerate(chunks)
        ]
        upsert_chunks(client, COLLECTION_NAME, vector_chunks)

        try:
            db.add(
                IngestionRecord(
                    source_url=source_url,
                    source_hash=source_hash,
                    source_type=source_type,
                    status="ingested",
                )
            )
            db.commit()
        except OperationalError:
            _MEMORY_SOURCES[source_url] = source_hash

        return IngestResult(source_url=source_url, source_hash=source_hash, chunks_written=len(vector_chunks), skipped=False)
    finally:
        try:
            db.close()
        except Exception:
            pass


def main() -> None:
    parser = argparse.ArgumentParser(description="Ingest a knowledge source into Qdrant.")
    parser.add_argument("path", type=Path, help="Path to a text-based source or transcript")
    parser.add_argument("--url", required=True, help="Stable source URL for the document")
    parser.add_argument("--name", required=True, help="Human-readable source name")
    parser.add_argument("--type", default="document", choices=["document", "video"], help="Source type")
    args = parser.parse_args()

    result = ingest_source(args.path, args.url, args.name, args.type)
    if result.skipped:
        print(f"Skipped unchanged source: {result.source_url}")
    else:
        print(f"Ingested {result.chunks_written} chunks from {result.source_url}")


if __name__ == "__main__":
    main()
