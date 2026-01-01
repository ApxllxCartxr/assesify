from app.main import app
from app.models.users import db, User
from app.models.classes import Class

with app.app_context():
    # Find or create a teacher
    teacher = User.query.filter_by(email="teacher@example.com").first()
    if not teacher:
        teacher = User(email="teacher@example.com", full_name="Ross Geller", is_teacher=True)
        teacher.set_password("dinosaur")
        db.session.add(teacher)
        db.session.commit()
    
    # Create class
    new_class = Class(name="Paleontology 101", teacher_id=teacher.id, section="PAL-101")
    db.session.add(new_class)
    db.session.commit()
    
    print(f"Created Class: {new_class.name}")
    print(f"Code: {new_class.code}")
