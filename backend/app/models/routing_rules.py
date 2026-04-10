"""Agency routing rules and API key models."""

from __future__ import annotations

from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, Float, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from ..core.db import Base


class AgencyRoutingRule(Base):
    """Maps project categories and impact triggers to agencies and reviews."""

    __tablename__ = "agency_routing_rules"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # Match criteria
    trigger_type: Mapped[str] = mapped_column(String(40))
    # "category" — matches project category
    # "impact"   — matches an impact field being "yes"
    trigger_value: Mapped[str] = mapped_column(String(120))
    # For category: "energy-utility", "transportation-road", etc.
    # For impact: "impactsWaterBodies", "impactsSpeciesHabitat", etc.

    # Resulting agency assignment
    agency_code: Mapped[str] = mapped_column(String(20), index=True)
    agency_name: Mapped[str] = mapped_column(String(200))
    agency_role: Mapped[str] = mapped_column(String(40), default="lead")
    # "lead" | "cooperating" | "consulting"

    # Review/permit info (only for impact-triggered rules)
    review_name: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    review_authority: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    review_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    estimated_days: Mapped[Optional[int]] = mapped_column(nullable=True)

    # Required form info
    form_id: Mapped[Optional[str]] = mapped_column(String(40), nullable=True)
    form_title: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)

    # Ordering / priority
    priority: Mapped[int] = mapped_column(default=0)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )


class AgencyApiKey(Base):
    """API keys for machine-to-machine inter-agency communication."""

    __tablename__ = "agency_api_keys"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    agency_code: Mapped[str] = mapped_column(String(20), index=True)
    agency_name: Mapped[str] = mapped_column(String(200))
    api_key_hash: Mapped[str] = mapped_column(String(256))
    permissions: Mapped[str] = mapped_column(Text, default="read,write")
    # Comma-separated: "read", "write", "webhook"
    webhook_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    revoked_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
