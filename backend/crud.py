from sqlalchemy.orm import Session
from sqlalchemy.orm import Session
from backend import models, schemas

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

def update_citizen(db: Session, citizen_id: int, citizen: schemas.CitizenCreate):
    db_citizen = db.query(models.Citizen).filter(models.Citizen.id == citizen_id).first()
    if db_citizen:
        for key, value in citizen.dict().items():
            setattr(db_citizen, key, value)
        db.commit()
        db.refresh(db_citizen)
    return db_citizen

def delete_citizen(db: Session, citizen_id: int):
    db_citizen = db.query(models.Citizen).filter(models.Citizen.id == citizen_id).first()
    if db_citizen:
        db.delete(db_citizen)
        db.commit()
    return db_citizen
