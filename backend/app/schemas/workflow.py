from datetime import datetime

from pydantic import BaseModel, Field


class WorkflowCreate(BaseModel):
    process_name: str
    payload: dict = Field(default_factory=dict)


class WorkflowStatus(BaseModel):
    id: int
    process_name: str
    status: str
    current_task: str
    started_by: str
    created_at: datetime
    updated_at: datetime
