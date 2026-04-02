from datetime import datetime

from sqlalchemy import DateTime, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from ..core.db import Base


class PreScreenerDraft(Base):
    __tablename__ = "pre_screener_drafts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    owner_sub: Mapped[str] = mapped_column(String(120), index=True)
    status: Mapped[str] = mapped_column(String(30), default="draft", index=True)
    title: Mapped[str] = mapped_column(String(200), default="Pre-Screener Draft")
    payload_json: Mapped[str] = mapped_column(Text, default="{}")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), index=True
    )
