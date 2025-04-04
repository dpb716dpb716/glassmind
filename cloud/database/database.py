# cloud/database/database.py
from databases import Database
import sqlalchemy

# Async URL for running async queries with the 'databases' package
DATABASE_URL_ASYNC = "sqlite+aiosqlite:///./test.db"
# Sync URL for creating tables using SQLAlchemy's engine
DATABASE_URL_SYNC = "sqlite:///./test.db"

# Create an async Database instance
database = Database(DATABASE_URL_ASYNC)

# SQLAlchemy metadata object to hold our table definitions
metadata = sqlalchemy.MetaData()

# Define a table for profiles
profiles = sqlalchemy.Table(
    "profiles",
    metadata,
    sqlalchemy.Column("id", sqlalchemy.Integer, primary_key=True),
    sqlalchemy.Column("name", sqlalchemy.String, index=True),
    sqlalchemy.Column("emotion", sqlalchemy.String, index=True),
)

# Create a synchronous engine for metadata creation
engine = sqlalchemy.create_engine(
    DATABASE_URL_SYNC, connect_args={"check_same_thread": False}
)

# Create tables (if they don't already exist)
metadata.create_all(engine)