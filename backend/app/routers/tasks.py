import json
from typing import Optional

from fastapi import APIRouter, Body, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core import decode_token, get_db
from ..models import WorkflowRun
from ..services import WorkflowEngine

router = APIRouter(prefix="/tasks", tags=["tasks"])
_engine = WorkflowEngine()


@router.post("/{workflow_id}/complete")
def complete_task(
    workflow_id: int,
    body: Optional[dict] = Body(default=None),
    claims: dict = Depends(decode_token),
    db: Session = Depends(get_db),
) -> dict:
    row = db.query(WorkflowRun).filter(WorkflowRun.id == workflow_id).first()
    if not row:
        raise HTTPException(status_code=404, detail="Workflow not found")

    if row.started_by != claims.get("sub") and claims.get("role") not in ("admin", "staff"):
        raise HTTPException(status_code=403, detail="Not allowed")

    payload = json.loads(row.payload_json) if row.payload_json else {}
    payload.update(body or {})

    definition_key = payload.get("_process_definition_key") or row.process_name
    definition_version = payload.get("_process_definition_version")
    if not isinstance(definition_key, str) or not isinstance(definition_version, int):
        raise HTTPException(status_code=400, detail="Workflow is missing deployed process metadata")

    try:
        state = _engine.advance(
            definition_key=definition_key,
            definition_version=definition_version,
            current_task=row.current_task,
            context=payload,
            db=db,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    row.current_task = state["next_task"] or row.current_task
    row.status = state["status"]
    row.payload_json = json.dumps(payload)

    db.commit()
    db.refresh(row)
    return {"workflow_id": row.id, "status": row.status, "current_task": row.current_task}
