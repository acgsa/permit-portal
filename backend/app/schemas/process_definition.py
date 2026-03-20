from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class ProcessTaskSummary(BaseModel):
    id: str
    name: str
    node_type: str


class ProcessDefinitionValidateRequest(BaseModel):
    bpmn_xml: str


class ProcessDefinitionValidateResponse(BaseModel):
    process_id: str
    process_name: str
    first_task_id: str
    checksum: str
    tasks: list[ProcessTaskSummary]
    validation_errors: list[str]


class ProcessDefinitionCreate(BaseModel):
    definition_key: str
    name: Optional[str] = None
    description: Optional[str] = None
    bpmn_xml: str
    changelog: Optional[str] = None


class ProcessDefinitionVersionCreate(BaseModel):
    bpmn_xml: str
    changelog: Optional[str] = None


class ProcessDeploymentCreate(BaseModel):
    version: int
    notes: Optional[str] = None


class ProcessDefinitionSummary(BaseModel):
    definition_key: str
    name: str
    description: Optional[str] = None
    latest_version: int
    deployed_version: Optional[int] = None
    created_by: str
    created_at: datetime
    updated_at: datetime


class ProcessDefinitionVersionResponse(BaseModel):
    version: int
    status: str
    checksum: str
    process_id: str
    process_name: str
    tasks: list[ProcessTaskSummary]
    validation_errors: list[str]
    changelog: Optional[str] = None
    created_by: str
    created_at: datetime
    deployed_at: Optional[datetime] = None


class ProcessDeploymentResponse(BaseModel):
    deployed_version: int
    deployment_status: str
    notes: Optional[str] = None
    deployed_by: str
    deployed_at: datetime


class ProcessDefinitionDetail(BaseModel):
    definition_key: str
    name: str
    description: Optional[str] = None
    latest_version: int
    deployed_version: Optional[int] = None
    versions: list[ProcessDefinitionVersionResponse]
    deployments: list[ProcessDeploymentResponse]
