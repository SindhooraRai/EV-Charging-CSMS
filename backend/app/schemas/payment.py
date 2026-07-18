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


class CreateOrderRequest(BaseModel):
    transaction_id: int


class CreateOrderResponse(BaseModel):
    order_id: str
    amount: float
    currency: str
    key_id: str


class VerifyPaymentRequest(BaseModel):
    transaction_id: int
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
