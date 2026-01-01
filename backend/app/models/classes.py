from app.models.users import db
import random
import string

enrollments = db.Table('enrollments',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('class_id', db.Integer, db.ForeignKey('classes.id'), primary_key=True)
)

class Class(db.Model):
    __tablename__ = 'classes'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    section = db.Column(db.String(50))
    code = db.Column(db.String(10), unique=True, nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    
    # Relationships
    teacher = db.relationship('User', backref='taught_classes', foreign_keys=[teacher_id])
    students = db.relationship('User', secondary=enrollments, backref=db.backref('enrolled_classes', lazy='dynamic'))

    def __init__(self, name, teacher_id, section=None):
        self.name = name
        self.teacher_id = teacher_id
        self.section = section
        self.code = self.generate_code()

    def generate_code(self):
        """Generates a random 6-character code"""
        return ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
