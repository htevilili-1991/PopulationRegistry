from sqlalchemy.orm import Session
from . import models, schemas

def get_citizen(db: Session, citizen_id: int):
    return db.query(models.Citizen).filter(models.Citizen.id == citizen_id).first()

def get_citizens(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Citizen).offset(skip).limit(limit).all()

def create_citizen(db: Session, citizen: schemas.CitizenCreate):
    db_citizen = models.Citizen(**citizen.dict())
    db.add(db_citizen)
    db.commit()
    db.refresh(db_citizen)
    return db_citizen
