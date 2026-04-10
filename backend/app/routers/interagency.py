"""Inter-agency REST API for external agency systems.

Allows external agencies to receive project referrals, fetch project details,
update review status, and submit documents — all using PIC-standard payloads.
Authentication is via per-agency API keys (not JWT).
"""

from __future__ import annotations

import hashlib
from typing import Optional

from fastapi import APIRouter, Depends, Header, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from ..core import get_db
from ..models.pic import CaseEvent, Document, ProcessInstance, Project
from ..models.routing_rules import AgencyApiKey

router = APIRouter(prefix="/api/interagency", tags=["interagency"])


# ── API Key authentication ─────────────────────────────────────────────────

def _hash_key(raw: str) -> str:
    return hashlib.sha256(raw.encode()).hexdigest()


def verify_api_key(
    x_api_key: str = Header(..., alias="X-API-Key"),
    db: Session = Depends(get_db),
) -> AgencyApiKey:
    """Validate the API key and return the associated AgencyApiKey row."""
    hashed = _hash_key(x_api_key)
    key_row = (
        db.query(AgencyApiKey)
        .filter(AgencyApiKey.api_key_hash == hashed, AgencyApiKey.revoked_at.is_(None))
        .first()
    )
    if not key_row:
        raise HTTPException(status_code=401, detail="Invalid or revoked API key")
    return key_row


# ── Schemas ────────────────────────────────────────────────────────────────

class ProjectReferralResponse(BaseModel):
    project_id: int
    title: str
    description: Optional[str] = None
    sector: Optional[str] = None
    lead_agency: Optional[str] = None
    location_text: Optional[str] = None
    current_status: Optional[str] = None
    process_instances: list[dict] = Field(default_factory=list)


class ReviewStatusUpdate(BaseModel):
    process_instance_id: int
    status: str  # "planned" | "underway" | "paused" | "completed"
    outcome: Optional[str] = None
    notes: Optional[str] = None


class DocumentSubmission(BaseModel):
    process_instance_id: int
    document_type: str
    title: str
    url: Optional[str] = None
    prepared_by: str
    public_access: bool = True


class WebhookRegistration(BaseModel):
    webhook_url: str
    events: list[str] = Field(default_factory=lambda: ["status_change"])


# ── Endpoints ──────────────────────────────────────────────────────────────

@router.get("/projects/{project_id}", response_model=ProjectReferralResponse)
def get_project_referral(
    project_id: int,
    api_key: AgencyApiKey = Depends(verify_api_key),
    db: Session = Depends(get_db),
) -> ProjectReferralResponse:
    """External agency fetches full project details for a referral."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    instances = (
        db.query(ProcessInstance)
        .filter(ProcessInstance.parent_project_id == project_id)
        .all()
    )

    return ProjectReferralResponse(
        project_id=project.id,
        title=project.title,
        description=project.description,
        sector=project.sector,
        lead_agency=project.lead_agency,
        location_text=project.location_text,
        current_status=project.current_status,
        process_instances=[
            {
                "id": pi.id,
                "type": pi.type,
                "status": pi.status,
                "lead_agency": pi.lead_agency,
            }
            for pi in instances
        ],
    )


@router.patch("/projects/{project_id}/status")
def update_review_status(
    project_id: int,
    body: ReviewStatusUpdate,
    api_key: AgencyApiKey = Depends(verify_api_key),
    db: Session = Depends(get_db),
) -> dict:
    """External agency updates the status of a review/process instance."""
    pi = (
        db.query(ProcessInstance)
        .filter(
            ProcessInstance.id == body.process_instance_id,
            ProcessInstance.parent_project_id == project_id,
        )
        .first()
    )
    if not pi:
        raise HTTPException(status_code=404, detail="Process instance not found")

    pi.status = body.status
    if body.outcome:
        pi.outcome = body.outcome

    # Record a case event for the status change
    event = CaseEvent(
        parent_process_id=pi.id,
        name=f"Status updated to {body.status}",
        type="Status Update",
        status="completed",
        description=body.notes,
    )
    db.add(event)
    db.commit()

    return {"message": "Status updated", "process_instance_id": pi.id, "status": pi.status}


@router.post("/projects/{project_id}/documents", status_code=201)
def submit_document(
    project_id: int,
    body: DocumentSubmission,
    api_key: AgencyApiKey = Depends(verify_api_key),
    db: Session = Depends(get_db),
) -> dict:
    """External agency submits a document/decision for a process instance."""
    pi = (
        db.query(ProcessInstance)
        .filter(
            ProcessInstance.id == body.process_instance_id,
            ProcessInstance.parent_project_id == project_id,
        )
        .first()
    )
    if not pi:
        raise HTTPException(status_code=404, detail="Process instance not found")

    doc = Document(
        parent_process_id=pi.id,
        document_type=body.document_type,
        title=body.title,
        url=body.url,
        prepared_by=body.prepared_by,
        public_access=body.public_access,
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    return {"message": "Document submitted", "document_id": doc.id}


@router.post("/webhooks", status_code=201)
def register_webhook(
    body: WebhookRegistration,
    api_key: AgencyApiKey = Depends(verify_api_key),
    db: Session = Depends(get_db),
) -> dict:
    """Register a webhook URL for status change notifications."""
    api_key.webhook_url = body.webhook_url
    db.commit()
    return {
        "message": "Webhook registered",
        "agency_code": api_key.agency_code,
        "webhook_url": body.webhook_url,
    }
