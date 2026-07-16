from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class UserBase(BaseModel):
    name: str = Field(min_length=2, max_length=100)
    email: EmailStr
    phone: str = Field(min_length=10, max_length=15)
    vehicle: Optional[str] = Field(default=None, max_length=100)
    

class UserCreate(UserBase):
    password: str = Field(min_length=8)


class UserResponse(UserBase):
    id: int
    role: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)