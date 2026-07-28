from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text

from sqlalchemy.orm import (
    Mapped,
    mapped_column,
)

from database.database import Base


class Investigation(Base):

    __tablename__ = "investigations"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    claim: Mapped[str] = mapped_column(
        Text
    )

    verdict: Mapped[str] = mapped_column(
        String
    )

    confidence: Mapped[int] = mapped_column(
        Integer
    )

    analysis: Mapped[str] = mapped_column(
        Text
    )

    evidence_quality: Mapped[int] = mapped_column(
        Integer
    )

    source_agreement: Mapped[int] = mapped_column(
        Integer
    )