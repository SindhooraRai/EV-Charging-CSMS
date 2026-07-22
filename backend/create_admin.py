import asyncio
from sqlalchemy import select
from app.database import async_session_maker
from app.models.user import User
from app.services.auth_service import AuthService

async def main():
    email = "admin@voltgrid.com"
    password = "admin"
    name = "System Administrator"
    phone = "9999999999"
    role = "admin"

    async with async_session_maker() as session:
        # Check if admin already exists
        result = await session.execute(select(User).where(User.email == email))
        existing_admin = result.scalars().first()
        
        if existing_admin:
            print(f"Admin already exists with email: {email}")
            if existing_admin.role != "admin":
                print("Promoting existing user to admin...")
                existing_admin.role = "admin"
                await session.commit()
                print("Promoted successfully!")
            return

        print(f"Creating default admin account '{name}' with email '{email}' and password '{password}'...")
        admin_user = await AuthService.register_user(
            db=session,
            name=name,
            email=email,
            password_plain=password,
            phone=phone,
            role=role
        )
        if admin_user:
            print("Admin account created successfully!")
        else:
            print("Failed to create admin account.")

if __name__ == "__main__":
    asyncio.run(main())
