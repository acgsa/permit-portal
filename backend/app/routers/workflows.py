import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core import decode_token, get_db
from ..models import WorkflowRun
from ..schemas import WorkflowCreate, WorkflowStatus
from ..services import WorkflowEngine

router = APIRouter(prefix="/workflows", tags=["workflows"])
_engine = WorkflowEngine()


@router.post("", response_model=WorkflowStatus, status_code=201)
async def create_workflow(
    body: WorkflowCreate,
    claims: dict = Depends(decode_token),
    db: Session = Depends(get_db),
) -> WorkflowStatus:
    started_by = claims.get("sub", "unknown")
    try:
        state = _engine.start(definition_key=body.process_name, payload=body.payload, db=db)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    audit_payload = dict(body.payload)
    audit_payload["_process_definition_key"] = state["definition_key"]
    audit_payload["_process_definition_version"] = state["definition_version"]
    audit_payload["_process_definition_checksum"] = state["definition_checksum"]

    row = WorkflowRun(
        process_name=state["definition_key"],
        status=state["status"],
        current_task=state["current_task"],
        started_by=started_by,
        payload_json=json.dumps(audit_payload),
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return WorkflowStatus.model_validate(row, from_attributes=True)


@router.get("", response_model=list[WorkflowStatus])
def list_workflows(
    claims: dict = Depends(decode_token),
    db: Session = Depends(get_db),
) -> list[WorkflowStatus]:
    username = claims.get("sub")
    role = claims.get("role")

    query = db.query(WorkflowRun)
    if role != "admin":
        query = query.filter(WorkflowRun.started_by == username)

    rows = query.order_by(WorkflowRun.created_at.desc()).all()
    return [WorkflowStatus.model_validate(r, from_attributes=True) for r in rows]


@router.get("/{workflow_id}", response_model=WorkflowStatus)
def get_workflow(
    workflow_id: int,
    claims: dict = Depends(decode_token),
    db: Session = Depends(get_db),
) -> WorkflowStatus:
    row = db.query(WorkflowRun).filter(WorkflowRun.id == workflow_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Workflow not found")

    if row.started_by != claims.get("sub") and claims.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")

    return WorkflowStatus.model_validate(row, from_attributes=True)
