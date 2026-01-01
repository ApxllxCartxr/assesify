# ML / Quiz generation

This module contains utilities to generate short quizzes from lesson content, optionally using Google's Gemini (Generative AI) models.

Environment
- `GEMINI_API_KEY` (optional): API key for Google GenAI if you want to call Gemini directly.
- `GEMINI_MODEL` (optional): Model name, default `gemini-3.5`.

Usage
- Local quick run (no Gemini):

  python -c "import sys; sys.path.insert(0, 'c:/Users/Home/Desktop/backend/assesify/backend'); from ml.train.quiz_gen import generate_quiz; print(generate_quiz('Photosynthesis converts light into chemical energy in plants.'))"

- With Gemini configured (example):

  export GEMINI_API_KEY=your_key_here
  export GEMINI_MODEL=gemini-3.5

  # Then run your script that uses `generate_quiz()` normally.

Testing
- Tests use `pytest` and mock `GeminiClient` methods. To run tests:

  pip install -r requirements.txt
  pytest ml/tests -q

Notes
- The code falls back to a placeholder answer when Gemini is not available, so the module is safe to run without cloud credentials.
