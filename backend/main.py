from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from fastapi import Depends, FastAPI, HTTPException
from sqlalchemy.orm import Session

from backend import crud, models, schemas
from backend.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/citizens/", response_model=schemas.Citizen)
def create_citizen(citizen: schemas.CitizenCreate, db: Session = Depends(get_db)):
    return crud.create_citizen(db=db, citizen=citizen)

@app.get("/citizens/", response_model=list[schemas.Citizen])
def read_citizens(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    citizens = crud.get_citizens(db, skip=skip, limit=limit)
    return citizens

@app.get("/citizens/{citizen_id}", response_model=schemas.Citizen)
def read_citizen(citizen_id: int, db: Session = Depends(get_db)):
    db_citizen = crud.get_citizen(db, citizen_id=citizen_id)
    if db_citizen is None:
        raise HTTPException(status_code=404, detail="Citizen not found")
    return db_citizen
