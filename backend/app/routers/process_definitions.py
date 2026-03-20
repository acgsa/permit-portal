import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..core import decode_token, get_db
from ..schemas.process_definition import (
    ProcessDefinitionCreate,
    ProcessDefinitionDetail,
    ProcessDefinitionSummary,
    ProcessDefinitionValidateRequest,
    ProcessDefinitionValidateResponse,
    ProcessDeploymentCreate,
    ProcessDeploymentResponse,
    ProcessDefinitionVersionCreate,
    ProcessDefinitionVersionResponse,
    ProcessTaskSummary,
)
from ..services.process_registry import registry

router = APIRouter(prefix="/process-definitions", tags=["process-definitions"])


def _require_editor(claims: dict) -> None:
    if claims.get("role") not in {"admin", "staff"}:
        raise HTTPException(status_code=403, detail="Editor access required")


def _serialize_version(row) -> ProcessDefinitionVersionResponse:
    return ProcessDefinitionVersionResponse(
        version=row.version,
        status=row.status,
        checksum=row.checksum,
        process_id=row.process_id,
        process_name=row.process_name,
        tasks=[ProcessTaskSummary(**task) for task in json.loads(row.task_catalog_json)],
        validation_errors=json.loads(row.validation_errors_json),
        changelog=row.changelog,
        created_by=row.created_by,
        created_at=row.created_at,
        deployed_at=row.deployed_at,
    )


def _serialize_deployment(row) -> ProcessDeploymentResponse:
    return ProcessDeploymentResponse(
        deployed_version=row.deployed_version,
        deployment_status=row.deployment_status,
        notes=row.notes,
        deployed_by=row.deployed_by,
        deployed_at=row.deployed_at,
    )


@router.post("/validate", response_model=ProcessDefinitionValidateResponse)
def validate_process_definition(
    body: ProcessDefinitionValidateRequest,
    claims: dict = Depends(decode_token),
) -> ProcessDefinitionValidateResponse:
    _require_editor(claims)
    metadata = registry.validate_bpmn(body.bpmn_xml)
    return ProcessDefinitionValidateResponse(
        process_id=metadata.process_id,
        process_name=metadata.process_name,
        first_task_id=metadata.first_task_id,
        checksum=metadata.checksum,
        tasks=[ProcessTaskSummary(**task) for task in metadata.tasks],
        validation_errors=metadata.validation_errors,
    )


@router.get("", response_model=list[ProcessDefinitionSummary])
def list_process_definitions(
    claims: dict = Depends(decode_token),
    db: Session = Depends(get_db),
) -> list[ProcessDefinitionSummary]:
    _require_editor(claims)
    rows = registry.list_definitions(db)
    items: list[ProcessDefinitionSummary] = []
    for row in rows:
        versions = registry.get_versions(db, row.id)
        deployments = registry.get_deployments(db, row.id)
        items.append(
            ProcessDefinitionSummary(
                definition_key=row.definition_key,
                name=row.name,
                description=row.description,
                latest_version=versions[0].version if versions else 0,
                deployed_version=deployments[0].deployed_version if deployments else None,
                created_by=row.created_by,
                created_at=row.created_at,
                updated_at=row.updated_at,
            )
        )
    return items


@router.post("", response_model=ProcessDefinitionDetail, status_code=201)
def create_process_definition(
    body: ProcessDefinitionCreate,
    claims: dict = Depends(decode_token),
    db: Session = Depends(get_db),
) -> ProcessDefinitionDetail:
    _require_editor(claims)
    existing = registry.get_definition(db, body.definition_key)
    if existing:
        raise HTTPException(status_code=409, detail="Process definition key already exists")

    definition, version = registry.create_definition(
        db=db,
        definition_key=body.definition_key,
        name=body.name,
        description=body.description,
        bpmn_xml=body.bpmn_xml,
        created_by=claims.get("sub", "unknown"),
        changelog=body.changelog,
    )
    return ProcessDefinitionDetail(
        definition_key=definition.definition_key,
        name=definition.name,
        description=definition.description,
        latest_version=version.version,
        deployed_version=None,
        versions=[_serialize_version(version)],
        deployments=[],
    )


