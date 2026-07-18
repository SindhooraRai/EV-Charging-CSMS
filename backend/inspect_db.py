import asyncio
from sqlalchemy import select
from app.database import engine, Base, async_session_maker
# Import models to ensure they are registered on Base.metadata
from app.models.user import User
from app.models.station import Station
from app.models.transaction import Transaction
from app.models.payment import Payment

async def main():
    # Sync and create tables if missing
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        print("Database tables verified.")

    async with async_session_maker() as session:
        stations = (await session.execute(select(Station))).scalars().all()
        users = (await session.execute(select(User))).scalars().all()
        transactions = (await session.execute(select(Transaction))).scalars().all()
        print(f"STATIONS_COUNT: {len(stations)}")
        print(f"USERS_COUNT: {len(users)}")
        print(f"TRANSACTIONS_COUNT: {len(transactions)}")
        
        print("\n--- STATIONS ---")
        for s in stations:
            print(f"Station {s.id}: {s.station_name} | Lat: {s.latitude} | Lng: {s.longitude} | Status: {s.status}")
            
        print("\n--- USERS ---")
        for u in users:
            print(f"User {u.id}: {u.name} | Role: {u.role} | Email: {u.email}")
            
        print("\n--- TRANSACTIONS ---")
        for t in transactions:
            print(f"Tx {t.id}: User: {t.user_id} | Station: {t.station_id} | Energy: {t.energy_used} kWh | Amt: {t.amount} | Status: {t.payment_status} | End: {t.end_time}")

if __name__ == "__main__":
    asyncio.run(main())
