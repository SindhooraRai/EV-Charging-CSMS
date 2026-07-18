from pydantic import BaseModel, ConfigDict, Field


class StationBase(BaseModel):
    station_name: str = Field(min_length=2, max_length=100)
    latitude: float
    longitude: float
    price_per_kwh: float


class StationCreate(StationBase):
    pass


class StationResponse(StationBase):
    id: int
    status: str

    model_config = ConfigDict(from_attributes=True)