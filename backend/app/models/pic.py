"""PIC NEPA Data Standard v1.2 — SQLAlchemy models.

These models match the official schema-v1.2.0.sql exactly.
Column types, names, and FK constraints are faithful to the standard.
"""

from datetime import date, datetime
from typing import Optional

from sqlalchemy import (
    BigInteger,
    Boolean,
    Date,
    DateTime,
    Float,
    ForeignKey,
    String,
    Text,
    func,
)
from sqlalchemy.dialects.postgresql import JSON, JSONB as PostgresJSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from ..core import settings
from ..core.db import Base
from .mixins import ProvenanceMixin

JSONB = JSON if settings.database_url.startswith("sqlite") else PostgresJSONB


# ---------------------------------------------------------------------------
# Project
# ---------------------------------------------------------------------------
class Project(ProvenanceMixin, Base):
    __tablename__ = "project"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    title: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sector: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    lead_agency: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    participating_agencies: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    location_lat: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    location_lon: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    location_object: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    type: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    funding: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    current_status: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sponsor: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    sponsor_contact: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    parent_project_id: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    location_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    other: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    process_instances = relationship("ProcessInstance", back_populates="project", foreign_keys="ProcessInstance.parent_project_id")
    gis_data = relationship("GisData", back_populates="project", foreign_keys="GisData.parent_project_id")
    decision_payloads = relationship("ProcessDecisionPayload", back_populates="project_rel", foreign_keys="ProcessDecisionPayload.project")


