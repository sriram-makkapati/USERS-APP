from sqlalchemy import create_engine, Column, Integer, String, DECIMAL, Date
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
import urllib.parse

dbuser = "databuddy"
dbpassword = "Admin@123"
host = "databuddyserver.postgres.database.azure.com"
port = 5432

def initialize_connection(database):
    password_s = urllib.parse.quote_plus(dbpassword)
    engine = create_engine(
        'postgresql://{user}:{password}@{host}:{port}/{database}'.format(
            user=dbuser,
            password=password_s,
            host=host,
            port=port,
            database=database,
        )
    )
    Session = sessionmaker(bind=engine)
    session = Session()
    Base = declarative_base()

    return engine, session, Base