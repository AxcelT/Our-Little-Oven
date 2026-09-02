import enum
from datetime import date, datetime

from sqlalchemy import Enum, ForeignKey, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Role(str, enum.Enum):
    ADMIN = "admin"
    MEMBER = "member"
    GUEST = "guest"


class Stage(str, enum.Enum):
    RECIPE = "recipe"      # an idea we wrote down
    PROOFING = "proofing"  # planned, has a date
    BAKING = "baking"      # happening now
    COOLED = "cooled"      # done, lives on the rack


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(50), unique=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    role: Mapped[Role] = mapped_column(Enum(Role, name="role"))
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    loaves: Mapped[list["Loaf"]] = relationship(back_populates="author")


class Loaf(Base):
    __tablename__ = "loaves"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(String(200))
    body: Mapped[str] = mapped_column(Text, default="")
    stage: Mapped[Stage] = mapped_column(Enum(Stage, name="stage"), default=Stage.RECIPE)
    happens_on: Mapped[date | None] = mapped_column(default=None)
    author_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    author: Mapped[User] = relationship(back_populates="loaves")
    photos: Mapped[list["Photo"]] = relationship(
        back_populates="loaf", cascade="all, delete-orphan"
    )


class Photo(Base):
    __tablename__ = "photos"

    id: Mapped[int] = mapped_column(primary_key=True)
    loaf_id: Mapped[int] = mapped_column(ForeignKey("loaves.id"))
    s3_key: Mapped[str] = mapped_column(String(500))
    caption: Mapped[str] = mapped_column(String(300), default="")
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())

    loaf: Mapped[Loaf] = relationship(back_populates="photos")
