from fastapi import APIRouter

from app.schemas.auth import LoginRequest, TokenResponse

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/login",
    response_model=TokenResponse
)
async def login(data: LoginRequest):
    """
    Login endpoint.
    Currently returns a mock JWT token.
    Database authentication will be added later.
    """

    return TokenResponse(
        access_token="dummy_token",
        token_type="bearer"
    )