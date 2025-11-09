import uuid
from sqlalchemy import Column, String, Date, BigInteger, Boolean, ForeignKey, Table, MetaData
from sqlalchemy.orm import relationship
from backend.database import Base

metadata = MetaData()

# Association table for Role-Permission many-to-many relationship
role_permissions = Table(
    'role_permissions',
    metadata,
    Column('role_id', BigInteger, ForeignKey('roles.id'), primary_key=True),
    Column('permission_id', BigInteger, ForeignKey('permissions.id'), primary_key=True)
)

class Citizen(Base):
    __tablename__ = "citizens"

    id = Column(BigInteger, primary_key=True, index=True)
    national_id = Column(String, unique=True, index=True, default=lambda: str(uuid.uuid4()))
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    date_of_birth = Column(Date)
    gender = Column(String)
    place_of_birth = Column(String)

class User(Base):
    __tablename__ = "users"

    id = Column(BigInteger, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    role_id = Column(BigInteger, ForeignKey("roles.id"))

    role = relationship("Role", back_populates="users")

class Role(Base):
    __tablename__ = "roles"

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)

    users = relationship("User", back_populates="role")
    permissions = relationship(
        "Permission",
        secondary=role_permissions,
        back_populates="roles"
    )

class Permission(Base):
    __tablename__ = "permissions"

    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)

    roles = relationship(
        "Role",
        secondary=role_permissions,
        back_populates="permissions"
    )

