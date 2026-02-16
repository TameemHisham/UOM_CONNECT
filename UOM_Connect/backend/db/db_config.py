# db/db_config.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from dotenv import load_dotenv
import os
# from sqlalchemy.pool import NullPool
from sqlalchemy.exc import OperationalError
import time

# Load environment variables from .env
load_dotenv()


USER = os.getenv("user")
PASSWORD = os.getenv("password")
HOST = os.getenv("host")
PORT = os.getenv("port")
DBNAME = os.getenv("dbname")
# PostgreSQL connection
# DATABASE_URL = f"postgresql+psycopg2://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}?sslmode=require"
# MySQL connection
DATABASE_URL = f"mysql+pymysql://{USER}:{PASSWORD}@{HOST}:{PORT}/{DBNAME}"

while True:
    try:
        engine = create_engine(DATABASE_URL, pool_pre_ping=True)
        conn = engine.connect()
        print("Connected!")
        break
    except OperationalError:
        print("Connection failed. Retrying in 5 seconds...")
        time.sleep(5)


class Base(DeclarativeBase):
    pass


SessionLocal = sessionmaker(bind=engine)
