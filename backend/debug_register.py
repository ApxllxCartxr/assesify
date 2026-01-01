import sys
from app.main import app
from app.models.users import db, User
import traceback

def debug_register():
    with app.app_context():
        print(f"DEBUG: Active DB URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
        try:
            print("Attempting to create user...")
            user = User(
                email="debug_v2@test.com",
                full_name="Debug User",
                is_teacher=False
            )
            user.set_password("password123")
            db.session.add(user)
            db.session.commit()
            print("SUCCESS: User created!")
        except Exception as e:
            with open("error_log.txt", "w") as f:
                f.write(f"Error: {str(e)}\n")
                f.write(traceback.format_exc())
            print("FAILURE: Check error_log.txt")

if __name__ == "__main__":
    debug_register()
