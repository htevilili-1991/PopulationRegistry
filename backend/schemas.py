from pydantic import BaseModel
from datetime import date
from typing import Optional

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
