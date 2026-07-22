import asyncio
from datetime import datetime, timedelta
from sqlalchemy import select, text
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
        "status": "available",
        "city": "Mangaluru",
        "address": "Muzrai Temple Rd, Hampankatta, Mangaluru, Karnataka 575001",
        "connectors": [
            { "type": "CCS2 (DC Ultra)", "power": "240 kW", "count": 2 },
            { "type": "Type 2 (AC)", "power": "22 kW", "count": 4 }
        ],
        "available_chargers": 5,
        "total_chargers": 6,
        "rating": 4.9,
        "last_updated": "12 mins ago"
    },
    {
        "id": 2,
        "station_name": "Udupi Temple Charger Hub",
        "latitude": 13.3409,
        "longitude": 74.7421,
        "price_per_kwh": 12.5,
        "status": "offline",
        "city": "Udupi",
        "address": "Car Street, Beside Sri Krishna Temple, Udupi, Karnataka 576101",
        "connectors": [
            { "type": "Type 2 (AC)", "power": "7.4 kW", "count": 2 }
        ],
        "available_chargers": 0,
        "total_chargers": 2,
        "rating": 4.2,
        "last_updated": "Offline - System Maintenance"
    },
    {
        "id": 3,
        "station_name": "NMAM Institute of Technology (Nitte)",
        "latitude": 13.1857,
        "longitude": 74.9348,
        "price_per_kwh": 15.0,
        "status": "available",
        "city": "Nitte (Udupi Region)",
        "address": "Nitte, Karkala Taluk, Udupi District, Karnataka 574110",
        "connectors": [
            { "type": "CCS2 (DC Fast)", "power": "50 kW", "count": 2 },
            { "type": "Type 2 (AC)", "power": "22 kW", "count": 1 }
        ],
        "available_chargers": 2,
        "total_chargers": 3,
        "rating": 4.7,
        "last_updated": "10 mins ago"
    },
    {
        "id": 4,
        "station_name": "Surathkal Beach Charging Hub",
        "latitude": 13.0108,
        "longitude": 74.7943,
        "price_per_kwh": 14.0,
        "status": "available",
        "city": "Surathkal",
        "address": "Near NITK Beach, Surathkal, Karnataka 575025",
        "connectors": [
            { "type": "CCS2 (DC Fast)", "power": "120 kW", "count": 2 },
            { "type": "Type 2 (AC)", "power": "22 kW", "count": 2 }
        ],
        "available_chargers": 3,
        "total_chargers": 4,
        "rating": 4.8,
        "last_updated": "5 mins ago"
    },
    {
        "id": 5,
        "station_name": "Manipal Campus Power Hub",
        "latitude": 13.3516,
        "longitude": 74.7872,
        "price_per_kwh": 16.5,
        "status": "charging",
        "city": "Manipal",
        "address": "Tiger Circle, near MIT Campus, Manipal, Karnataka 576104",
        "connectors": [
            { "type": "CCS2 (DC Ultra)", "power": "150 kW", "count": 1 },
            { "type": "Type 2 (AC)", "power": "11 kW", "count": 2 }
        ],
        "available_chargers": 1,
        "total_chargers": 3,
        "rating": 4.6,
        "last_updated": "Just now"
    },
    {
        "id": 6,
        "station_name": "Kundapura National Highway Station",
        "latitude": 13.6268,
        "longitude": 74.6934,
        "price_per_kwh": 13.0,
        "status": "available",
        "city": "Kundapura",
        "address": "NH 66 Route, Kundapura, Karnataka 576201",
        "connectors": [
            { "type": "CCS2 (DC Fast)", "power": "60 kW", "count": 2 }
        ],
        "available_chargers": 2,
        "total_chargers": 2,
        "rating": 4.4,
        "last_updated": "18 mins ago"
    },
    {
        "id": 7,
        "station_name": "Karkala Town Charging Point",
        "latitude": 13.2172,
        "longitude": 74.9961,
        "price_per_kwh": 15.0,
        "status": "available",
        "city": "Karkala",
        "address": "Market Road, Karkala, Karnataka 574104",
        "connectors": [
            { "type": "Type 2 (AC)", "power": "22 kW", "count": 2 }
        ],
        "available_chargers": 2,
        "total_chargers": 2,
        "rating": 4.3,
        "last_updated": "3 mins ago"
    }
]

async def seed():
    # Ensure all tables are created first
    async with engine.begin() as conn:
        print("Dropping existing tables to force schema sync...")
        await conn.execute(text("DROP TABLE IF EXISTS payments CASCADE"))
        await conn.execute(text("DROP TABLE IF EXISTS transactions CASCADE"))
        await conn.execute(text("DROP TABLE IF EXISTS stations CASCADE"))
        await conn.run_sync(Base.metadata.create_all)
    print("Database tables created/verified.")

    async with async_session_maker() as session:
        # Clear existing data to get a clean re-seeded state
        print("Clearing existing transaction, payment and station logs...")
        await session.execute(text("TRUNCATE TABLE transactions CASCADE"))
        await session.execute(text("TRUNCATE TABLE payments CASCADE"))
        await session.execute(text("TRUNCATE TABLE stations CASCADE"))
        await session.commit()

        print("Seeding stations...")
        for s in stations_data:
            db_station = Station(
                id=s["id"],
                station_name=s["station_name"],
                latitude=s["latitude"],
                longitude=s["longitude"],
                price_per_kwh=s["price_per_kwh"],
                status=s["status"],
                city=s["city"],
                address=s["address"],
                connectors=s["connectors"],
                available_chargers=s["available_chargers"],
                total_chargers=s["total_chargers"],
                rating=s["rating"],
                last_updated=s["last_updated"]
            )
            session.add(db_station)
        await session.commit()
        print("Stations seeded successfully.")

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
