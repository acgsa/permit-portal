"""001 — PIC NEPA Data Standard v1.2 schema

Runs the official schema-v1.2.0.sql from the pic-standards submodule verbatim.
This guarantees exact column types, constraints, FKs, and comments match the standard.

Revision ID: 001_pic_schema
Revises: (none)
"""

from pathlib import Path

from alembic import op

revision = "001_pic_schema"
down_revision = None
branch_labels = None
depends_on = None

PIC_SQL = Path(__file__).resolve().parents[2] / "pic-standards" / "src" / "database" / "schema-v1.2.0.sql"


def upgrade() -> None:
    sql = PIC_SQL.read_text()
    # Execute the full PIC DDL — creates all 13 tables with constraints and comments
    op.execute(sql)


def downgrade() -> None:
    # Drop PIC tables in FK-safe order (reverse dependency)
    tables = [
        "process_decision_payload",
        "decision_element",
        "gis_data_element",
        "gis_data",
        "case_event",
        "comment",
        "engagement",
        "document",
        "process_instance",
        "process_model",
        "legal_structure",
        "user_role",
        "project",
    ]
    for t in tables:
        op.execute(f'DROP TABLE IF EXISTS "public"."{t}" CASCADE')
