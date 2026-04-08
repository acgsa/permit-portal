"""One-time data migration: existing tables → PIC entities.

Migrates:
  - workflow_runs → process_instance
  - pre_screener_drafts → process_decision_payload (linked to a generic decision_element)

Usage:
  python -m scripts.migrate_data

Requires a running PostgreSQL with both PIC and custom tables created
(i.e., `alembic upgrade head` has been run).
"""

import json
import sys
from datetime import datetime, timezone
from pathlib import Path

# Ensure the app package is importable
sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

from sqlalchemy import text

from app.core.config import settings
from app.core.db import SessionLocal

PROVENANCE = {
    "record_owner_agency": "PERMIT.GOV",
    "data_source_agency": "PERMIT.GOV",
    "data_source_system": "permit-portal",
    "data_record_version": "1.0",
}


def migrate_workflow_runs(db) -> int:
    """Map workflow_runs rows → process_instance records."""
    rows = db.execute(text("SELECT * FROM workflow_runs")).mappings().all()
    count = 0
    for row in rows:
        db.execute(
            text("""
                INSERT INTO process_instance
                    (type, status, stage, notes, other,
                     record_owner_agency, data_source_agency, data_source_system,
                     data_record_version, last_updated)
                VALUES
                    (:type, :status, :stage, :notes, :other,
                     :record_owner_agency, :data_source_agency, :data_source_system,
                     :data_record_version, :last_updated)
            """),
            {
                "type": row["process_name"],
                "status": row["status"],
                "stage": row["current_task"],
                "notes": f"Migrated from workflow_run id={row['id']}",
                "other": json.dumps({"legacy_payload": json.loads(row["payload_json"] or "{}"), "started_by": row["started_by"]}),
                "last_updated": row.get("updated_at") or datetime.now(timezone.utc),
                **PROVENANCE,
            },
        )
        count += 1
    return count


def migrate_pre_screener_drafts(db) -> int:
    """Map pre_screener_drafts rows → process_decision_payload records."""
    rows = db.execute(text("SELECT * FROM pre_screener_drafts")).mappings().all()
    count = 0
    for row in rows:
        form_data = json.loads(row["form_data_json"] or "{}")
        db.execute(
            text("""
                INSERT INTO process_decision_payload
                    (data_description, evaluation_data, response, other,
                     record_owner_agency, data_source_agency, data_source_system,
                     data_record_version, last_updated)
                VALUES
                    (:data_description, :evaluation_data, :response, :other,
                     :record_owner_agency, :data_source_agency, :data_source_system,
                     :data_record_version, :last_updated)
            """),
            {
                "data_description": f"Pre-screener draft for user {row['user_id']}",
                "evaluation_data": json.dumps(form_data),
                "response": "draft",
                "other": json.dumps({"legacy_pre_screener_id": row["id"], "user_id": row["user_id"]}),
                "last_updated": row.get("updated_at") or datetime.now(timezone.utc),
                **PROVENANCE,
            },
        )
        count += 1
    return count


def main() -> None:
    db = SessionLocal()
    try:
        wf_count = migrate_workflow_runs(db)
        ps_count = migrate_pre_screener_drafts(db)
        db.commit()
        print(f"Migration complete: {wf_count} workflow_runs → process_instance, {ps_count} pre_screener_drafts → process_decision_payload")
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
