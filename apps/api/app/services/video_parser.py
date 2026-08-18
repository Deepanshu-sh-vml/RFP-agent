from __future__ import annotations

from pathlib import Path


def parse_video_transcript(path: str | Path) -> str:
    transcript_path = Path(path)
    if transcript_path.suffix.lower() in {".txt", ".md"}:
        return transcript_path.read_text(encoding="utf-8")
    raise ValueError("Video transcript extraction is expected to receive a text transcript for now.")
