import io
import sys

# Ensure backend package on sys.path when tests run from project root
sys.path.insert(0, r"c:/Users/Home/Desktop/backend/assesify/backend")

from app.main import create_app


def test_upload_txt_file():
    app = create_app()
    client = app.test_client()

    data = {
        "file": (io.BytesIO(b"Photosynthesis converts light to chemical energy in plants."), "lesson.txt"),
        "title": "Week 1",
        "numQuestions": "3",
    }

    resp = client.post("/api/teacher/materials", data=data, content_type="multipart/form-data")
    assert resp.status_code == 201
    body = resp.get_json()
    assert "quiz" in body
    assert isinstance(body["quiz"], list)
    assert len(body["quiz"]) <= 3
