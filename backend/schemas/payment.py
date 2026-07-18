from pydantic import BaseModel, ConfigDict, Field


class PaymentBase(BaseModel):
    transaction_id: int
    amount: float = Field(gt=0)
    method: str


class PaymentCreate(PaymentBase):
    pass


class PaymentResponse(PaymentBase):
    id: int
    payment_id: str
    status: str

    model_config = ConfigDict(from_attributes=True)