import pytest
from fastapi import Depends, FastAPI
from fastapi.testclient import TestClient

from app.deps import get_db, require_role
from app.models import Role
from app.routes import auth
from app.services import throttle


def login(client, name, password="password123"):
    return client.post("/api/login", json={"name": name, "password": password})


def test_login_then_me(client, make_user):
    make_user("zoie")

    response = login(client, "Zoie")
    assert response.status_code == 204
    assert "oven_session" in response.cookies

    me = client.get("/api/me")
    assert me.status_code == 200
    assert me.json()["name"] == "zoie"
    assert me.json()["role"] == "member"


def test_wrong_password(client, make_user):
    make_user("zoie")
    assert login(client, "zoie", "nope").status_code == 401


def test_unknown_name(client):
    assert login(client, "nobody").status_code == 401


def test_me_without_cookie(client):
    assert client.get("/api/me").status_code == 401


def test_logout(client, make_user):
    make_user("zoie")
    login(client, "zoie")

    assert client.post("/api/logout").status_code == 204
    assert client.get("/api/me").status_code == 401


@pytest.fixture
def role_client(db):
    # A tiny app with login plus one write route guarded by require_role.
    test_app = FastAPI()
    test_app.include_router(auth.router)

    @test_app.post("/write")
    def write(user=Depends(require_role(Role.ADMIN, Role.MEMBER))):
        return {"ok": True}

    test_app.dependency_overrides[get_db] = lambda: db
    return TestClient(test_app)


def test_guest_blocked_by_require_role(role_client, make_user):
    make_user("guest", role=Role.GUEST)
    login(role_client, "guest")
    assert role_client.post("/write").status_code == 403


def test_member_allowed_by_require_role(role_client, make_user):
    make_user("zoie")
    login(role_client, "zoie")
    assert role_client.post("/write").status_code == 200


def test_throttle_blocks_after_limit(client, make_user):
    make_user("zoie")
    for _ in range(throttle.LIMIT):
        assert login(client, "zoie", "nope").status_code == 401

    blocked = login(client, "zoie")  # right password, still blocked
    assert blocked.status_code == 429
    assert int(blocked.headers["Retry-After"]) > 0


def test_throttle_window_expires(client, make_user, monkeypatch):
    make_user("zoie")
    for _ in range(throttle.LIMIT):
        login(client, "zoie", "nope")

    later = throttle._now() + throttle.WINDOW + 1
    monkeypatch.setattr(throttle, "_now", lambda: later)
    assert login(client, "zoie").status_code == 204


def test_success_clears_throttle(client, make_user):
    make_user("zoie")
    for _ in range(throttle.LIMIT - 1):
        login(client, "zoie", "nope")
    assert login(client, "zoie").status_code == 204

    for _ in range(throttle.LIMIT - 1):
        assert login(client, "zoie", "nope").status_code == 401
