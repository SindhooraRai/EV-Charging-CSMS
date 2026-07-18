from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import settings
from app.database import engine, Base

# Import models so SQLAlchemy registers them
from app.models.user import User

# Import routers
from app.routers import (
    auth,
    users,
    stations,
    transactions,
    payments,
)
from app.routers.rfid import router as rfid_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        # Create database tables
        await conn.run_sync(Base.metadata.create_all)

        # Add RFID columns to users table if they don't exist
        for col_name, col_type in [
            ("rfid_uid", "VARCHAR(50) UNIQUE"),
            ("rfid_linked_since", "TIMESTAMP WITH TIME ZONE"),
            ("rfid_status", "VARCHAR(20) DEFAULT 'Active'")
        ]:
            try:
                await conn.execute(
                    text(f"ALTER TABLE users ADD COLUMN {col_name} {col_type}")
                )
            except Exception:
                # Ignore if column already exists
                pass

    yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(stations.router)
app.include_router(transactions.router)
app.include_router(payments.router)

app.include_router(
    rfid_router,
    prefix=settings.API_V1_STR
)


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