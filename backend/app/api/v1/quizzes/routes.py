from flask import Blueprint, jsonify, request
from app.models.users import db, User
from app.models.quiz import Quiz
from app.models.submission import QuizAttempt, QuizAnswer

quizzes_bp = Blueprint('quizzes', __name__)

@quizzes_bp.route('/<int:quiz_id>', methods=['GET'])
def get_quiz(quiz_id):
    quiz = Quiz.query.get_or_404(quiz_id)
    return jsonify(quiz.to_dict())

@quizzes_bp.route('/recent', methods=['GET'])
def get_recent_quizzes():
    # Return last 5 quizzes
    quizzes = Quiz.query.order_by(Quiz.created_at.desc()).limit(5).all()
    results = []
    for q in quizzes:
        # Get lesson title
        from app.models.lesson import Lesson
        lesson = Lesson.query.get(q.lesson_id)
        results.append({
            "id": q.id,
            "title": lesson.title if lesson else f"Quiz {q.id}",
            "topic": lesson.topic if lesson else "General",
            "questions_count": len(q.questions) if q.questions else 0,
            "created_at": q.created_at.isoformat()
        })
    return jsonify(results)

@quizzes_bp.route('/<int:quiz_id>/submit', methods=['POST'])
def submit_quiz(quiz_id):
    data = request.get_json()
    # Expect: { "user_id": 1, "class_id": optional, "answers": [{ "question": "...", "answer": "...", "is_correct": true }] }
    
    quiz = Quiz.query.get_or_404(quiz_id)
    
    user_id = data.get('user_id')
    class_id = data.get('class_id')
    answers_data = data.get('answers', [])
    
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    # Check if user
    user = User.query.get(user_id)
    if user and user.is_teacher:
        # Teacher: Do not save attempt
        return jsonify({
            "message": "Quiz completed (Teacher Mode - Not Saved)",
            "score": 100.0 # simple placeholder
        }), 200

    # Calculate score
    total_q = len(answers_data)
    correct_c = sum(1 for a in answers_data if a.get('is_correct'))
    score = (correct_c / total_q * 100) if total_q > 0 else 0.0

    attempt = QuizAttempt(
        user_id=user_id,
        quiz_id=quiz.id,
        class_id=class_id,
        score=score
    )
    
    db.session.add(attempt)
    db.session.flush() # get ID

    for ans in answers_data:
        is_correct = ans.get('is_correct', False)
        q_ans = QuizAnswer(
            attempt_id=attempt.id,
            question_text=ans.get('question'),
            student_answer_text=ans.get('answer'),
            is_correct=is_correct
        )
        db.session.add(q_ans)
        
        # Gamification: Decrease health on wrong answer
        if not is_correct and user:
            user.health = max(0, user.health - 1)

    # Gamification: Streak logic
    diamonds_earned = 0
    if user:
        from datetime import date, timedelta
        today = date.today()
        if user.last_active_date is None:
            user.streak = 1
        elif user.last_active_date == today:
            pass # already active today
        elif user.last_active_date == today - timedelta(days=1):
            user.streak += 1
        else:
            # Missed at least one day
            user.streak = 1 # starting new streak 
        
        user.last_active_date = today
        
        # Gamification: Diamonds (simple logic: +5 per correct answer)
        diamonds_earned = correct_c * 5
        user.diamonds += diamonds_earned

    db.session.commit()
    
    return jsonify({
        "message": "Quiz submitted successfully",
        "attempt_id": attempt.id,
        "score": score,
        "health": user.health if user else 5,
        "streak": user.streak if user else 0,
        "diamonds_earned": diamonds_earned
    }), 201
