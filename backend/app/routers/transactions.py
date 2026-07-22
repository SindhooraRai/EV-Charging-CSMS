from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.transaction import Transaction
from app.models.station import Station
from app.schemas.transaction import TransactionResponse, TransactionStartRequest, TransactionStopRequest
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


@router.post(
    "/start",
    response_model=TransactionResponse,
    status_code=status.HTTP_201_CREATED
)
async def start_transaction(
    payload: TransactionStartRequest,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_active_user)
):
    # Retrieve station from database
    station = await db.get(Station, payload.station_id)
    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Charging station not found."
        )

    # Check availability
    if station.status.lower() == "offline":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Charging station is offline for maintenance."
        )

    if station.available_chargers <= 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No charger slots available at this station."
        )

    # Decrement availability
    station.available_chargers -= 1
    if station.available_chargers == 0:
        station.status = "charging"

    # Create new active transaction
    tx = Transaction(
        user_id=current_user["id"],
        station_id=station.id,
        start_time=datetime.utcnow(),
        end_time=None,
        energy_used=0.0,
        amount=0.0,
        payment_status="Unpaid"
    )

    db.add(tx)
    await db.commit()
    await db.refresh(tx)
    return tx


@router.post(
    "/stop",
    response_model=TransactionResponse
)
async def stop_transaction(
    payload: TransactionStopRequest,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_active_user)
):
    # Retrieve transaction from database
    tx = await db.get(Transaction, payload.transaction_id)
    if not tx:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction session log not found."
        )

    # Verify authorization
    if tx.user_id != current_user["id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to stop this charging session."
        )

    # Verify session is still active
    if tx.end_time is not None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This charging session has already been stopped."
        )

    # Retrieve associated station
    station = await db.get(Station, tx.station_id)
    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Station associated with this session was not found."
        )

    # Increment availability
    station.available_chargers += 1
    if station.status.lower() == "charging" and station.available_chargers > 0:
        station.status = "available"

    # Finalize transaction values
    tx.end_time = datetime.utcnow()
    tx.energy_used = payload.energy_used
    tx.amount = round(payload.energy_used * station.price_per_kwh, 2)

    await db.commit()
    await db.refresh(tx)
    return tx