from typing import Any, Dict, Optional
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from utils.security import verify_password, create_access_token


class AuthService:
    @staticmethod
    async def authenticate_user(
        db: AsyncSession,
        email: str,
        password_plain: str
    ) -> Optional[Dict[str, Any]]:
        """
        Verify user credentials. First attempts to query using the database
        directly to remain independent of ORM models, then returns the user data
        if valid.

        Returns:
            Dict containing user details (id, email, role, is_active, etc.) or None if auth fails.
        """
        try:
            # Try importing current user ORM model if teammate already defined it.
            # Otherwise, fall back to executing database query via SQLAlchemy Core text.
            try:
                from models.user import User
                from sqlalchemy.future import select
                stmt = select(User).where(User.email == email)
                result = await db.execute(stmt)
                user_obj = result.scalars().first()
                if user_obj:
                    # support dynamic field names (e.g. hashed_password, password_hash, or password)
                    hashed_pw = getattr(user_obj, "hashed_password", None) or getattr(user_obj, "password_hash", None) or getattr(user_obj, "password", None)
                    if hashed_pw and verify_password(password_plain, hashed_pw):
                        return {
                            "id": getattr(user_obj, "id", None),
                            "email": getattr(user_obj, "email", None),
                            "role": getattr(user_obj, "role", "user"),
                            "is_active": getattr(user_obj, "is_active", True)
                        }
            except (ImportError, AttributeError):
                pass

            # Fallback raw SQL query
            query = text("SELECT * FROM users WHERE email = :email")
            result = await db.execute(query, {"email": email})
            row = result.mappings().first()
            if row:
                hashed_pw = row.get("hashed_password") or row.get("password_hash") or row.get("password")
                if hashed_pw and verify_password(password_plain, hashed_pw):
                    return {
                        "id": row.get("id"),
                        "email": row.get("email"),
                        "role": row.get("role", "user"),
                        "is_active": row.get("is_active", True)
                    }

        except Exception as e:
            # Logger/Warning if database tables don't exist yet (useful during setup/development)
            import logging
            logger = logging.getLogger(__name__)
            logger.warning(f"Auth database lookup failed: {e}")

        return None

    @staticmethod
    async def login_user(db: AsyncSession, email: str, password_plain: str) -> Optional[Dict[str, Any]]:
        """
        Authenticates user and generates their signed access JWT token.
        """
        user = await AuthService.authenticate_user(db, email, password_plain)
        if not user:
            return None

        # Standard token subject (sub) and role payload claims
        token_data = {
            "sub": str(user["id"]) if user.get("id") is not None else user["email"],
            "email": user["email"],
            "role": user.get("role", "user")
        }

        access_token = create_access_token(data=token_data)

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": user.get("id"),
                "email": user["email"],
                "role": user.get("role", "user")
            }
        }

    @staticmethod
    async def get_current_user(db: AsyncSession, token: str) -> Optional[Dict[str, Any]]:
        """
        Retrieves user information given a JWT token. First checks for ORM model
        definitions by the teammate, then falls back to a raw SQL query.
        """
        from utils.security import decode_access_token
        payload = decode_access_token(token)
        if not payload:
            return None

        user_id = payload.get("sub")
        email = payload.get("email")
        if not user_id and not email:
            return None

        try:
            try:
                from models.user import User
                from sqlalchemy.future import select
                if user_id.isdigit():
                    stmt = select(User).where(User.id == int(user_id))
                else:
                    stmt = select(User).where(User.email == user_id)
                result = await db.execute(stmt)
                user_obj = result.scalars().first()
                if user_obj:
                    return {
                        "id": getattr(user_obj, "id", None),
                        "email": getattr(user_obj, "email", None),
                        "role": getattr(user_obj, "role", "user"),
                        "is_active": getattr(user_obj, "is_active", True)
                    }
            except (ImportError, AttributeError):
                pass

            # Fallback raw SQL query
            if user_id.isdigit():
                query = text("SELECT id, email, role, is_active FROM users WHERE id = :id")
                params = {"id": int(user_id)}
            else:
                query = text("SELECT id, email, role, is_active FROM users WHERE email = :email")
                params = {"email": user_id}

            result = await db.execute(query, params)
            row = result.mappings().first()
            if row:
                return {
                    "id": row.get("id"),
                    "email": row.get("email"),
                    "role": row.get("role", "user"),
                    "is_active": row.get("is_active", True)
                }

        except Exception as e:
            import logging
            logger = logging.getLogger(__name__)
            logger.warning(f"Error fetching current user from database: {e}")

        return None

