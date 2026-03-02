from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL, echo=True)

engine = create_engine(
    DATABASE_URL,
    echo=True,  # log consultas SQL
    pool_pre_ping=True,  
    pool_recycle=3600,  
    pool_size=5,  
    max_overflow=10,  
)


class Base(DeclarativeBase):
    pass