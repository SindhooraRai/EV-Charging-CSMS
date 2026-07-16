from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.database import engine, Base
from app.config import settings
from routers.auth import router as auth_router
from models.user import User  # Import User to register with SQLAlchemy metadata

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Standard DB bootstrap checks
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield

app = FastAPI(title=settings.PROJECT_NAME, lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    return {"message": "EV Charging Backend Running"}


@app.get("/health")
async def health():
    try:
        async with engine.begin() as conn:
            await conn.execute(text("SELECT 1"))

        return {
            "status": "success",
            "database": "connected"
        }

    except Exception as e:
        return {
            "status": "failed",
            "error": str(e)
        }