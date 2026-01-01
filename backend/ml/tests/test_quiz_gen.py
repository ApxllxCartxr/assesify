import sys
from types import SimpleNamespace
import pytest

# Ensure backend package on sys.path when tests run from project root
sys.path.insert(0, r"c:/Users/Home/Desktop/backend/assesify/backend")

from ml.train.quiz_gen import generate_quiz
from ml.genai import GeminiClient


class DummyGemini:
    def __init__(self, json_resp=None, text_resp=None):
        self._json = json_resp
        self._text = text_resp

    def generate_json(self, prompt, **kwargs):
        if isinstance(self._json, Exception):
            raise self._json
        return self._json

    def generate_text(self, prompt, **kwargs):
        if isinstance(self._text, Exception):
            raise self._text
        return self._text


def test_generate_quiz_uses_structured_json(monkeypatch):
    # Mock the GeminiClient to return structured JSON
    dummy = DummyGemini(json_resp={"answer": "Photosynthesis makes food from light.", "hint": "Think energy conversion."})
    monkeypatch.setattr(GeminiClient, "generate_json", lambda self, prompt: dummy.generate_json(prompt))

    quiz = generate_quiz("Photosynthesis converts light to chemical energy in plants.")
    assert isinstance(quiz, list)
    item = quiz[0]
    assert "question" in item and "answer" in item and "hint" in item
    assert item["answer"] == "Photosynthesis makes food from light."
    assert item["hint"] == "Think energy conversion."


def test_generate_quiz_falls_back_to_text_if_json_fails(monkeypatch):
    # Mock generate_json to raise ValueError and generate_text to return a textual answer
    monkeypatch.setattr(GeminiClient, "generate_json", lambda self, prompt: (_ for _ in ()).throw(ValueError("bad json")))
    monkeypatch.setattr(GeminiClient, "generate_text", lambda self, prompt: "Plants convert light into chemical energy.")

    quiz = generate_quiz("Photosynthesis converts light to chemical energy in plants.")
    item = quiz[0]
    assert item["answer"] == "Plants convert light into chemical energy."
    assert item["hint"] == "Summarize the passage in one sentence."


def test_generate_quiz_handles_no_gemini(monkeypatch):
    # Simulate Gemini client raising RuntimeError (e.g., missing client) so fallback Answer TBD is used
    monkeypatch.setattr(GeminiClient, "generate_json", lambda self, prompt: (_ for _ in ()).throw(RuntimeError("no client")))
    monkeypatch.setattr(GeminiClient, "generate_text", lambda self, prompt: (_ for _ in ()).throw(RuntimeError("no client")))

    quiz = generate_quiz("Photosynthesis converts light to chemical energy in plants.")
    item = quiz[0]
    assert item["answer"] == "Answer TBD"
    assert item["hint"] == "Summarize the passage in one sentence."
