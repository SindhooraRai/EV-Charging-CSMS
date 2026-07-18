from sqlalchemy import (
    Integer,
    Float,
    String,
    DateTime,
    ForeignKey,
)

from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Transaction(Base):
    __tablename__ = "transactions"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    station_id: Mapped[int] = mapped_column(
        ForeignKey("stations.id"),
        nullable=False
    )

    start_time: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        nullable=False
    )

    end_time: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        nullable=True
    )

    energy_used: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False
    )

    amount: Mapped[float] = mapped_column(
        Float,
        default=0.0,
        nullable=False
    )

    payment_status: Mapped[str] = mapped_column(
        String(20),
        default="Pending",
        nullable=False
    )