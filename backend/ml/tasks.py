"""Background tasks for processing uploaded materials.

This module is intentionally small and easy to test. It exposes `process_uploaded_file`
which extracts text, runs the ML pipeline to recommend topics/difficulty, calls Gemini
(via `ml.genai.GeminiClient`) to generate quizzes, validates them with Pydantic, and
persists a JSON result file in `uploads/` alongside the original document.
"""
from __future__ import annotations

import json
import os
import time
from typing import Dict, Any

from ml.utils.pdf_utils import extract_text_from_pdf
from ml.utils.text_cleaner import clean_text
from ml.pipeline import preprocess, aggregate_features, recommend_next_topic
from ml.gemini import GeminiClient
from ml.gemini_prompt import build_quiz_prompt
from ml.schemas import QuizItem


def _write_quiz_output(saved_path: str, quiz: Dict[str, Any]) -> str:
    out_path = saved_path + ".quiz.json"
    with open(out_path, "w", encoding="utf-8") as fh:
        json.dump(quiz, fh, indent=2)
    return out_path


def process_uploaded_file(saved_path: str, title: str = "", num_questions: int = 10, teacher_id: str | None = None) -> Dict[str, Any]:
    """Process a saved file and generate a quiz result file.

    Steps:
    - Determine file type and extract text
    - Clean text and chunk
    - Use lightweight aggregated features to pick topics/difficulties (we reuse recommend_next_topic)
      NOTE: In this simplified flow we consider the 'topic' as the title or a single extracted topic.
    - Call Gemini to generate structured quiz for the chosen topic(s)
    - Validate quiz items with Pydantic `QuizItem` schema and write outputs

    Returns a dictionary with keys: status, output_path, quiz
    """
    if saved_path.endswith(".pdf"):
        text = extract_text_from_pdf(saved_path)
    else:
        with open(saved_path, "r", encoding="utf-8") as fh:
            text = fh.read()

    cleaned = clean_text(text)

    # For simplicity here: pick topic from title if present, else use 'general'
    topic = title.strip() or "general"

    # Choose difficulty heuristics: basic approach - use length / word count
    words = len(cleaned.split())
    if words < 100:
        difficulty = "easy"
    elif words < 400:
        difficulty = "medium"
    else:
        difficulty = "hard"

    # Prepare Gemini prompt and call model
    client = GeminiClient()
    prompt = build_quiz_prompt(topic=topic, difficulty=difficulty, n_questions=num_questions)

    try:
        resp = client.generate_json(prompt)
    except Exception as e:
        # Fallback: return empty quiz with error
        return {"status": "error", "message": f"Gemini call failed: {e}"}

    # Validate returned structure
    quiz_items = resp.get("quiz") if isinstance(resp, dict) else None
    if not isinstance(quiz_items, list):
        return {"status": "error", "message": "Invalid quiz format from Gemini"}

    validated = []
    for item in quiz_items:
        try:
            qi = QuizItem(question=item.get("question"), answer=item.get("answer"), hint=item.get("difficulty"))
            validated.append({"question": qi.question, "answer": qi.answer, "hint": item.get("choices") or qi.hint})
        except Exception:
            # drop invalid items
            continue

    out = {"title": title, "topic": topic, "difficulty": difficulty, "quiz": validated[:num_questions], "teacher_id": teacher_id}

    out_path = _write_quiz_output(saved_path, out)

    return {"status": "ok", "output_path": out_path, "quiz": out["quiz"]}
