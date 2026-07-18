from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.payment import Payment
from app.models.transaction import Transaction
from app.schemas.payment import (
    PaymentResponse,
    CreateOrderRequest,
    CreateOrderResponse,
    VerifyPaymentRequest,
)
from app.middleware.auth import get_current_active_user
from app.services.razorpay_service import (
    create_razorpay_order,
    verify_razorpay_signature,
)
from app.config import settings

router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)


@router.get(
    "/",
    response_model=list[PaymentResponse]
)
async def get_payments(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_active_user)
):
    result = await db.execute(
        select(Payment)
    )

    payments = result.scalars().all()

    return payments


@router.post(
    "/create-order",
    response_model=CreateOrderResponse
)
async def create_checkout_order(
    payload: CreateOrderRequest,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_active_user)
):
    # Fetch transaction from database
    transaction = await db.get(Transaction, payload.transaction_id)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction log not found."
        )

    # Prevent paying duplicate times if already paid
    if transaction.payment_status == "Paid":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Transaction has already been paid."
        )

    # Perform Razorpay Order creation
    razorpay_order = create_razorpay_order(
        amount=transaction.amount,
        receipt_id=f"txn_{transaction.id}"
    )

    # Flush any previous payments for this transaction to avoid conflicts
    result = await db.execute(
        select(Payment).where(Payment.transaction_id == transaction.id)
    )
    existing_payments = result.scalars().all()
    for p in existing_payments:
        await db.delete(p)

    # Create new pending payment
    payment = Payment(
        transaction_id=transaction.id,
        payment_id=razorpay_order["id"],
        amount=transaction.amount,
        status="Pending",
        method="Razorpay"
    )
    
    db.add(payment)
    await db.commit()

    return CreateOrderResponse(
        order_id=razorpay_order["id"],
        amount=transaction.amount,
        currency="INR",
        key_id=settings.RAZORPAY_KEY_ID
    )


@router.post(
    "/verify-payment"
)
async def verify_checkout_payment(
    payload: VerifyPaymentRequest,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_active_user)
):
    # Verify cryptographic signature via Service
    is_valid = verify_razorpay_signature(
        order_id=payload.razorpay_order_id,
        payment_id=payload.razorpay_payment_id,
        signature=payload.razorpay_signature
    )

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cryptographic signature verification failed."
        )

    # Retrieve payment record by transaction id or order id
    result = await db.execute(
        select(Payment).where(
            (Payment.transaction_id == payload.transaction_id) | 
            (Payment.payment_id == payload.razorpay_order_id)
        )
    )
    payment = result.scalars().first()
    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Payment reference record not found."
        )

    # Update Payment state
    payment.status = "Success"
    payment.payment_id = payload.razorpay_payment_id

    # Update transaction state
    transaction = await db.get(Transaction, payload.transaction_id)
    if transaction:
        transaction.payment_status = "Paid"

    await db.commit()

    return {
        "status": "success",
        "message": "Payment signature verified and transaction marked as Paid."
    }
