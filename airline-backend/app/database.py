import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import NullPool
from app.core.settings import settings

logger = logging.getLogger(__name__)

# 1. Standardize the URL prefix for SQLAlchemy
# Render often provides 'postgres://', but SQLAlchemy 1.4+ requires 'postgresql://'
DB_URL = settings.DATABASE_URL.replace("postgres://", "postgresql://")

# 2. Safety Check: Remove '?pgbouncer=true' if it exists in the string
# psycopg2 (the driver) will throw a 'ProgrammingError' if this parameter is present
DB_URL = DB_URL.split("?")[0]

logger.info(f"Connecting to database: {DB_URL.split('@')[-1]}...")

# 3. Create the Engine with NullPool
# pool_pre_ping is less critical when using NullPool, but echo=False keeps logs clean.
engine = create_engine(
    DB_URL, 
    poolclass=NullPool, 
    echo=False
)

# 4. Standard Session and Base setup
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    """
    Dependency to provide a database session for FastAPI/Flask routes.
    Ensures the connection is closed after the request is finished.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
