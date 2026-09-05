from alembic import context
from sqlalchemy import create_engine

from app.config import settings
from app.db import Base
from app import models  # noqa: F401  -- registers tables on Base.metadata

target_metadata = Base.metadata


def run_migrations_online():
    engine = create_engine(settings.database_url)
    with engine.connect() as connection:
        context.configure(connection=connection, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()


run_migrations_online()
