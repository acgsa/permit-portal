"""Schemas for project-intake synopsis evaluation and submission."""

from __future__ import annotations

from typing import Optional

from pydantic import BaseModel, Field


# ── Request ────────────────────────────────────────────────────────────────────

class ImpactField(BaseModel):
    answer: str = ""  # "yes" | "no" | ""
    details: str = ""


class SynopsisRequest(BaseModel):
    """Mirrors the frontend IntakeFormState."""

    projectCategories: list[str] = Field(default_factory=list)
    projectDescription: str = ""
    projectLocation: str = ""
    locationNotes: str = ""
    impactsWaterBodies: ImpactField = Field(default_factory=ImpactField)
    impactsSpeciesHabitat: ImpactField = Field(default_factory=ImpactField)
    impactsHistoricCultural: ImpactField = Field(default_factory=ImpactField)
    impactsAirEnvironmental: ImpactField = Field(default_factory=ImpactField)
    impactsWaterways: ImpactField = Field(default_factory=ImpactField)


# ── Response ───────────────────────────────────────────────────────────────────

class AgencyAssignment(BaseModel):
    code: str
    name: str
    role: str = "lead"  # "lead" | "cooperating" | "consulting"
    region: Optional[str] = None
    office: Optional[str] = None


class ReviewRequirement(BaseModel):
    name: str
    authority: str  # legal citation
    agency_code: str
    agency_name: str
    description: str
    estimated_days: Optional[int] = None
    trigger: str  # which impact field triggered this


class FormRequirement(BaseModel):
    form_id: str  # e.g. "SF-299"
    title: str
    agency_code: str


class SynopsisResult(BaseModel):
    nepa_level: str  # "Categorical Exclusion" | "Environmental Assessment" | "Environmental Impact Statement"
    nepa_explanation: str
    required_reviews: list[ReviewRequirement] = Field(default_factory=list)
    required_forms: list[FormRequirement] = Field(default_factory=list)
    lead_agency: AgencyAssignment
    cooperating_agencies: list[AgencyAssignment] = Field(default_factory=list)
    estimated_timeline_days: Optional[int] = None
    summary: str  # human-readable overview paragraph


# ── Submission ─────────────────────────────────────────────────────────────────

class IntakeSubmissionRequest(BaseModel):
    intake: SynopsisRequest
    synopsis: SynopsisResult


class IntakeSubmissionResponse(BaseModel):
    project_id: int
    workflow_id: int
    lead_agency: AgencyAssignment
    cooperating_agencies: list[AgencyAssignment] = Field(default_factory=list)
    message: str
