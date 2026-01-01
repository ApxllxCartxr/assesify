"""Utilities to build prompts for Gemini to generate quizzes.

The prompt requests structured JSON with questions, choices (optional), answers, and difficulty tags.
"""
from typing import Dict


def build_quiz_prompt(topic: str, difficulty: str = "medium", n_questions: int = 5, tone: str = "neutral") -> str:
    """Return a prompt string suitable for sending to Gemini's generate_json API.

    The model is asked to return ONLY valid JSON with a top-level `quiz` array. Each quiz item should be an object:
    {"question": str, "choices": [str] (optional), "answer": str, "difficulty": str}

    Example:
    {
      "quiz": [ {"question": "..", "choices": ["a","b"], "answer": "a", "difficulty": "easy"}, ... ]
    }
    """
    instruction = (
        "You are a helpful quiz writer. Return ONLY valid JSON.\n"
        "Create a quiz for the specified topic and difficulty. Each item must have 'question', 'answer', and 'difficulty'. "
        "Include 'choices' (4 options) for multiple-choice questions when appropriate. Keep each answer concise.\n\n"
        f"Topic: {topic}\n"
        f"Difficulty: {difficulty}\n"
        f"Number of questions: {n_questions}\n"
        f"Tone: {tone}\n\n"
        "Return exactly one top-level JSON object with a 'quiz' array."
    )
    return instruction


def example_gemini_payload(topic: str = "algebra", difficulty: str = "medium") -> Dict:
    prompt = build_quiz_prompt(topic, difficulty)
    return {"prompt": prompt, "model": "gemini-3.5", "max_tokens": 800}
