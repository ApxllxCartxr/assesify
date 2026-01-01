from app.models.users import db
from datetime import datetime

class Lesson(db.Model):
    __tablename__ = 'lessons'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    topic = db.Column(db.String(100), nullable=True)
    file_path = db.Column(db.String(500), nullable=True) # Path to the uploaded file
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Optional connection to class
    class_id = db.Column(db.Integer, db.ForeignKey('classes.id'), nullable=True)
    teacher_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True)
    
    # Relationship to quizzes
    quizzes = db.relationship('Quiz', backref='lesson', lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "content": self.content,
            "topic": self.topic,
            "file_path": self.file_path,
            "class_id": self.class_id,
            "teacher_id": self.teacher_id,
            "created_at": self.created_at.isoformat()
        }
