import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine, text
from sqlalchemy.engine import make_url
from sqlalchemy.orm import Session

from app.db import Base, get_db
from app.main import app
from app.models import Role, User
from app.services import throttle
from app.services.auth import hash_password

TEST_DATABASE_URL = os.environ.get(
    "TEST_DATABASE_URL", "postgresql+psycopg://oven:oven@localhost:5432/oven_test"
)


def _create_database_if_missing(url: str) -> None:
    url = make_url(url)
    admin = create_engine(url.set(database="postgres"), isolation_level="AUTOCOMMIT")
    with admin.connect() as conn:
        exists = conn.scalar(
            text("SELECT 1 FROM pg_database WHERE datname = :name"), {"name": url.database}
        )
        if not exists:
            conn.execute(text(f'CREATE DATABASE "{url.database}"'))
    admin.dispose()


@pytest.fixture(autouse=True)
def reset_throttle():
    throttle.reset()


@pytest.fixture(scope="session")
def engine():
    _create_database_if_missing(TEST_DATABASE_URL)
    engine = create_engine(TEST_DATABASE_URL)
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)
    yield engine
    engine.dispose()


@pytest.fixture
def db(engine):
    # Everything a test writes is rolled back at the end, even when routes commit.
    connection = engine.connect()
    transaction = connection.begin()
    session = Session(bind=connection, join_transaction_mode="create_savepoint")
    yield session
    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db):
    app.dependency_overrides[get_db] = lambda: db
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()


@pytest.fixture
def make_user(db):
    def make(name: str, password: str = "password123", role: Role = Role.MEMBER) -> User:
        user = User(name=name, password_hash=hash_password(password), role=role)
        db.add(user)
        db.commit()
        return user

    return make
