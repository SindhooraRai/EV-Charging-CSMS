from typing import Optional, Dict, Any
from fastapi import Depends, HTTPException, status, Header
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.services.auth_service import AuthService

async def get_current_active_user(
    authorization: Optional[str] = Header(None),
    db: AsyncSession = Depends(get_db)
) -> Dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authentication header"
        )
    token = authorization.split(" ")[1]
    user = await AuthService.get_current_user(db, token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid token"
        )
    return user

async def get_current_admin_user(
    current_user: Dict[str, Any] = Depends(get_current_active_user)
) -> Dict[str, Any]:
    if current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin privileges required"
        )
    return current_user
