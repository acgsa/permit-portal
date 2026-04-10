"""Add login.gov OIDC and profile fields to users table.

Revision ID: 004_user_profile_logingov
Revises: 003_routing_interagency
"""

from alembic import op
import sqlalchemy as sa

revision = "004_user_profile_logingov"
down_revision = "003_routing_interagency"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("users", sa.Column("login_gov_uuid", sa.String(36), nullable=True))
    op.add_column("users", sa.Column("email", sa.String(255), nullable=True))
    op.add_column("users", sa.Column("first_name", sa.String(120), nullable=True))
    op.add_column("users", sa.Column("last_name", sa.String(120), nullable=True))
    op.add_column("users", sa.Column("phone", sa.String(30), nullable=True))
    op.add_column("users", sa.Column("address_street", sa.String(255), nullable=True))
    op.add_column("users", sa.Column("address_city", sa.String(120), nullable=True))
    op.add_column("users", sa.Column("address_state", sa.String(2), nullable=True))
    op.add_column("users", sa.Column("address_zip", sa.String(10), nullable=True))
    op.add_column("users", sa.Column("verified_at", sa.String(30), nullable=True))
    op.add_column("users", sa.Column("entity_type", sa.String(60), nullable=True))
    op.add_column("users", sa.Column("organization", sa.String(255), nullable=True))

    op.create_index("ix_users_login_gov_uuid", "users", ["login_gov_uuid"], unique=True)


def downgrade() -> None:
    op.drop_index("ix_users_login_gov_uuid", table_name="users")
    for col in [
        "organization", "entity_type", "verified_at",
        "address_zip", "address_state", "address_city", "address_street",
        "phone", "last_name", "first_name", "email", "login_gov_uuid",
    ]:
        op.drop_column("users", col)
