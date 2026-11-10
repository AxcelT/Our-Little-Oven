from fastapi import APIRouter, Cookie, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session

from app.config import settings
from app.deps import COOKIE_NAME, current_user, get_db
from app.models import User
from app.schemas import LoginIn, UserOut
from app.services import auth, throttle

router = APIRouter(prefix="/api")


@router.post("/login", status_code=204)
def login(body: LoginIn, request: Request, response: Response, db: Session = Depends(get_db)):
    ip = request.client.host if request.client else "unknown"
    if wait := throttle.try_attempt(ip):
        raise HTTPException(status_code=429, detail="Too many tries", headers={"Retry-After": str(wait)})
    user = auth.authenticate(db, body.name, body.password)
    if user is None:
        raise HTTPException(status_code=401, detail="Wrong name or password")
    throttle.clear(ip)
    response.set_cookie(
        COOKIE_NAME,
        auth.create_session(db, user),
        max_age=settings.session_days * 24 * 60 * 60,
        httponly=True,
        samesite="lax",
        secure=settings.cookie_secure,
    )


@router.post("/logout", status_code=204)
def logout(
    response: Response,
    oven_session: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    if oven_session:
        auth.delete_session(db, oven_session)
    response.delete_cookie(COOKIE_NAME)


@router.get("/me", response_model=UserOut)
def me(user: User = Depends(current_user)):
    return user
