from app.main import app
from app.models.users import User

with app.app_context():
    user = User.query.filter_by(email='testuser@example.com').first()
    if user:
        print(f"User found: {user.email}")
        print(f"Password Hash: {user.password_hash}")
        is_valid = user.check_password('password123')
        print(f"Password 'password123' valid? {is_valid}")
    else:
        print("User not found")
