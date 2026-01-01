from app.main import app
from app.models.users import db
from sqlalchemy import inspect

def check_tables():
    with app.app_context():
        inspector = inspect(db.engine)
        print("Tables in DB:", inspector.get_table_names())

if __name__ == "__main__":
    check_tables()
