import asyncio
from datetime import datetime, timedelta
from sqlalchemy import select
from app.database import engine, Base, async_session_maker
from app.models.station import Station
from app.models.user import User
from app.models.transaction import Transaction
from app.models.payment import Payment
from app.models.rfid_card import RFIDCard

# Station list matching frontend mock data structure
stations_data = [
    {
        "id": 1,
        "station_name": "Mangaluru Port Ultra-Fast Hub",
        "latitude": 12.9141,
        "longitude": 74.8560,
        "price_per_kwh": 18.0,
        "status": "available"
    },
    {
        "id": 2,
        "station_name": "Udupi Temple Charger Hub",
        "latitude": 13.3409,
        "longitude": 74.7421,
        "price_per_kwh": 12.5,
        "status": "offline"
    },
    {
        "id": 3,
        "station_name": "NMAM Institute of Technology (Nitte)",
        "latitude": 13.1857,
        "longitude": 74.9348,
        "price_per_kwh": 15.0,
        "status": "available"
    },
    {
        "id": 4,
        "station_name": "Surathkal Beach Charging Hub",
        "latitude": 13.0108,
        "longitude": 74.7943,
        "price_per_kwh": 14.0,
        "status": "available"
    },
    {
        "id": 5,
        "station_name": "Manipal Campus Power Hub",
        "latitude": 13.3516,
        "longitude": 74.7872,
        "price_per_kwh": 16.5,
        "status": "charging"
    },
    {
        "id": 6,
        "station_name": "Kundapura National Highway Station",
        "latitude": 13.6268,
        "longitude": 74.6934,
        "price_per_kwh": 13.0,
        "status": "available"
    },
    {
        "id": 7,
        "station_name": "Karkala Town Charging Point",
        "latitude": 13.2172,
        "longitude": 74.9961,
        "price_per_kwh": 15.0,
        "status": "available"
    }
]

async def seed():
    # Ensure all tables are created first
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created/verified.")

    async with async_session_maker() as session:
        # Check if stations exist
        existing_stations = (await session.execute(select(Station))).scalars().all()
        if not existing_stations:
            print("Seeding stations...")
            for s in stations_data:
                db_station = Station(
                    id=s["id"],
                    station_name=s["station_name"],
                    latitude=s["latitude"],
                    longitude=s["longitude"],
                    price_per_kwh=s["price_per_kwh"],
                    status=s["status"]
                )
                session.add(db_station)
            await session.commit()
            print("Stations seeded successfully.")
        else:
            print("Stations already exist. Skipping station seeding.")

        # Get existing users
        users = (await session.execute(select(User))).scalars().all()
        if not users:
            print("No users found. Please register a user first through the frontend UI.")
            return

        user_ids = [u.id for u in users]
        
        # Check if transactions exist
        existing_tx = (await session.execute(select(Transaction))).scalars().all()
        if not existing_tx:
            print("Seeding transaction logs...")
            # Let's seed transactions spread over the last 7 days
            now = datetime.utcnow()
            for idx, user_id in enumerate(user_ids):
                # Ensure each user gets some transaction history
                for day in range(1, 8):
                    start = now - timedelta(days=day, hours=idx * 2)
                    end = start + timedelta(minutes=45)
                    energy = 15.5 + (day * 2) + (idx * 1.5)
                    amount = energy * 15.0  # Assumed mid price
                    
                    tx = Transaction(
                        user_id=user_id,
                        station_id=(day % 7) + 1,
                        start_time=start,
                        end_time=end,
                        energy_used=energy,
                        amount=amount,
                        payment_status="Paid"
                    )
                    session.add(tx)
            await session.commit()
            print("Transactions seeded successfully.")
        else:
            print("Transactions already exist. Skipping transaction seeding.")

if __name__ == "__main__":
    asyncio.run(seed())
