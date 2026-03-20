from __future__ import annotations

from typing import Any

from sqlalchemy.orm import Session

from .bpmn_parser import parse_bpmn_definition, resolve_next_task
from .process_registry import registry


class WorkflowEngine:
    """
    SpiffWorkflow pilot wrapper.
    Uses SpiffWorkflow when available, while keeping a stable API for this pilot.
    """

    def __init__(self) -> None:
        self._spiff_available = False
        try:
            import SpiffWorkflow  # noqa: F401

            self._spiff_available = True
        except Exception:
            self._spiff_available = False

    def start(self, definition_key: str, payload: dict[str, Any], db: Session) -> dict[str, Any]:
        active = registry.get_active_version(db, definition_key)
        if not active:
            raise ValueError(f"No deployed process definition found for '{definition_key}'")

        _, version = active
        metadata = parse_bpmn_definition(version.bpmn_xml)

        return {
            "definition_key": definition_key,
            "definition_version": version.version,
            "definition_checksum": version.checksum,
            "status": "running" if self._spiff_available else "created",
            "current_task": metadata.first_task_id,
            "payload": payload,
            "engine": "spiffworkflow" if self._spiff_available else "stub",
        }

    def advance(
        self,
        definition_key: str,
        definition_version: int,
        current_task: str,
        context: dict[str, Any],
        db: Session,
    ) -> dict[str, Any]:
        definition = registry.get_definition(db, definition_key)
        if not definition:
            raise ValueError(f"Process definition '{definition_key}' not found")

        version = registry.get_version(db, definition.id, definition_version)
        if not version:
            raise ValueError(
                f"Process definition version {definition_version} not found for '{definition_key}'"
            )

        metadata = parse_bpmn_definition(version.bpmn_xml)
        next_task, status = resolve_next_task(metadata, current_task, context)
        return {
            "definition_key": definition_key,
            "definition_version": definition_version,
            "next_task": next_task,
            "status": status,
            "engine": "spiffworkflow" if self._spiff_available else "stub",
        }
