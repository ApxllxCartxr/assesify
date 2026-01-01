from app.models.users import db
from datetime import datetime

class Quiz(db.Model):
    __tablename__ = 'quizzes'

    id = db.Column(db.Integer, primary_key=True)
    lesson_id = db.Column(db.Integer, db.ForeignKey('lessons.id'), nullable=False)
    questions = db.Column(db.JSON, nullable=False)  # Stores the list of questions/answers
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "lesson_id": self.lesson_id,
            "questions": self.questions,
            "created_at": self.created_at.isoformat()
        }
