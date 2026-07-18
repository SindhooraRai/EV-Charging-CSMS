from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.schemas.auth import LoginRequest, TokenResponse
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import AuthService

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED
)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    """
    Register endpoint.
    Creates a new user record in the database.
    """
    new_user = await AuthService.register_user(
        db=db,
        name=data.name,
        email=data.email,
        password_plain=data.password,
        phone=data.phone,
        vehicle=data.vehicle
    )
    if not new_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered"
        )
    return new_user


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
        role=login_data["user"]["role"],
        name=login_data["user"].get("name") or "",
        phone=login_data["user"].get("phone") or "",
        vehicle=login_data["user"].get("vehicle")
    )