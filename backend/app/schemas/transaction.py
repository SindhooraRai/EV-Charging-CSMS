from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class TransactionBase(BaseModel):
    user_id: int
    station_id: int
    start_time: datetime


class TransactionCreate(TransactionBase):
    pass


class TransactionStartRequest(BaseModel):
    station_id: int


class TransactionStopRequest(BaseModel):
    transaction_id: int
    energy_used: float


class TransactionResponse(TransactionBase):
    id: int
    end_time: datetime | None
    energy_used: float
    amount: float
    payment_status: str

    model_config = ConfigDict(from_attributes=True)