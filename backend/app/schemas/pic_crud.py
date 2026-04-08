"""Create / Update / Response schema variants for PIC entities.

The base models are auto-generated in `pic.py` by datamodel-codegen.
This file extends them with request-specific variants:
  - *Create: omits `id` and auto-set provenance fields
  - *Update: all fields Optional for partial updates
  - *Response: re-exports the generated model (full shape)
"""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel

from .pic import (
    CaseEvent as CaseEventResponse,
    Comment as CommentResponse,
    DecisionElement as DecisionElementResponse,
    Document as DocumentResponse,
    Engagement as EngagementResponse,
    GisData as GisDataResponse,
    GisDataElement as GisDataElementResponse,
    LegalStructure as LegalStructureResponse,
    ProcessDecisionPayload as ProcessDecisionPayloadResponse,
    ProcessInstance as ProcessInstanceResponse,
    ProcessModel as ProcessModelResponse,
    Project as ProjectResponse,
    UserRole as UserRoleResponse,
)

# Re-export Response schemas with explicit names
__all__ = [
    # Project
    "ProjectCreate", "ProjectUpdate", "ProjectResponse",
    # ProcessInstance
    "ProcessInstanceCreate", "ProcessInstanceUpdate", "ProcessInstanceResponse",
    # Document
    "DocumentCreate", "DocumentUpdate", "DocumentResponse",
    # Comment
    "CommentCreate", "CommentUpdate", "CommentResponse",
    # CaseEvent
    "CaseEventCreate", "CaseEventUpdate", "CaseEventResponse",
    # Engagement
    "EngagementCreate", "EngagementUpdate", "EngagementResponse",
    # GisData
    "GisDataCreate", "GisDataUpdate", "GisDataResponse",
    # GisDataElement
    "GisDataElementCreate", "GisDataElementUpdate", "GisDataElementResponse",
    # LegalStructure
    "LegalStructureCreate", "LegalStructureUpdate", "LegalStructureResponse",
    # ProcessModel
    "ProcessModelCreate", "ProcessModelUpdate", "ProcessModelResponse",
    # DecisionElement
    "DecisionElementCreate", "DecisionElementUpdate", "DecisionElementResponse",
    # ProcessDecisionPayload
    "ProcessDecisionPayloadCreate", "ProcessDecisionPayloadUpdate", "ProcessDecisionPayloadResponse",
    # UserRole
    "UserRoleCreate", "UserRoleUpdate", "UserRoleResponse",
]


# -----------------------------------------------------------------------
# Helper: Build an Update schema where every field from the base is Optional
# -----------------------------------------------------------------------
def _make_update_model(name: str, base: type) -> type:
    """Dynamically create an all-Optional version of a Pydantic model."""
    fields = {}
    for field_name, field_info in base.model_fields.items():
        fields[field_name] = (Optional[field_info.annotation], None)
    return type(name, (BaseModel,), {"__annotations__": {k: v[0] for k, v in fields.items()}, **{k: v[1] for k, v in fields.items()}})


# -----------------------------------------------------------------------
# Project
# -----------------------------------------------------------------------
class ProjectCreate(ProjectResponse):
    id: None = None  # type: ignore[assignment]


ProjectUpdate = _make_update_model("ProjectUpdate", ProjectResponse)


# -----------------------------------------------------------------------
# ProcessInstance
# -----------------------------------------------------------------------
class ProcessInstanceCreate(ProcessInstanceResponse):
    id: None = None  # type: ignore[assignment]


ProcessInstanceUpdate = _make_update_model("ProcessInstanceUpdate", ProcessInstanceResponse)


# -----------------------------------------------------------------------
# Document
# -----------------------------------------------------------------------
class DocumentCreate(DocumentResponse):
    id: None = None  # type: ignore[assignment]


DocumentUpdate = _make_update_model("DocumentUpdate", DocumentResponse)


# -----------------------------------------------------------------------
# Comment
# -----------------------------------------------------------------------
class CommentCreate(CommentResponse):
    id: None = None  # type: ignore[assignment]


CommentUpdate = _make_update_model("CommentUpdate", CommentResponse)


# -----------------------------------------------------------------------
# CaseEvent
# -----------------------------------------------------------------------
class CaseEventCreate(CaseEventResponse):
    id: None = None  # type: ignore[assignment]


CaseEventUpdate = _make_update_model("CaseEventUpdate", CaseEventResponse)


# -----------------------------------------------------------------------
# Engagement
# -----------------------------------------------------------------------
class EngagementCreate(EngagementResponse):
    id: None = None  # type: ignore[assignment]


EngagementUpdate = _make_update_model("EngagementUpdate", EngagementResponse)


# -----------------------------------------------------------------------
# GisData
# -----------------------------------------------------------------------
class GisDataCreate(GisDataResponse):
    id: None = None  # type: ignore[assignment]


GisDataUpdate = _make_update_model("GisDataUpdate", GisDataResponse)


# -----------------------------------------------------------------------
# GisDataElement
# -----------------------------------------------------------------------
class GisDataElementCreate(GisDataElementResponse):
    id: None = None  # type: ignore[assignment]


GisDataElementUpdate = _make_update_model("GisDataElementUpdate", GisDataElementResponse)


# -----------------------------------------------------------------------
# LegalStructure
# -----------------------------------------------------------------------
class LegalStructureCreate(LegalStructureResponse):
    id: None = None  # type: ignore[assignment]


LegalStructureUpdate = _make_update_model("LegalStructureUpdate", LegalStructureResponse)


# -----------------------------------------------------------------------
# ProcessModel
# -----------------------------------------------------------------------
class ProcessModelCreate(ProcessModelResponse):
    id: None = None  # type: ignore[assignment]


ProcessModelUpdate = _make_update_model("ProcessModelUpdate", ProcessModelResponse)


# -----------------------------------------------------------------------
# DecisionElement
# -----------------------------------------------------------------------
class DecisionElementCreate(DecisionElementResponse):
    id: None = None  # type: ignore[assignment]


DecisionElementUpdate = _make_update_model("DecisionElementUpdate", DecisionElementResponse)


# -----------------------------------------------------------------------
# ProcessDecisionPayload
# -----------------------------------------------------------------------
class ProcessDecisionPayloadCreate(ProcessDecisionPayloadResponse):
    id: None = None  # type: ignore[assignment]


ProcessDecisionPayloadUpdate = _make_update_model("ProcessDecisionPayloadUpdate", ProcessDecisionPayloadResponse)


# -----------------------------------------------------------------------
# UserRole
# -----------------------------------------------------------------------
class UserRoleCreate(UserRoleResponse):
    id: None = None  # type: ignore[assignment]


UserRoleUpdate = _make_update_model("UserRoleUpdate", UserRoleResponse)
