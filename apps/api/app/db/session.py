from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.core.config import get_settings

settings = get_settings()

try:
    engine = create_engine(settings.database_url, pool_pre_ping=True)
    with engine.connect():
        pass
except Exception:
    engine = create_engine("sqlite:///./winbid_ai સ્થાનિક.db".replace(" ", ""), connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
