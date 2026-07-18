from sqlalchemy import (
    Integer,
    String,
    Float,
)

from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Station(Base):
    __tablename__ = "stations"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    station_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    latitude: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    longitude: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    price_per_kwh: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="Available",
        nullable=False
    )