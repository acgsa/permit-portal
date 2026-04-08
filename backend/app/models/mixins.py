"""Shared mixins for PIC-compliant SQLAlchemy models."""

from datetime import datetime
from typing import Optional

from sqlalchemy import String, DateTime
from sqlalchemy.orm import Mapped, mapped_column


class ProvenanceMixin:
    """PIC v1.2 provenance columns — present on every PIC entity."""

    record_owner_agency: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    data_source_agency: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    data_source_system: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    data_record_version: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    last_updated: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    retrieved_timestamp: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
