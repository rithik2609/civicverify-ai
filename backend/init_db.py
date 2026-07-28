from database.database import engine
from models.investigation import Investigation
from database.database import Base

Base.metadata.create_all(
    bind=engine
)

print(
    "Database initialized"
)