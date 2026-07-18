from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.payment import Payment
from app.schemas.payment import PaymentResponse

router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)


@router.get(
    "/",
    response_model=list[PaymentResponse]
)
async def get_payments(
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Payment)
    )

    payments = result.scalars().all()

    return payments