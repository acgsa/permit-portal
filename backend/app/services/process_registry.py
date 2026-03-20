import json
from pathlib import Path
from typing import Optional, Tuple

from sqlalchemy import func
from sqlalchemy.orm import Session

from ..models import ProcessDefinition, ProcessDefinitionVersion, ProcessDeployment
from .bpmn_parser import BpmnMetadata, parse_bpmn_definition


class ProcessRegistry:
    def validate_bpmn(self, bpmn_xml: str) -> BpmnMetadata:
        return parse_bpmn_definition(bpmn_xml)

    def list_definitions(self, db: Session) -> list[ProcessDefinition]:
        return db.query(ProcessDefinition).order_by(ProcessDefinition.updated_at.desc()).all()

    def get_definition(self, db: Session, definition_key: str) -> Optional[ProcessDefinition]:
        return (
            db.query(ProcessDefinition)
            .filter(ProcessDefinition.definition_key == definition_key)
            .first()
        )

    def get_versions(self, db: Session, definition_id: int) -> list[ProcessDefinitionVersion]:
        return (
            db.query(ProcessDefinitionVersion)
            .filter(ProcessDefinitionVersion.definition_id == definition_id)
            .order_by(ProcessDefinitionVersion.version.desc())
            .all()
        )

    def get_version(
        self, db: Session, definition_id: int, version: int
    ) -> Optional[ProcessDefinitionVersion]:
        return (
            db.query(ProcessDefinitionVersion)
            .filter(
                ProcessDefinitionVersion.definition_id == definition_id,
                ProcessDefinitionVersion.version == version,
            )
            .first()
        )

    def get_deployments(self, db: Session, definition_id: int) -> list[ProcessDeployment]:
        return (
            db.query(ProcessDeployment)
            .filter(ProcessDeployment.definition_id == definition_id)
            .order_by(ProcessDeployment.deployed_at.desc())
            .all()
        )

    def get_active_version(
        self, db: Session, definition_key: str
    ) -> Optional[Tuple[ProcessDefinition, ProcessDefinitionVersion]]:
        definition = self.get_definition(db, definition_key)
        if not definition:
            return None

        deployment = (
            db.query(ProcessDeployment)
            .filter(
                ProcessDeployment.definition_id == definition.id,
                ProcessDeployment.deployment_status == "active",
            )
            .order_by(ProcessDeployment.deployed_at.desc())
            .first()
        )
        if not deployment:
            return None

        version = (
            db.query(ProcessDefinitionVersion)
            .filter(ProcessDefinitionVersion.id == deployment.version_id)
            .first()
        )
        if not version:
            return None
        return definition, version

    def create_definition(
        self,
        db: Session,
        definition_key: str,
        name: Optional[str],
        description: Optional[str],
        bpmn_xml: str,
        created_by: str,
        changelog: Optional[str] = None,
    ) -> Tuple[ProcessDefinition, ProcessDefinitionVersion]:
        metadata = self.validate_bpmn(bpmn_xml)
        definition = ProcessDefinition(
            definition_key=definition_key,
            name=name or metadata.process_name,
            description=description,
            created_by=created_by,
        )
        db.add(definition)
        db.flush()

        version = ProcessDefinitionVersion(
            definition_id=definition.id,
            version=1,
            status="draft",
            checksum=metadata.checksum,
            process_id=metadata.process_id,
            process_name=metadata.process_name,
            bpmn_xml=bpmn_xml,
            task_catalog_json=json.dumps(metadata.tasks),
            validation_errors_json=json.dumps(metadata.validation_errors),
            changelog=changelog,
            created_by=created_by,
        )
        db.add(version)
        db.commit()
        db.refresh(definition)
        db.refresh(version)
        return definition, version

    def create_version(
        self,
        db: Session,
        definition: ProcessDefinition,
        bpmn_xml: str,
        created_by: str,
        changelog: Optional[str] = None,
    ) -> ProcessDefinitionVersion:
        metadata = self.validate_bpmn(bpmn_xml)
        next_version = (
            db.query(func.max(ProcessDefinitionVersion.version))
            .filter(ProcessDefinitionVersion.definition_id == definition.id)
            .scalar()
            or 0
        ) + 1

        definition.name = definition.name or metadata.process_name

        version = ProcessDefinitionVersion(
            definition_id=definition.id,
            version=next_version,
            status="draft",
            checksum=metadata.checksum,
            process_id=metadata.process_id,
            process_name=metadata.process_name,
            bpmn_xml=bpmn_xml,
            task_catalog_json=json.dumps(metadata.tasks),
            validation_errors_json=json.dumps(metadata.validation_errors),
            changelog=changelog,
            created_by=created_by,
        )
        db.add(version)
        db.commit()
        db.refresh(version)
        return version

    def deploy_version(
        self,
        db: Session,
        definition: ProcessDefinition,
        version: ProcessDefinitionVersion,
        deployed_by: str,
        notes: Optional[str] = None,
    ) -> ProcessDeployment:
        active = (
            db.query(ProcessDeployment)
            .filter(
                ProcessDeployment.definition_id == definition.id,
                ProcessDeployment.deployment_status == "active",
            )
            .all()
        )
        for deployment in active:
            deployment.deployment_status = "superseded"

        version.status = "deployed"
        deployment = ProcessDeployment(
            definition_id=definition.id,
            version_id=version.id,
            deployed_version=version.version,
            deployment_status="active",
            notes=notes,
            deployed_by=deployed_by,
        )
        db.add(deployment)
        db.commit()
        db.refresh(deployment)
        db.refresh(version)
        return deployment

    def ensure_seeded_definition(
        self,
        db: Session,
        definition_key: str,
        bpmn_path: str,
        actor: str = "system",
        description: Optional[str] = None,
    ) -> None:
        existing = self.get_definition(db, definition_key)
        if existing:
            active = self.get_active_version(db, definition_key)
            if active:
                return

        bpmn_xml = Path(bpmn_path).read_text(encoding="utf-8")
        if not existing:
            existing, version = self.create_definition(
                db=db,
                definition_key=definition_key,
                name=None,
                description=description,
                bpmn_xml=bpmn_xml,
                created_by=actor,
                changelog="Seeded from repository BPMN",
            )
        else:
            versions = self.get_versions(db, existing.id)
            if versions:
                version = versions[0]
            else:
                version = self.create_version(
                    db=db,
                    definition=existing,
                    bpmn_xml=bpmn_xml,
                    created_by=actor,
                    changelog="Seeded from repository BPMN",
                )

        self.deploy_version(
            db=db,
            definition=existing,
            version=version,
            deployed_by=actor,
            notes="Initial seeded deployment",
        )


registry = ProcessRegistry()
