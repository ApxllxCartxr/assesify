from flask import Blueprint, request, jsonify
from app.models.users import db, User
from flask_jwt_extended import create_access_token
from app.core.security import hash_password

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    if User.query.filter_by(email=data["email"]).first():
        return jsonify({"msg": "Email already registered"}), 400

    user = User(
        email=data["email"],
        full_name=data["full_name"],
        is_teacher=data.get("is_teacher", False)
    )
    user.set_password(data["password"])
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User registered successfully"}), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    user = User.query.filter_by(email=data["email"]).first()
    if not user or not user.check_password(data["password"]):
        return jsonify({"msg": "Invalid credentials"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify({"access_token": access_token, "user_id": user.id})
