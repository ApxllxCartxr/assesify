# quiz_gen.py
from typing import List, Dict, Any
import re
import random

# AI interaction helpers (Gemini client)
from ml.genai import GeminiClient
from ml.schemas import StructuredAnswer, QuizItem

def ai_generate_answer(question: str) -> str:
    """Generate a short textual answer for a question using the configured model.
    Falls back to a placeholder string if model is not configured or call fails.
    """
    try:
        client = GeminiClient()
        return client.generate_text(question)
    except Exception:
        return "Answer TBD"



def _try_structured_answer(question: str, difficulty: str = "medium") -> dict:
    """Ask the model to return a JSON object with 'answer', 'options' and 'hint'."""
    prompt = (
        f"Please provide a JSON object representing a {difficulty}-level multiple choice question based on the text below. "
        "The object must have the following keys:\n"
        "- 'answer': A concise explanation of why the correct option is right.\n"
        "- 'options': A list of exactly 4 distinct options (strings). One must be correct, others plausible distractors.\n"
        "- 'correct_answer': The exact string content of the correct option from the list.\n"
        "- 'hint': A short hint.\n"
        "Return ONLY valid JSON.\n\n"
        f"Context/Question: {question}"
    )
    client = GeminiClient()
    return client.generate_json(prompt)


def chunk_text(text: str, max_words: int = 50) -> List[str]:
    """Split text into chunks of at most `max_words` words."""
    words = text.split()
    chunks: List[str] = []
    for i in range(0, len(words), max_words):
        chunks.append(" ".join(words[i:i + max_words]))
    return chunks


def _excerpt_for_question(text: str, max_chars: int = 120) -> str:
    """Return a clean excerpt suitable for embedding in a question."""
    s = " ".join(text.split())
    # fix common ligatures and stick abbreviations
    s = s.replace('\ufb01', 'fi')
    s = re.sub(r'([A-Z]{2,})([A-Z][a-z])', r'\1 \2', s)

    # split into sentences using basic punctuation
    sentences = re.split(r'(?<=[.!?])\s+', s)

    # Prefer a complete first sentence; if too short, join first two sentences
    if sentences and len(sentences[0]) >= 40:
        excerpt = sentences[0].strip()
    elif len(sentences) >= 2:
        excerpt = (sentences[0] + ' ' + sentences[1]).strip()
    else:
        if len(s) <= max_chars:
            excerpt = s
        else:
            truncated = s[:max_chars]
            excerpt = truncated.rsplit(' ', 1)[0].strip()

    # remove final sentence punctuation
    excerpt = excerpt.rstrip(' ,;:')
    if excerpt and excerpt[-1] in '.!?':
        excerpt = excerpt[:-1].strip()

    return excerpt

def generate_quiz(chunk: str, difficulty: str = "medium") -> List[Dict[str, Any]]:
    """Generate a quiz from a chunk of text.
    Returns a list of dicts: {'question', 'answer', 'options', 'correct_answer', 'hint'}
    """
    excerpt = _excerpt_for_question(chunk)
    question_text = f'What is the main idea of the following passage: "{excerpt}"?'

    # Default/Fallback values
    answer = "Answer TBD"
    options = ["Option A", "Option B", "Option C", "Option D"]
    correct_answer = "Option A"
    hint = "Summarize the passage."

    try:
        resp = _try_structured_answer(question_text, difficulty=difficulty)
        if isinstance(resp, dict):
            sa = StructuredAnswer(**resp)
            answer = sa.answer
            options = sa.options
            correct_answer = sa.correct_answer
            hint = sa.hint or hint
            
            # Simple validation: ensure correct_answer is in options
            if correct_answer not in options:
                 # If not in options, maybe try to match fuzzy or just replace first option
                 if options:
                     options[0] = correct_answer
    except Exception as e:
        # validation or model parse failed—fall back below
        # print("Quiz gen error:", e) 
        pass

    item = QuizItem(
        question=question_text, 
        answer=answer, 
        options=options, 
        correct_answer=correct_answer, 
        hint=hint
    )
    
    return [{
        "question": item.question, 
        "answer": item.answer, 
        "options": item.options, 
        "correct_answer": item.correct_answer,
        "hint": item.hint
    }]
