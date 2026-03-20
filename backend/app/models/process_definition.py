from datetime import datetime
from typing import Optional

from sqlalchemy import DateTime, ForeignKey, String, Text, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column

from ..core.db import Base


class ProcessDefinition(Base):
    __tablename__ = "process_definitions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    definition_key: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(160), index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_by: Mapped[str] = mapped_column(String(80), default="system")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


class ProcessDefinitionVersion(Base):
    __tablename__ = "process_definition_versions"
    __table_args__ = (UniqueConstraint("definition_id", "version", name="uq_process_definition_version"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    definition_id: Mapped[int] = mapped_column(ForeignKey("process_definitions.id"), index=True)
    version: Mapped[int] = mapped_column(index=True)
    status: Mapped[str] = mapped_column(String(30), default="draft")
    checksum: Mapped[str] = mapped_column(String(64), index=True)
    process_id: Mapped[str] = mapped_column(String(160))
    process_name: Mapped[str] = mapped_column(String(160))
    bpmn_xml: Mapped[str] = mapped_column(Text)
    task_catalog_json: Mapped[str] = mapped_column(Text, default="[]")
    validation_errors_json: Mapped[str] = mapped_column(Text, default="[]")
    changelog: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    created_by: Mapped[str] = mapped_column(String(80), default="system")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    deployed_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)


class ProcessDeployment(Base):
    __tablename__ = "process_deployments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    definition_id: Mapped[int] = mapped_column(ForeignKey("process_definitions.id"), index=True)
    version_id: Mapped[int] = mapped_column(ForeignKey("process_definition_versions.id"), index=True)
    deployed_version: Mapped[int] = mapped_column(index=True)
    deployment_status: Mapped[str] = mapped_column(String(30), default="active")
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    deployed_by: Mapped[str] = mapped_column(String(80), default="system")
    deployed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), index=True)
