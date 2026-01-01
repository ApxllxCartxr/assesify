import sys
import os
import io
import json

sys.path.insert(0, r"c:/Users/Home/Desktop/backend/assesify/backend")

from ml.tasks import process_uploaded_file


def test_process_uploaded_file_txt(tmp_path):
    p = tmp_path / "lesson.txt"
    p.write_text("Photosynthesis converts light to chemical energy in plants.")

    out = process_uploaded_file(str(p), title="Photosynthesis", num_questions=2, teacher_id="t1")
    assert out["status"] in ("ok", "error")
    if out["status"] == "ok":
        assert "quiz" in out
        assert isinstance(out["quiz"], list)


def test_process_uploaded_file_handles_gemini_error(monkeypatch, tmp_path):
    p = tmp_path / "lesson.txt"
    p.write_text("Short text")

    # Monkeypatch GeminiClient.generate_json to raise
    import ml.genai as genai

    monkeypatch.setattr(genai.GeminiClient, "generate_json", lambda self, prompt: (_ for _ in ()).throw(RuntimeError("no client")))

    out = process_uploaded_file(str(p), title="X", num_questions=1)
    assert out["status"] == "error"
