import hashlib
import secrets
from datetime import datetime, timedelta, timezone

from argon2 import PasswordHasher
from argon2.exceptions import VerificationError
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.models import LoginSession, User

hasher = PasswordHasher()

# Checked against when the name doesn't exist, so a wrong name takes as long as a wrong password.
DUMMY_HASH = hasher.hash("not-a-real-password")


def hash_password(password: str) -> str:
    return hasher.hash(password)


def verify_password(password_hash: str, password: str) -> bool:
    try:
        return hasher.verify(password_hash, password)
    except VerificationError:
        return False


def authenticate(db: Session, name: str, password: str) -> User | None:
    user = db.scalar(select(User).where(User.name == name.strip().lower()))
    if user is None:
        verify_password(DUMMY_HASH, password)
        return None
    return user if verify_password(user.password_hash, password) else None


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


def create_session(db: Session, user: User) -> str:
    token = secrets.token_urlsafe(32)
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.session_days)
    db.add(LoginSession(token_hash=_hash_token(token), user_id=user.id, expires_at=expires_at))
    db.commit()
    return token


def get_user_by_token(db: Session, token: str) -> User | None:
    login = db.get(LoginSession, _hash_token(token))
    if login is None:
        return None
    if login.expires_at <= datetime.now(timezone.utc):
        db.delete(login)
        db.commit()
        return None
    return login.user


def delete_session(db: Session, token: str) -> None:
    login = db.get(LoginSession, _hash_token(token))
    if login is not None:
        db.delete(login)
        db.commit()
