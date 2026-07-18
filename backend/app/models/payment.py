from sqlalchemy import (
    Integer,
    Float,
    String,
    ForeignKey,
)

from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    transaction_id: Mapped[int] = mapped_column(
        ForeignKey("transactions.id"),
        nullable=False
    )

    payment_id: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="Pending",
        nullable=False
    )

    amount: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    method: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )