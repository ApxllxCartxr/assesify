import sys
import os
import json

sys.path.insert(0, r"c:/Users/Home/Desktop/backend/assesify/backend")

from ml.gemini import GeminiClient
from ml.gemini_prompt import build_quiz_prompt


def test_build_quiz_prompt():
    p = build_quiz_prompt("algebra", "easy", 3)
    assert "Topic: algebra" in p


def test_gemini_client_json_parse(monkeypatch):
    # Simulate a gemini client returning a JSON string
    dummy_json = '{"quiz": [{"question": "Q1?", "choices": ["A","B"], "answer": "A", "difficulty": "easy"}]}'
    monkeypatch.setattr(GeminiClient, "generate_text", lambda self, prompt: dummy_json)
    c = GeminiClient()
    parsed = c.generate_json("dummy")
    assert isinstance(parsed, dict)
    assert "quiz" in parsed
