from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.auth import LoginRequest, TokenResponse

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/login",
    response_model=TokenResponse
)
async def login(
    data: LoginRequest,
    db: AsyncSession = Depends(get_db)
):
    return TokenResponse(
        access_token="dummy_token",
        token_type="bearer"
    )