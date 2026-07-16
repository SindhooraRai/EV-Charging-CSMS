from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from schemas.auth import LoginRequest, TokenResponse
from services.auth_service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/login",
    response_model=TokenResponse
)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    """
    Login endpoint.
    Verifies credentials against the database and returns a JWT access token.
    """
    login_data = await AuthService.login_user(db, data.email, data.password)
    if not login_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return TokenResponse(
        access_token=login_data["access_token"],
        token_type=login_data["token_type"],
        role=login_data["user"]["role"]
    )