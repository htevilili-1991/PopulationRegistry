import uuid
from sqlalchemy import Column, String, Date, BigInteger
import uuid
from sqlalchemy import Column, String, Date, BigInteger
from backend.database import Base

class Citizen(Base):
    __tablename__ = "citizens"

    id = Column(BigInteger, primary_key=True, index=True)
    national_id = Column(String, unique=True, index=True, default=lambda: str(uuid.uuid4()))
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    date_of_birth = Column(Date)
    gender = Column(String)
    place_of_birth = Column(String)
