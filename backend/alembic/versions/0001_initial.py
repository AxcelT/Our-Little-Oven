"""initial: users, loaves, photos

Revision ID: 0001
Revises:
"""
from alembic import op
import sqlalchemy as sa

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None

role = sa.Enum("ADMIN", "MEMBER", "GUEST", name="role")
stage = sa.Enum("RECIPE", "PROOFING", "BAKING", "COOLED", name="stage")


def upgrade():
    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(50), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(255), nullable=False),
        sa.Column("role", role, nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_table(
        "loaves",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(200), nullable=False),
        sa.Column("body", sa.Text(), nullable=False),
        sa.Column("stage", stage, nullable=False),
        sa.Column("happens_on", sa.Date(), nullable=True),
        sa.Column("author_id", sa.Integer(), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )
    op.create_table(
        "photos",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("loaf_id", sa.Integer(), sa.ForeignKey("loaves.id"), nullable=False),
        sa.Column("s3_key", sa.String(500), nullable=False),
        sa.Column("caption", sa.String(300), nullable=False),
        sa.Column("created_at", sa.DateTime(), server_default=sa.func.now(), nullable=False),
    )


def downgrade():
    op.drop_table("photos")
    op.drop_table("loaves")
    op.drop_table("users")
    stage.drop(op.get_bind())
    role.drop(op.get_bind())
