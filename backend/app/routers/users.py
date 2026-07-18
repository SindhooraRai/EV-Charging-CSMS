from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse
from app.middleware.auth import get_current_admin_user

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.get(
    "/",
    response_model=list[UserResponse]
)
async def get_users(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_admin_user)
):
    result = await db.execute(
        select(User)
    )

    users = result.scalars().all()

    return users