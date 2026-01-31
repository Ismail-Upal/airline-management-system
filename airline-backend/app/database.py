import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.settings import settings

logger = logging.getLogger(__name__)

# Render uses "postgres://" but SQLAlchemy needs "postgresql://"
DB_URL = settings.DATABASE_URL.replace("postgres://", "postgresql://")

logger.info(f"Connecting to database: {DB_URL[:50]}...")

engine = create_engine(DB_URL, pool_pre_ping=True, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