# ---------------------------------------------------------------------------
# ProcessInstance
# ---------------------------------------------------------------------------
class ProcessInstance(ProvenanceMixin, Base):
    __tablename__ = "process_instance"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    parent_project_id: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("project.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    parent_process_id: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    agency_id: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    federal_id: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    type: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    stage: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    start_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    complete_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    outcome: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    comment_start: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    comment_end: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    lead_agency: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    joint_lead_agency: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    cooperating_agencies: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    participating_agencies: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    process_model_id: Mapped[Optional[int]] = mapped_column("process_model", BigInteger, ForeignKey("process_model.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    other: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    purpose_need: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    process_code: Mapped[Optional[str]] = mapped_column(Text, nullable=True)

    # Relationships
    project = relationship("Project", back_populates="process_instances", foreign_keys=[parent_project_id])
    process_model_rel = relationship("ProcessModel", back_populates="process_instances", foreign_keys=[process_model_id])
    documents = relationship("Document", back_populates="process_instance", foreign_keys="Document.parent_process_id")
    case_events = relationship("CaseEvent", back_populates="process_instance", foreign_keys="CaseEvent.parent_process_id")
    engagements = relationship("Engagement", back_populates="process_instance", foreign_keys="Engagement.parent_process_id")
    gis_data = relationship("GisData", back_populates="process_instance", foreign_keys="GisData.parent_process_id")
    decision_payloads = relationship("ProcessDecisionPayload", back_populates="process_instance_rel", foreign_keys="ProcessDecisionPayload.process")


# ---------------------------------------------------------------------------
# Document
# ---------------------------------------------------------------------------
class Document(ProvenanceMixin, Base):
    __tablename__ = "document"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    parent_process_id: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("process_instance.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    related_document_id: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    title: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    volume_title: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    document_revision: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    revision_number: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    supplement_number: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    publish_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    prepared_by: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    status: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    public_access: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    document_summary: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    document_toc: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    document_type: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    other: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    document_files: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    process_instance = relationship("ProcessInstance", back_populates="documents", foreign_keys=[parent_process_id])
    comments = relationship("Comment", back_populates="document", foreign_keys="Comment.parent_document_id")
    engagements = relationship("Engagement", back_populates="document", foreign_keys="Engagement.related_document_id")
    case_events = relationship("CaseEvent", back_populates="document", foreign_keys="CaseEvent.related_document_id")
    gis_data = relationship("GisData", back_populates="document", foreign_keys="GisData.parent_document_id")


# ---------------------------------------------------------------------------
# Comment
# ---------------------------------------------------------------------------
class Comment(ProvenanceMixin, Base):
    __tablename__ = "comment"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    parent_document_id: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("document.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    commenter_entity: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    date_submitted: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    submission_method: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    content_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    content_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    response_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    response_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    public_source: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    public_acess: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)  # Note: typo matches PIC DDL
    other: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    document = relationship("Document", back_populates="comments", foreign_keys=[parent_document_id])
    gis_data = relationship("GisData", back_populates="comment", foreign_keys="GisData.parent_comment_id")


# ---------------------------------------------------------------------------
# CaseEvent
# ---------------------------------------------------------------------------
class CaseEvent(ProvenanceMixin, Base):
    __tablename__ = "case_event"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    parent_process_id: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("process_instance.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    parent_event_id: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    related_document_id: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("document.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    name: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    source: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    type: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    public_access: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    tier: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    status: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    outcome: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    assigned_entity: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    datetime_field: Mapped[Optional[datetime]] = mapped_column("datetime", DateTime(timezone=True), nullable=True)
    following_segment_name: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    related_engagement_id: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("engagement.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    other: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    process_instance = relationship("ProcessInstance", back_populates="case_events", foreign_keys=[parent_process_id])
    document = relationship("Document", back_populates="case_events", foreign_keys=[related_document_id])
    engagement = relationship("Engagement", back_populates="case_events", foreign_keys=[related_engagement_id])
    gis_data = relationship("GisData", back_populates="case_event", foreign_keys="GisData.parent_case_event_id")


# ---------------------------------------------------------------------------
# Engagement
# ---------------------------------------------------------------------------
class Engagement(ProvenanceMixin, Base):
    __tablename__ = "engagement"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    parent_process_id: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("process_instance.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    type: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    location: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    related_document_id: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("document.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    attendance: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    participation: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    start_datetime: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    end_datetime: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    other: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    process_instance = relationship("ProcessInstance", back_populates="engagements", foreign_keys=[parent_process_id])
    document = relationship("Document", back_populates="engagements", foreign_keys=[related_document_id])
    case_events = relationship("CaseEvent", back_populates="engagement", foreign_keys="CaseEvent.related_engagement_id")
    gis_data = relationship("GisData", back_populates="engagement", foreign_keys="GisData.parent_engagement_id")


# ---------------------------------------------------------------------------
# GisData
# ---------------------------------------------------------------------------
class GisData(ProvenanceMixin, Base):
    __tablename__ = "gis_data"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    parent_project_id: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("project.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    parent_process_id: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("process_instance.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    parent_document_id: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("document.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    parent_case_event_id: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("case_event.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    parent_comment_id: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("comment.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    parent_engagement_id: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("engagement.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    extent: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    centroid_lat: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    centroid_lon: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    creator: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    creator_contact: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    container_inventory: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    map_image: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    data_container: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    address: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    updated_last: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True), nullable=True)
    other: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships (polymorphic parent — only one FK should be set per row)
    project = relationship("Project", back_populates="gis_data", foreign_keys=[parent_project_id])
    process_instance = relationship("ProcessInstance", back_populates="gis_data", foreign_keys=[parent_process_id])
    document = relationship("Document", back_populates="gis_data", foreign_keys=[parent_document_id])
    case_event = relationship("CaseEvent", back_populates="gis_data", foreign_keys=[parent_case_event_id])
    comment = relationship("Comment", back_populates="gis_data", foreign_keys=[parent_comment_id])
    engagement = relationship("Engagement", back_populates="gis_data", foreign_keys=[parent_engagement_id])
    elements = relationship("GisDataElement", back_populates="gis_data_parent", foreign_keys="GisDataElement.parent_gis")


# ---------------------------------------------------------------------------
# GisDataElement
# ---------------------------------------------------------------------------
class GisDataElement(ProvenanceMixin, Base):
    __tablename__ = "gis_data_element"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    parent_gis: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("gis_data.id"), nullable=True)
    container_reference: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    format: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    access_method: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    coordinate_system: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    top_left_lat: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    top_left_lon: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    bot_right_lat: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    bot_right_lon: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    purpose: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    data_match: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    access_info: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    other: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    gis_data_parent = relationship("GisData", back_populates="elements", foreign_keys=[parent_gis])


# ---------------------------------------------------------------------------
# LegalStructure
# ---------------------------------------------------------------------------
class LegalStructure(ProvenanceMixin, Base):
    __tablename__ = "legal_structure"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    title: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    citation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    context: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    issuing_authority: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    effective_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    compliance_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    other: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    process_models = relationship("ProcessModel", back_populates="legal_structure", foreign_keys="ProcessModel.legal_structure_id")
    decision_elements = relationship("DecisionElement", back_populates="legal_structure", foreign_keys="DecisionElement.legal_structure_id")


# ---------------------------------------------------------------------------
# ProcessModel
# ---------------------------------------------------------------------------
class ProcessModel(ProvenanceMixin, Base):
    __tablename__ = "process_model"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    title: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    bpmn_model: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    legal_structure_id: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("legal_structure.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    legal_structure_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    screening_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    screening_desc_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    agency: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    parent_model: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    DMN_model: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    other: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    legal_structure = relationship("LegalStructure", back_populates="process_models", foreign_keys=[legal_structure_id])
    decision_elements = relationship("DecisionElement", back_populates="process_model_rel", foreign_keys="DecisionElement.process_model_fk")
    process_instances = relationship("ProcessInstance", back_populates="process_model_rel", foreign_keys="ProcessInstance.process_model_id")


# ---------------------------------------------------------------------------
# DecisionElement
# ---------------------------------------------------------------------------
class DecisionElement(ProvenanceMixin, Base):
    __tablename__ = "decision_element"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    process_model_fk: Mapped[Optional[int]] = mapped_column("process_model", BigInteger, ForeignKey("process_model.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    legal_structure_id: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("legal_structure.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    title: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    measure: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    threshold: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    spatial: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    intersect: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    spatial_reference: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    form_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    form_response_desc: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    form_data: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    evaluation_method: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    evaluation_dmn: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    category: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    process_model_internal_reference_id: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    parent_decision_element_id: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    other: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    expected_evaluation_data: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    response_data: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    process_model_rel = relationship("ProcessModel", back_populates="decision_elements", foreign_keys=[process_model_fk])
    legal_structure = relationship("LegalStructure", back_populates="decision_elements", foreign_keys=[legal_structure_id])
    payloads = relationship("ProcessDecisionPayload", back_populates="decision_element", foreign_keys="ProcessDecisionPayload.process_decision_element")


# ---------------------------------------------------------------------------
# ProcessDecisionPayload
# ---------------------------------------------------------------------------
class ProcessDecisionPayload(ProvenanceMixin, Base):
    __tablename__ = "process_decision_payload"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    process_decision_element: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("decision_element.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    process: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("process_instance.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    project: Mapped[Optional[int]] = mapped_column(BigInteger, ForeignKey("project.id", onupdate="CASCADE", ondelete="SET NULL"), nullable=True)
    data_description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    evaluation_data: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    response: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    result: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    result_bool: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    result_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    result_data: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    result_source: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    parent_payload: Mapped[Optional[int]] = mapped_column(BigInteger, nullable=True)
    other: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
    data_annotation: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    evaluation_data_annotation: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)

    # Relationships
    decision_element = relationship("DecisionElement", back_populates="payloads", foreign_keys=[process_decision_element])
    process_instance_rel = relationship("ProcessInstance", back_populates="decision_payloads", foreign_keys=[process])
    project_rel = relationship("Project", back_populates="decision_payloads", foreign_keys=[project])


# ---------------------------------------------------------------------------
# UserRole
# ---------------------------------------------------------------------------
class UserRole(ProvenanceMixin, Base):
    __tablename__ = "user_role"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    name: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    access_policy: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    permission_descriptions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    public: Mapped[Optional[bool]] = mapped_column(Boolean, nullable=True)
    other: Mapped[Optional[dict]] = mapped_column(JSONB, nullable=True)
