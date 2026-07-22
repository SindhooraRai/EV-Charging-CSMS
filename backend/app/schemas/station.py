from pydantic import BaseModel, ConfigDict, Field
from typing import List, Optional

class ConnectorSchema(BaseModel):
    type: str
    power: str
    count: int

class StationBase(BaseModel):
    station_name: str = Field(min_length=2, max_length=100)
    latitude: float
    longitude: float
    price_per_kwh: float
    city: Optional[str] = None
    address: Optional[str] = None
    connectors: Optional[List[ConnectorSchema]] = None
    available_chargers: int = 0
    total_chargers: int = 0
    rating: float = 0.0
    last_updated: str = "Just now"


class StationCreate(StationBase):
    pass


class StationUpdate(BaseModel):
    station_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    price_per_kwh: Optional[float] = None
    status: Optional[str] = None
    city: Optional[str] = None
    address: Optional[str] = None
    connectors: Optional[List[ConnectorSchema]] = None
    available_chargers: Optional[int] = None
    total_chargers: Optional[int] = None
    rating: Optional[float] = None
    last_updated: Optional[str] = None


class StationResponse(StationBase):
    id: int
    status: str

    model_config = ConfigDict(from_attributes=True)