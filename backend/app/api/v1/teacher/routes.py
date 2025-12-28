from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from pydantic import ValidationError
from app.models.users import db, User
from app.schemas.teacher import InviteStudentSchema

teacher_bp = Blueprint("teacher", __name__)

@teacher_bp.route("/invite", methods=["POST"])
@jwt_required()
def invite_student():
    current_user_id = get_jwt_identity()
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
