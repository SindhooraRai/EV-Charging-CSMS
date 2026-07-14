from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.config import settings

# Create database engine
# We use settings.DATABASE_URL which derives postgresql+asyncpg connection
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,  # Set to True if we want SQL statement logging
    future=True,
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True
)

# Create session generator
async_session_maker = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False
)

# Declarative Base
class Base(DeclarativeBase):
    pass

# FastAPI Dependency for db session
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    Dependency generator for obtaining an async database session.
    Yields AsyncSession and automatically closes it when finished.
    """
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()
