from pydantic import BaseModel
from datetime import date
from typing import Optional, List

class CitizenBase(BaseModel):
    national_id: str
    first_name: str
    last_name: str
    date_of_birth: date
    gender: str
    place_of_birth: str

class CitizenCreate(CitizenBase):
    pass

class CitizenUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    place_of_birth: Optional[str] = None

class Citizen(CitizenBase):
    id: int
    national_id: str

    class Config:
        orm_mode = True

class PermissionBase(BaseModel):
    name: str

class PermissionCreate(PermissionBase):
    pass

class Permission(PermissionBase):
    id: int

    class Config:
        orm_mode = True

class RoleBase(BaseModel):
    name: str

class RoleCreate(RoleBase):
    permission_ids: List[int] = []

class Role(RoleBase):
    id: int
    permissions: List[Permission] = []

    class Config:
        orm_mode = True

class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str
    role_id: int

class User(UserBase):
    id: int
    is_active: bool
    role: Role

    class Config:
        orm_mode = True
