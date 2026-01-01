# quiz_gen.py
from typing import List, Dict
import re


# AI interaction helpers (Gemini client)
from ml.genai import GeminiClient

def ai_generate_answer(question: str) -> str:
    """Generate a short textual answer for a question using the configured model.

    Falls back to a placeholder string if model is not configured or call fails.
    """
    try:
        client = GeminiClient()
        return client.generate_text(question)
    except Exception:
        return "Answer TBD"


def _try_structured_answer(question: str) -> dict:
    """Ask the model to return a JSON object with 'answer' and 'hint'.

    Returns a dict with possible keys 'answer' and 'hint'. Raises ValueError on parse failure.
    """
    prompt = (
        "Please provide a short JSON object with two keys: 'answer' and 'hint'. "
        "'answer' should be a concise one-sentence answer to the question. "
        "'hint' should be a short hint (one sentence). Return ONLY valid JSON.\n\n"
        f"Question: {question}"
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
    """Return a clean excerpt suitable for embedding in a question.
    Prefer the first complete sentence; otherwise truncate on word boundary.
    """
    s = " ".join(text.split())
    # fix common ligatures and stuck abbreviations (e.g., "PDFThis" -> "PDF This")
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

    # remove final sentence punctuation that would create "... ."? patterns
    excerpt = excerpt.rstrip(' ,;:')
    if excerpt and excerpt[-1] in '.!?':
        excerpt = excerpt[:-1].strip()

    return excerpt


from ml.schemas import StructuredAnswer, QuizItem


def generate_quiz(chunk: str) -> List[Dict[str, str]]:
    """Generate a quiz from a chunk of text.
    Returns a list of dicts: {'question', 'answer', 'hint'}
    Uses a short, well-formed prompt for each chunk. Prefers structured JSON from model.
    """
    excerpt = _excerpt_for_question(chunk)
    # build a clear, grammatically-correct question (always end with '?')
    question = f'What is the main idea of the following passage: "{excerpt}"?'

    # Try to get a structured JSON response (answer + hint) from the model and validate via Pydantic
    answer = None
    hint = None

    try:
        resp = _try_structured_answer(question)
        if isinstance(resp, dict):
            sa = StructuredAnswer(**resp)
            answer = sa.answer
            hint = sa.hint
    except Exception:
        # validation or model parse failed—fall back below
        pass

    if not answer:
        answer = ai_generate_answer(question)
    if not hint:
        hint = "Summarize the passage in one sentence."

    item = QuizItem(question=question, answer=answer, hint=hint)
    return [{"question": item.question, "answer": item.answer, "hint": item.hint}]
