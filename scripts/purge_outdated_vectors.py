from __future__ import annotations

from sqlalchemy import select

from app.db.models import IngestionRecord
from app.db.session import SessionLocal
from app.rag.qdrant_client import delete_by_source_url, get_client


COLLECTION_NAME = "knowledge_base"


def purge_outdated_vectors(source_url: str) -> None:
    client = get_client()
    delete_by_source_url(client, COLLECTION_NAME, source_url)


def list_latest_sources() -> list[str]:
    db = SessionLocal()
    try:
        rows = db.execute(select(IngestionRecord.source_url).distinct()).all()
        return [row[0] for row in rows]
    finally:
        db.close()


def main() -> None:
    for source_url in list_latest_sources():
        purge_outdated_vectors(source_url)
        print(f"Purged vectors for {source_url}")


if __name__ == "__main__":
    main()
