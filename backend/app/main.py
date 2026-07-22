from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.config import settings
from app.database import engine, Base

# Import models so SQLAlchemy registers them
from app.models.user import User
from app.models.station import Station
from app.models.transaction import Transaction
from app.models.payment import Payment
from app.models.rfid_card import RFIDCard

# Import routers
from app.routers import (
    auth,
    users,
    stations,
    transactions,
    payments,
    websocket as ws_router,
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

        # Add new columns to stations table if they don't exist
        for col_name, col_type in [
            ("city", "VARCHAR(50)"),
            ("address", "VARCHAR(255)"),
            ("connectors", "JSON"),
            ("available_chargers", "INTEGER DEFAULT 0"),
            ("total_chargers", "INTEGER DEFAULT 0"),
            ("rating", "FLOAT DEFAULT 0.0"),
            ("last_updated", "VARCHAR(50) DEFAULT 'Just now'")
        ]:
            try:
                await conn.execute(
                    text(f"ALTER TABLE stations ADD COLUMN {col_name} {col_type}")
                )
            except Exception:
                # Ignore if column already exists
                pass

        # Add base price per kWh to stations if it doesn't exist
        try:
            await conn.execute(
                text("ALTER TABLE stations ADD COLUMN price_per_kwh FLOAT DEFAULT 15.0")
            )
        except Exception:
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
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(users.router, prefix=settings.API_V1_STR)
app.include_router(stations.router, prefix=settings.API_V1_STR)
app.include_router(transactions.router, prefix=settings.API_V1_STR)
app.include_router(payments.router, prefix=settings.API_V1_STR)
app.include_router(ws_router.router, prefix=settings.API_V1_STR)

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