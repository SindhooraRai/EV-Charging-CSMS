from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.station import Station
from app.schemas.station import StationResponse, StationCreate, StationUpdate
from app.middleware.auth import get_current_active_user, get_current_admin_user

router = APIRouter(
    prefix="/stations",
    tags=["Stations"]
)


@router.get(
    "/",
    response_model=list[StationResponse]
)
async def get_stations(
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_active_user)
):
    result = await db.execute(
        select(Station)
    )

    stations = result.scalars().all()

    return stations


@router.get(
    "/{station_id}",
    response_model=StationResponse
)
async def get_station_details(
    station_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_active_user)
):
    station = await db.get(Station, station_id)
    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Station not found"
        )
    return station


@router.post(
    "/",
    response_model=StationResponse,
    status_code=status.HTTP_201_CREATED
)
async def create_station(
    payload: StationCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_admin_user)
):
    db_station = Station(
        station_name=payload.station_name,
        latitude=payload.latitude,
        longitude=payload.longitude,
        price_per_kwh=payload.price_per_kwh,
        city=payload.city,
        address=payload.address,
        connectors=[c.model_dump() for c in payload.connectors] if payload.connectors else [],
        available_chargers=payload.available_chargers,
        total_chargers=payload.total_chargers,
        rating=payload.rating,
        last_updated=payload.last_updated,
        status="Available"
    )
    db.add(db_station)
    await db.commit()
    await db.refresh(db_station)
    return db_station


@router.put(
    "/{station_id}",
    response_model=StationResponse
)
async def update_station(
    station_id: int,
    payload: StationUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_admin_user)
):
    station = await db.get(Station, station_id)
    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Station not found"
        )

    update_data = payload.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key == "connectors" and value is not None:
            setattr(station, key, [c.model_dump() for c in value])
        else:
            setattr(station, key, value)

    await db.commit()
    await db.refresh(station)
    return station


@router.delete(
    "/{station_id}"
)
async def delete_station(
    station_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_admin_user)
):
    station = await db.get(Station, station_id)
    if not station:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Station not found"
        )

    await db.delete(station)
    await db.commit()
    return {"status": "success", "message": "Station deleted successfully."}