@router.get("/{definition_key}", response_model=ProcessDefinitionDetail)
def get_process_definition(
    definition_key: str,
    claims: dict = Depends(decode_token),
    db: Session = Depends(get_db),
) -> ProcessDefinitionDetail:
    _require_editor(claims)
    definition = registry.get_definition(db, definition_key)
    if not definition:
        raise HTTPException(status_code=404, detail="Process definition not found")

    versions = registry.get_versions(db, definition.id)
    deployments = registry.get_deployments(db, definition.id)
    return ProcessDefinitionDetail(
        definition_key=definition.definition_key,
        name=definition.name,
        description=definition.description,
        latest_version=versions[0].version if versions else 0,
        deployed_version=deployments[0].deployed_version if deployments else None,
        versions=[_serialize_version(row) for row in versions],
        deployments=[_serialize_deployment(row) for row in deployments],
    )


@router.post("/{definition_key}/versions", response_model=ProcessDefinitionVersionResponse, status_code=201)
def create_process_definition_version(
    definition_key: str,
    body: ProcessDefinitionVersionCreate,
    claims: dict = Depends(decode_token),
    db: Session = Depends(get_db),
) -> ProcessDefinitionVersionResponse:
    _require_editor(claims)
    definition = registry.get_definition(db, definition_key)
    if not definition:
        raise HTTPException(status_code=404, detail="Process definition not found")

    version = registry.create_version(
        db=db,
        definition=definition,
        bpmn_xml=body.bpmn_xml,
        created_by=claims.get("sub", "unknown"),
        changelog=body.changelog,
    )
    return _serialize_version(version)


@router.get("/{definition_key}/versions/{version}", response_model=ProcessDefinitionVersionResponse)
def get_process_definition_version(
    definition_key: str,
    version: int,
    claims: dict = Depends(decode_token),
    db: Session = Depends(get_db),
) -> ProcessDefinitionVersionResponse:
    _require_editor(claims)
    definition = registry.get_definition(db, definition_key)
    if not definition:
        raise HTTPException(status_code=404, detail="Process definition not found")
    row = registry.get_version(db, definition.id, version)
    if not row:
        raise HTTPException(status_code=404, detail="Process definition version not found")
    return _serialize_version(row)


@router.get("/{definition_key}/versions/{version}/source")
def get_process_definition_source(
    definition_key: str,
    version: int,
    claims: dict = Depends(decode_token),
    db: Session = Depends(get_db),
) -> dict:
    _require_editor(claims)
    definition = registry.get_definition(db, definition_key)
    if not definition:
        raise HTTPException(status_code=404, detail="Process definition not found")
    row = registry.get_version(db, definition.id, version)
    if not row:
        raise HTTPException(status_code=404, detail="Process definition version not found")
    return {"definition_key": definition_key, "version": version, "bpmn_xml": row.bpmn_xml}


@router.post("/{definition_key}/deployments", response_model=ProcessDeploymentResponse, status_code=201)
def deploy_process_definition_version(
    definition_key: str,
    body: ProcessDeploymentCreate,
    claims: dict = Depends(decode_token),
    db: Session = Depends(get_db),
) -> ProcessDeploymentResponse:
    _require_editor(claims)
    definition = registry.get_definition(db, definition_key)
    if not definition:
        raise HTTPException(status_code=404, detail="Process definition not found")
    version = registry.get_version(db, definition.id, body.version)
    if not version:
        raise HTTPException(status_code=404, detail="Process definition version not found")

    deployment = registry.deploy_version(
        db=db,
        definition=definition,
        version=version,
        deployed_by=claims.get("sub", "unknown"),
        notes=body.notes,
    )
    return _serialize_deployment(deployment)
