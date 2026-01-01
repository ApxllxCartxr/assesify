from flask import Blueprint, request, jsonify
from app.models.users import db, User
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
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

    access_token = create_access_token(identity=str(user.id))
    return jsonify({
        "access_token": access_token,
        "user_id": user.id,
        "is_teacher": user.is_teacher,
        "full_name": user.full_name
    })

@auth_bp.route("/update-profile", methods=["PUT"])
@jwt_required()
def update_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    data = request.json
    if "full_name" in data:
        user.full_name = data["full_name"]
        
    db.session.commit()
    
    return jsonify({
        "msg": "Profile updated successfully",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "is_teacher": user.is_teacher
        }
    }), 200

@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    current_user_id = get_jwt_identity()
    user = User.query.get(int(current_user_id))
    
    if not user:
        return jsonify({"msg": "User not found"}), 404
        
    return jsonify({
        "id": user.id,
        "full_name": user.full_name,
        "email": user.email,
        "is_teacher": user.is_teacher
    }), 200
