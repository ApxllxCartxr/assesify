import os

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "SUPER_SECRET_KEY")
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "sqlite:///assesify.db"  # simple DB for testing
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "JWT_SUPER_SECRET")
