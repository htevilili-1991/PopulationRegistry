from datetime import timedelta, datetime
from typing import List
from jose import jwt # Import jwt from jose

from fastapi import Depends, FastAPI, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from backend import crud, models, schemas, security
from backend.database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:3000", # React app default port
    "http://localhost:3001", # React app if it runs on 3001
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Security settings
SECRET_KEY = "your-secret-key" # TODO: Change this to an environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM) # Use jwt.encode directly
    return encoded_jwt

async def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = security.jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = schemas.TokenData(username=username)
    except security.JWTError:
        raise credentials_exception
    user = crud.get_user_by_username(db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

async def get_current_active_user(current_user: schemas.User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

async def get_current_active_admin_user(current_user: schemas.User = Depends(get_current_user)):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    if current_user.role.name != "admin":
        raise HTTPException(status_code=403, detail="Not an admin user")
    return current_user

def check_user_permission(permission_name: str):
    def _check_permission(current_user: schemas.User = Depends(get_current_active_user)):
        for role_permission in current_user.role.permissions:
            if role_permission.name == permission_name:
                return True
        raise HTTPException(status_code=403, detail=f"User does not have permission: {permission_name}")
    return _check_permission

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    user = crud.get_user_by_username(db, username=form_data.username)
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/register/", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/me/", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_active_user)):
    return current_user

# Citizen Endpoints (Protected)
@app.post("/citizens/", response_model=schemas.Citizen, dependencies=[Depends(check_user_permission("create_citizen"))])
def create_citizen(citizen: schemas.CitizenCreate, db: Session = Depends(get_db)):
    return crud.create_citizen(db=db, citizen=citizen)

@app.get("/citizens/", response_model=List[schemas.Citizen], dependencies=[Depends(check_user_permission("view_citizen"))])
def read_citizens(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    citizens = crud.get_citizens(db, skip=skip, limit=limit)
    return citizens

@app.get("/citizens/{citizen_id}", response_model=schemas.Citizen, dependencies=[Depends(check_user_permission("view_citizen"))])
def read_citizen(citizen_id: int, db: Session = Depends(get_db)):
    db_citizen = crud.get_citizen(db, citizen_id=citizen_id)
    if db_citizen is None:
        raise HTTPException(status_code=404, detail="Citizen not found")
    return db_citizen

@app.put("/citizens/{citizen_id}", response_model=schemas.Citizen, dependencies=[Depends(check_user_permission("edit_citizen"))])
def update_citizen(citizen_id: int, citizen: schemas.CitizenUpdate, db: Session = Depends(get_db)):
    db_citizen = crud.update_citizen(db=db, citizen_id=citizen_id, citizen=citizen)
    if db_citizen is None:
        raise HTTPException(status_code=404, detail="Citizen not found")
    return db_citizen

@app.delete("/citizens/{citizen_id}", response_model=schemas.Citizen, dependencies=[Depends(check_user_permission("delete_citizen"))])
def delete_citizen(citizen_id: int, db: Session = Depends(get_db)):
    db_citizen = crud.delete_citizen(db=db, citizen_id=citizen_id)
    if db_citizen is None:
        raise HTTPException(status_code=404, detail="Citizen not found")
    return db_citizen

# User Management Endpoints (Admin only)
@app.get("/users/", response_model=List[schemas.User], dependencies=[Depends(get_current_active_admin_user)])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.get("/users/{user_id}", response_model=schemas.User, dependencies=[Depends(get_current_active_admin_user)])
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

# Role Management Endpoints (Admin only)
@app.post("/roles/", response_model=schemas.Role, dependencies=[Depends(get_current_active_admin_user)])
def create_role(role: schemas.RoleCreate, db: Session = Depends(get_db)):
    db_role = crud.get_role_by_name(db, name=role.name)
    if db_role:
        raise HTTPException(status_code=400, detail="Role name already registered")
    return crud.create_role(db=db, role=role)

@app.get("/roles/", response_model=List[schemas.Role], dependencies=[Depends(get_current_active_admin_user)])
def read_roles(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    roles = crud.get_roles(db, skip=skip, limit=limit)
    return roles

@app.get("/roles/{role_id}", response_model=schemas.Role, dependencies=[Depends(get_current_active_admin_user)])
def read_role(role_id: int, db: Session = Depends(get_db)):
    db_role = crud.get_role(db, role_id=role_id)
    if db_role is None:
        raise HTTPException(status_code=404, detail="Role not found")
    return db_role

# Permission Management Endpoints (Admin only)
@app.post("/permissions/", response_model=schemas.Permission, dependencies=[Depends(get_current_active_admin_user)])
def create_permission(permission: schemas.PermissionCreate, db: Session = Depends(get_db)):
    db_permission = crud.get_permission_by_name(db, name=permission.name)
    if db_permission:
        raise HTTPException(status_code=400, detail="Permission name already registered")
    return crud.create_permission(db=db, permission=permission)

@app.get("/permissions/", response_model=List[schemas.Permission], dependencies=[Depends(get_current_active_admin_user)])
def read_permissions(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    permissions = crud.get_permissions(db, skip=skip, limit=limit)
    return permissions
