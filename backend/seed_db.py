from app.main import app
from app.models.users import db
from app.models.lesson import Lesson
from app.models.quiz import Quiz
from ml.train.quiz_gen import generate_quiz

def seed():
    with app.app_context():
        # Create a Lesson
        lesson_content = (
            "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods "
            "from carbon dioxide and water. Photosynthesis in plants generally involves the green pigment chlorophyll and "
            "generates oxygen as a byproduct."
        )
        
        lesson = Lesson(
            title="Introduction to Photosynthesis",
            content=lesson_content,
            topic="Biology",
            class_id=None 
        )
        db.session.add(lesson)
        db.session.commit()
        print(f"Created Lesson: {lesson.id} - {lesson.title}")

        # Generate Quiz
        # We manually call generate_quiz as in the route
        questions = generate_quiz(lesson_content) # Now returns list with 'options' and 'correct_answer'
        
        quiz = Quiz(
            lesson_id=lesson.id,
            questions=questions
        )
        db.session.add(quiz)
        db.session.commit()
        print(f"Created Quiz: {quiz.id} with {len(questions)} multiple-choice questions")
        print("Sample Q:", questions[0])

if __name__ == "__main__":
    seed()
