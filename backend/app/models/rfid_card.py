from sqlalchemy import (
    Integer,
    String,
    DateTime,
    ForeignKey,
    func,
)

from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class RFIDCard(Base):
    __tablename__ = "rfid_cards"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    uid: Mapped[str] = mapped_column(
        String(100),
        unique=True,
        nullable=False
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="Active",
        nullable=False
    )

    linked_at: Mapped[DateTime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now()
    )