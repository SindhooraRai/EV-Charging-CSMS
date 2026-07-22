import asyncio
from sqlalchemy import select
from app.database import async_session_maker
from app.models.user import User

async def main():
    async with async_session_maker() as session:
        result = await session.execute(select(User))
        users = result.scalars().all()
        print("--- USER REGISTRY ---")
        for u in users:
            print(f"Name: {u.name} | Email: {u.email} | Role: {u.role}")

if __name__ == "__main__":
    asyncio.run(main())
