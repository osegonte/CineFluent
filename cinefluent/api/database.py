"""
Database connection and session management for FastAPI
"""

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator
import redis.asyncio as redis
from contextlib import asynccontextmanager

from cinefluent.database_models import Base
from .config import get_settings

settings = get_settings()

# Create database engine
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,  # Verify connections before use
    pool_recycle=3600,   # Recycle connections every hour
    echo=settings.debug  # Log SQL queries in debug mode
)

# Create session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Redis connection pool
redis_pool = None


async def init_redis():
    """Initialize Redis connection pool"""
    global redis_pool
    redis_pool = redis.ConnectionPool.from_url(
        settings.redis_url,
        max_connections=20,
        retry_on_timeout=True
    )


async def get_redis() -> redis.Redis:
    """Get Redis connection"""
    return redis.Redis(connection_pool=redis_pool)


def get_db() -> Generator[Session, None, None]:
    """
    Dependency to get database session
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def create_tables():
    """Create all database tables"""
    Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def get_db_async():
    """Async context manager for database sessions"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Database utilities
class DatabaseService:
    """Database service utilities"""
    
    @staticmethod
    def health_check() -> dict:
        """Check database connectivity"""
        try:
            with SessionLocal() as db:
                result = db.execute(text("SELECT 1"))
                result.fetchone()  # Actually fetch the result
                return {"status": "healthy", "database": "connected"}
        except Exception as e:
            return {"status": "unhealthy", "database": "disconnected", "error": str(e)}
    
    @staticmethod
    async def redis_health_check() -> dict:
        """Check Redis connectivity"""
        try:
            redis_client = await get_redis()
            await redis_client.ping()
            await redis_client.close()
            return {"status": "healthy", "redis": "connected"}
        except Exception as e:
            return {"status": "unhealthy", "redis": "disconnected", "error": str(e)}