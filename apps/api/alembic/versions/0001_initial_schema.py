"""initial schema

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-08-18
"""

from alembic import op
import sqlalchemy as sa

revision = "0001_initial_schema"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "threads",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("user_id", sa.String(length=255), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index(op.f("ix_threads_id"), "threads", ["id"], unique=False)
    op.create_index(op.f("ix_threads_user_id"), "threads", ["user_id"], unique=False)
    op.create_index(op.f("ix_threads_expires_at"), "threads", ["expires_at"], unique=False)

    op.create_table(
        "messages",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("thread_id", sa.Integer(), sa.ForeignKey("threads.id"), nullable=False),
        sa.Column("role", sa.String(length=32), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index(op.f("ix_messages_id"), "messages", ["id"], unique=False)
    op.create_index(op.f("ix_messages_thread_id"), "messages", ["thread_id"], unique=False)

    op.create_table(
        "feedback",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("thread_id", sa.Integer(), sa.ForeignKey("threads.id"), nullable=False),
        sa.Column("message_id", sa.Integer(), sa.ForeignKey("messages.id"), nullable=True),
        sa.Column("rating", sa.String(length=16), nullable=False),
        sa.Column("comment", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index(op.f("ix_feedback_id"), "feedback", ["id"], unique=False)
    op.create_index(op.f("ix_feedback_thread_id"), "feedback", ["thread_id"], unique=False)
    op.create_index(op.f("ix_feedback_message_id"), "feedback", ["message_id"], unique=False)

    op.create_table(
        "ingestion_records",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("source_url", sa.String(length=2048), nullable=False),
        sa.Column("source_hash", sa.String(length=64), nullable=False),
        sa.Column("source_type", sa.String(length=64), nullable=False),
        sa.Column("status", sa.String(length=32), nullable=False, server_default="pending"),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index(op.f("ix_ingestion_records_id"), "ingestion_records", ["id"], unique=False)
    op.create_index(op.f("ix_ingestion_records_source_url"), "ingestion_records", ["source_url"], unique=False)
    op.create_index(op.f("ix_ingestion_records_source_hash"), "ingestion_records", ["source_hash"], unique=False)

    op.create_table(
        "resource_sources",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=255), nullable=False),
        sa.Column("source_type", sa.String(length=64), nullable=False),
        sa.Column("url", sa.String(length=2048), nullable=False, unique=True),
        sa.Column("description", sa.Text(), nullable=True),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("true")),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.create_index(op.f("ix_resource_sources_id"), "resource_sources", ["id"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_ingestion_records_source_hash"), table_name="ingestion_records")
    op.drop_index(op.f("ix_ingestion_records_source_url"), table_name="ingestion_records")
    op.drop_index(op.f("ix_ingestion_records_id"), table_name="ingestion_records")
    op.drop_table("ingestion_records")

    op.drop_index(op.f("ix_resource_sources_id"), table_name="resource_sources")
    op.drop_table("resource_sources")

    op.drop_index(op.f("ix_feedback_message_id"), table_name="feedback")
    op.drop_index(op.f("ix_feedback_thread_id"), table_name="feedback")
    op.drop_index(op.f("ix_feedback_id"), table_name="feedback")
    op.drop_table("feedback")

    op.drop_index(op.f("ix_messages_thread_id"), table_name="messages")
    op.drop_index(op.f("ix_messages_id"), table_name="messages")
    op.drop_table("messages")

    op.drop_index(op.f("ix_threads_expires_at"), table_name="threads")
    op.drop_index(op.f("ix_threads_user_id"), table_name="threads")
    op.drop_index(op.f("ix_threads_id"), table_name="threads")
    op.drop_table("threads")
