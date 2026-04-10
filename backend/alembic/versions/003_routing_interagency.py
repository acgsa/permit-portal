"""Add agency_routing_rules and agency_api_keys tables

Revision ID: 003
Revises: 002_custom_tables
Create Date: 2026-04-10
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = "003_routing_interagency"
down_revision = "002_custom_tables"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "agency_routing_rules",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("trigger_type", sa.String(40), nullable=False),
        sa.Column("trigger_value", sa.String(120), nullable=False),
        sa.Column("agency_code", sa.String(20), nullable=False, index=True),
        sa.Column("agency_name", sa.String(200), nullable=False),
        sa.Column("agency_role", sa.String(40), nullable=False, server_default="lead"),
        sa.Column("review_name", sa.String(200), nullable=True),
        sa.Column("review_authority", sa.String(200), nullable=True),
        sa.Column("review_description", sa.Text(), nullable=True),
        sa.Column("estimated_days", sa.Integer(), nullable=True),
        sa.Column("form_id", sa.String(40), nullable=True),
        sa.Column("form_title", sa.String(200), nullable=True),
        sa.Column("priority", sa.Integer(), nullable=False, server_default="0"),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
    )

    op.create_table(
        "agency_api_keys",
        sa.Column("id", sa.Integer(), primary_key=True, autoincrement=True),
        sa.Column("agency_code", sa.String(20), nullable=False, index=True),
        sa.Column("agency_name", sa.String(200), nullable=False),
        sa.Column("api_key_hash", sa.String(256), nullable=False),
        sa.Column("permissions", sa.Text(), nullable=False, server_default="read,write"),
        sa.Column("webhook_url", sa.String(500), nullable=True),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.func.now(),
            nullable=False,
        ),
        sa.Column("revoked_at", sa.DateTime(timezone=True), nullable=True),
    )


def downgrade() -> None:
    op.drop_table("agency_api_keys")
    op.drop_table("agency_routing_rules")
