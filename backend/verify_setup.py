from app.main import app
from app.models.users import db, User
from app.models.classes import Class

def setup_data():
    with app.app_context():
        print(f"DB URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
        # 1. Create Teacher
        teacher_email = "teacher_verify@example.com"
        teacher = User.query.filter_by(email=teacher_email).first()
        if not teacher:
            teacher = User(email=teacher_email, full_name="Verify Teacher", is_teacher=True)
            teacher.set_password("password123")
            db.session.add(teacher)
            db.session.commit()
            print(f"Created teacher: {teacher_email}")
        else:
            print(f"Teacher already exists: {teacher_email}")

        # 2. Create Class
        class_name = "Verification 101"
        test_class = Class.query.filter_by(name=class_name).first()
        if not test_class:
            test_class = Class(name=class_name, teacher_id=teacher.id, section="Alpha")
            db.session.add(test_class)
            db.session.commit()
            print(f"Created class: {class_name} with CODE: {test_class.code}")
        else:
            print(f"Class already exists: {class_name} with CODE: {test_class.code}")

if __name__ == "__main__":
    setup_data()
