from fastapi import FastAPI
from sqlalchemy import text

from app.database import engine

from app.routers import (
    auth,
    users,
    stations,
    transactions,
    payments,
)

app = FastAPI()


app.include_router(auth.router)
app.include_router(users.router)
app.include_router(stations.router)
app.include_router(transactions.router)
app.include_router(payments.router)


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