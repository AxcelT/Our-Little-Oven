from pydantic import BaseModel, ConfigDict

from app.models import Role


class LoginIn(BaseModel):
    name: str
    password: str


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    role: Role
