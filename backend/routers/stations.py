from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.station import Station
from app.schemas.station import StationResponse

router = APIRouter(
    prefix="/stations",
    tags=["Stations"]
)


@router.get(
    "/",
    response_model=list[StationResponse]
)
async def get_stations(
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Station)
    )

    stations = result.scalars().all()

    return stations