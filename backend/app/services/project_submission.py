"""Project submission service — creates PIC records and starts workflow."""

from __future__ import annotations

import json
from typing import Any

from sqlalchemy.orm import Session

from ..models.pic import CaseEvent, ProcessInstance, Project
from ..models.user import User
from ..models.workflow import WorkflowRun
from ..schemas.synopsis import (
    AgencyAssignment,
    IntakeSubmissionRequest,
    IntakeSubmissionResponse,
    SynopsisResult,
)
from ..services.workflow_engine import WorkflowEngine

_engine = WorkflowEngine()

# Map intake category slugs to PIC sector values
_CATEGORY_TO_SECTOR = {
    "energy-utility": "Energy",
    "transportation-road": "Surface Transportation",
    "communications-telecommunications": "Communications",
    "water-canal-irrigation": "Water",
    "other": "Other",
}


def submit_intake_project(
    submission: IntakeSubmissionRequest,
    username: str,
    db: Session,
) -> IntakeSubmissionResponse:
    """Create PIC Project + ProcessInstances + CaseEvents and start a workflow."""

    intake = submission.intake
    synopsis = submission.synopsis

    # ── 1. Create PIC Project ──────────────────────────────────────────────
    sector = None
    for cat in intake.projectCategories:
        sector = _CATEGORY_TO_SECTOR.get(cat)
        if sector:
            break

    title = (
        intake.projectDescription[:120].strip()
        if intake.projectDescription
        else "Untitled Project"
    )

    # Resolve sponsor from User profile (login.gov + settings) rather than form fields
    user = db.query(User).filter(User.username == username).first()
    sponsor = ""
    applicant_email = ""
    applicant_name = ""
    if user:
        sponsor = user.organization or ""
        if not sponsor and user.first_name:
            sponsor = f"{user.first_name} {user.last_name or ''}".strip()
        applicant_email = user.email or ""
        applicant_name = f"{user.first_name or ''} {user.last_name or ''}".strip()

    project = Project(
        title=title,
        description=intake.projectDescription,
        sponsor=sponsor,
        sector=sector,
        lead_agency=synopsis.lead_agency.name,
        location_text=intake.projectLocation,
        current_status="pre-application",
    )
    db.add(project)
    db.flush()  # get project.id

    # ── 2. Create ProcessInstance for the main NEPA review ─────────────────
    main_process = ProcessInstance(
        parent_project_id=project.id,
        type=synopsis.nepa_level,
        status="planned",
        lead_agency=synopsis.lead_agency.name,
        cooperating_agencies=json.dumps(
            [a.code for a in synopsis.cooperating_agencies]
        ),
        purpose_need=intake.projectDescription,
    )
    db.add(main_process)
    db.flush()

    # Create initial CaseEvent
    db.add(
        CaseEvent(
            parent_process_id=main_process.id,
            name="Application Submitted",
            type="Submission",
            status="completed",
        )
    )

    # ── 3. Create ProcessInstance per additional required review ────────────
    for review in synopsis.required_reviews:
        pi = ProcessInstance(
            parent_project_id=project.id,
            type=review.name,
            status="planned",
            lead_agency=review.agency_name,
            purpose_need=review.description,
        )
        db.add(pi)
        db.flush()
        db.add(
            CaseEvent(
                parent_process_id=pi.id,
                name="Review Initiated",
                type="Referral",
                status="pending",
            )
        )

    # ── 4. Start workflow ──────────────────────────────────────────────────
    payload: dict[str, Any] = {
        "project_id": project.id,
        "lead_agency": synopsis.lead_agency.model_dump(),
        "cooperating_agencies": [a.model_dump() for a in synopsis.cooperating_agencies],
        "nepa_level": synopsis.nepa_level,
        "applicant_email": applicant_email,
        "applicant_name": applicant_name,
    }

    try:
        state = _engine.start(
            definition_key="permit_process", payload=payload, db=db
        )
        workflow = WorkflowRun(
            process_name=state["definition_key"],
            status=state["status"],
            current_task=state["current_task"],
            started_by=username,
            payload_json=json.dumps(payload),
        )
    except ValueError:
        # No deployed BPMN definition yet — create a stub workflow
        workflow = WorkflowRun(
            process_name="permit_process",
            status="created",
            current_task="intake",
            started_by=username,
            payload_json=json.dumps(payload),
        )

    db.add(workflow)
    db.commit()
    db.refresh(project)
    db.refresh(workflow)

    return IntakeSubmissionResponse(
        project_id=project.id,
        workflow_id=workflow.id,
        lead_agency=synopsis.lead_agency,
        cooperating_agencies=synopsis.cooperating_agencies,
        message=(
            f"Project submitted successfully. Routed to {synopsis.lead_agency.name} "
            f"for {synopsis.nepa_level} review."
        ),
    )
