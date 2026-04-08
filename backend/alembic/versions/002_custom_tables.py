"""002 — Custom application tables (not in PIC standard)

Creates tables for: users, workflow_runs, pre_screener_drafts,
process_definitions, process_definition_versions, process_deployments.
These are internal to the PERMIT.GOV application and have no PIC analog.

Revision ID: 002_custom_tables
Revises: 001_pic_schema
"""

import sqlalchemy as sa
from alembic import op

revision = "002_custom_tables"
down_revision = "001_pic_schema"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("username", sa.String(80), unique=True, index=True, nullable=False),
        sa.Column("hashed_password", sa.String(255), nullable=False),
        sa.Column("role", sa.String(30), server_default="applicant", nullable=False),
    )

    op.create_table(
        "process_definitions",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("definition_key", sa.String(120), unique=True, index=True, nullable=False),
        sa.Column("name", sa.String(160), index=True, nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("created_by", sa.String(80), server_default="system", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "process_definition_versions",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("definition_id", sa.Integer, sa.ForeignKey("process_definitions.id"), index=True, nullable=False),
        sa.Column("version", sa.Integer, index=True, nullable=False),
        sa.Column("status", sa.String(30), server_default="draft", nullable=False),
        sa.Column("checksum", sa.String(64), index=True, nullable=False),
        sa.Column("process_id", sa.String(160), nullable=False),
        sa.Column("process_name", sa.String(160), nullable=False),
        sa.Column("bpmn_xml", sa.Text, nullable=False),
        sa.Column("task_catalog_json", sa.Text, server_default="[]", nullable=False),
        sa.Column("validation_errors_json", sa.Text, server_default="[]", nullable=False),
        sa.Column("changelog", sa.Text, nullable=True),
        sa.Column("created_by", sa.String(80), server_default="system", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deployed_at", sa.DateTime(timezone=True), nullable=True),
        sa.UniqueConstraint("definition_id", "version", name="uq_process_definition_version"),
    )

    op.create_table(
        "process_deployments",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("definition_id", sa.Integer, sa.ForeignKey("process_definitions.id"), index=True, nullable=False),
        sa.Column("version_id", sa.Integer, sa.ForeignKey("process_definition_versions.id"), index=True, nullable=False),
        sa.Column("deployed_version", sa.Integer, index=True, nullable=False),
        sa.Column("deployment_status", sa.String(30), server_default="active", nullable=False),
        sa.Column("notes", sa.Text, nullable=True),
        sa.Column("deployed_by", sa.String(80), server_default="system", nullable=False),
        sa.Column("deployed_at", sa.DateTime(timezone=True), server_default=sa.func.now(), index=True, nullable=False),
    )

    op.create_table(
        "workflow_runs",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("process_name", sa.String(120), index=True, nullable=False),
        sa.Column("status", sa.String(40), server_default="created", nullable=False),
        sa.Column("current_task", sa.String(120), server_default="intake", nullable=False),
        sa.Column("started_by", sa.String(80), index=True, nullable=False),
        sa.Column("payload_json", sa.Text, server_default="{}", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )

    op.create_table(
        "pre_screener_drafts",
        sa.Column("id", sa.Integer, primary_key=True, index=True),
        sa.Column("user_id", sa.String(120), index=True, nullable=False),
        sa.Column("form_data_json", sa.Text, server_default="{}", nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("pre_screener_drafts")
    op.drop_table("workflow_runs")
    op.drop_table("process_deployments")
    op.drop_table("process_definition_versions")
    op.drop_table("process_definitions")
    op.drop_table("users")
