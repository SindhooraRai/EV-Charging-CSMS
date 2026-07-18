from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionResponse
from app.middleware.auth import get_current_active_user

router = APIRouter(
    prefix="/transactions",
    tags=["Transactions"]
)


@router.get(
    "/",
    response_model=list[TransactionResponse]
)
async def get_transactions(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_active_user)
):
    result = await db.execute(
        select(Transaction)
    )

    transactions = result.scalars().all()

    return transactions