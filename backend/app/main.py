import sys
import os

# Add backend folder to sys.path so absolute imports work
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.core.config import Config
from app.models.users import db
from app.api.v1.auth.routes import auth_bp
from app.api.v1.teacher.routes import teacher_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)  # Enable CORS for all routes
    db.init_app(app)
    Migrate(app, db)
    JWTManager(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(teacher_bp, url_prefix="/api/teacher")

    @app.route("/")
    def home():
        return {"message": "Assesify API is running"}

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
