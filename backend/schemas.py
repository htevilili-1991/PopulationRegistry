from pydantic import BaseModel
from datetime import date

class CitizenBase(BaseModel):
    first_name: str
    last_name: str
    date_of_birth: date
    gender: str
    place_of_birth: str

class CitizenCreate(CitizenBase):
    pass

class Citizen(CitizenBase):
    id: int
    national_id: str

    class Config:
        orm_mode = True
