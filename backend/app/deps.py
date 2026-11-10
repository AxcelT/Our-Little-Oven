from fastapi import Cookie, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Role, User
from app.services import auth

COOKIE_NAME = "oven_session"


def current_user(
    oven_session: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
) -> User:
    user = auth.get_user_by_token(db, oven_session) if oven_session else None
    if user is None:
        raise HTTPException(status_code=401, detail="Not signed in")
    return user


def require_role(*roles: Role):
    def check(user: User = Depends(current_user)) -> User:
        if user.role not in roles:
            raise HTTPException(status_code=403, detail="Not allowed")
        return user

    return check
