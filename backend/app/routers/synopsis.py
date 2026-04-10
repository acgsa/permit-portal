"""Synopsis evaluation and project submission endpoints."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core import decode_token, get_db
from ..schemas.synopsis import (
    IntakeSubmissionRequest,
    IntakeSubmissionResponse,
    SynopsisRequest,
    SynopsisResult,
)
from ..services.project_submission import submit_intake_project
from ..services.synopsis import generate_synopsis

router = APIRouter(prefix="/synopsis", tags=["synopsis"])


@router.post("/evaluate", response_model=SynopsisResult)
def evaluate_synopsis(
    body: SynopsisRequest,
    db: Session = Depends(get_db),
) -> SynopsisResult:
    """Evaluate project intake data and return a synopsis of required reviews,
    agencies, and NEPA level.  No authentication required — encourages
    exploration before the proponent commits to submitting."""
    return generate_synopsis(body, db)


@router.post("/submit", response_model=IntakeSubmissionResponse, status_code=201)
def submit_project(
    body: IntakeSubmissionRequest,
    claims: dict = Depends(decode_token),
    db: Session = Depends(get_db),
) -> IntakeSubmissionResponse:
    """Submit a project intake with confirmed synopsis.  Creates PIC Project,
    ProcessInstances, CaseEvents, and starts a workflow routed to the
    appropriate agency."""
    username = claims.get("sub", "unknown")
    try:
        return submit_intake_project(body, username, db)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
