from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from pydantic import ValidationError
from app.models.users import db, User
from app.schemas.teacher import InviteStudentSchema
from werkzeug.utils import secure_filename
import os
import time

from ml.utils.pdf_utils import extract_text_from_pdf
from ml.utils.text_cleaner import clean_text
from ml.train.quiz_gen import chunk_text, generate_quiz

ALLOWED_EXTENSIONS = {"pdf", "txt", "docx"}
MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

teacher_bp = Blueprint("teacher", __name__)

@teacher_bp.route("/invite", methods=["POST"])
@jwt_required()
def invite_student():
    current_user_id = int(get_jwt_identity())
    teacher = User.query.get(current_user_id)

    if not teacher or not teacher.is_teacher:
        return jsonify({"msg": "Only teachers can invite students"}), 403

    try:
        data = InviteStudentSchema(**request.json)
    except ValidationError as e:
        return jsonify(e.errors()), 400

    if User.query.filter_by(email=data.email).first():
        return jsonify({"msg": "Student already exists"}), 400

    student = User(
        email=data.email,
        full_name=data.full_name,
        is_teacher=False
    )
    student.set_password("TempPassword123!")  # temp password
    db.session.add(student)
    db.session.commit()

    # TODO: send email with login link + temp password

    return jsonify({"msg": f"Student {data.full_name} invited successfully"}), 201


@teacher_bp.route("/materials", methods=["POST"])
# Note: this endpoint accepts uploads and processes them synchronously for now
def upload_material():
    # Allow authenticated teachers, but also accept anonymous uploads for quick dev testing
    current_user_id = get_jwt_identity()
    teacher = None
    if current_user_id:
        try:
            teacher = User.query.get(int(current_user_id))
        except Exception:
            teacher = None

    if "file" not in request.files:
        return jsonify({"msg": "file is required"}), 400

    file = request.files["file"]
    filename = secure_filename(file.filename or "")
    if not filename or "." not in filename:
        return jsonify({"msg": "Invalid filename"}), 400

    ext = filename.rsplit(".", 1)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return jsonify({"msg": "Unsupported file type"}), 400

    # Check file size
    file.seek(0, os.SEEK_END)
    size = file.tell()
    file.seek(0)
    if size > MAX_FILE_SIZE:
        return jsonify({"msg": "File too large"}), 400

    # Save file to backend/uploads
    project_root = os.path.abspath(os.path.join(current_app.root_path, ".."))
    uploads_dir = os.path.join(project_root, "uploads")
    os.makedirs(uploads_dir, exist_ok=True)

    timestamp = int(time.time())
    saved_name = f"{(teacher.id if teacher else 'anon')}_{timestamp}_{filename}"
    saved_path = os.path.join(uploads_dir, saved_name)
    file.save(saved_path)

    # Extract text based on extension
    try:
        if ext == "pdf":
            text = extract_text_from_pdf(saved_path)
        elif ext == "txt":
            with open(saved_path, "r", encoding="utf-8") as fh:
                text = fh.read()
        elif ext == "docx":
            try:
                from docx import Document
                doc = Document(saved_path)
                text = "\n".join(p.text for p in doc.paragraphs)
            except Exception:
                return jsonify({"msg": "Could not read DOCX file (missing dependency)"}), 400
        else:
            text = ""
    except Exception as e:
        return jsonify({"msg": f"Failed to extract text: {e}"}), 500

    # Clean and chunk
    cleaned = clean_text(text)
    num_questions = int(request.form.get("numQuestions", request.form.get("num_questions", 10)))
    chunks = chunk_text(cleaned, max_words=50)

    # Generate quiz items up to num_questions
    quiz = []
    for c in chunks:
        quiz.extend(generate_quiz(c))
        if len(quiz) >= num_questions:
            break
    quiz = quiz[:num_questions]

    return jsonify({"quiz": quiz, "title": request.form.get("title", ""), "num_questions": len(quiz)}), 201
