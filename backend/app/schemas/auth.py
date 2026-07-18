from typing import Optional
from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    role: str
    name: str
    phone: str
    vehicle: Optional[str] = None