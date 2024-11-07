from sqlalchemy import create_engine, event
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session

from config import FlaskConfig

SQLALCHEMY_DATABASE_URL = FlaskConfig.PATH_TO_DB
engine = create_engine(SQLALCHEMY_DATABASE_URL, isolation_level='SERIALIZABLE')

SessionLocal = sessionmaker(autocommit=False,
                            autoflush=True,
                            bind=engine)
db_session = scoped_session(SessionLocal)
Base = declarative_base()


@event.listens_for(engine, "connect")
def set_sqlite_pragma(dbapi_connection, connection_record):
    cursor = dbapi_connection.cursor()
    cursor.execute("PRAGMA foreign_keys = ON")
    cursor.execute("PRAGMA synchronous = OFF")
    cursor.execute("PRAGMA journal_mode = WAL")
    cursor.execute("PRAGMA cache_size = 64000")
    cursor.execute("PRAGMA ignore_check_constraints = OFF")
    cursor.close()

@event.listens_for(engine, "begin")
def do_begin(conn):
    conn.execute("BEGIN")


def init_db():
    # import all modules here that might define models so that
    # they will be registered properly on the metadata.  Otherwise
    # you will have to import them first before calling init_db()
    Base.metadata.create_all(bind=engine)
