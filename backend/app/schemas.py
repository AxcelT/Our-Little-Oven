from pydantic import BaseModel, ConfigDict, Field

from app.models import Role


class LoginIn(BaseModel):
    name: str = Field(max_length=50)
    password: str = Field(max_length=256)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    role: Role
