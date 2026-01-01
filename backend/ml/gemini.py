"""Compatibility shim: re-export the Gemini client from `genai.py` as `gemini`.
Some tests and modules import `ml.gemini`, so this keeps both names working.
"""
from .genai import GeminiClient

__all__ = ["GeminiClient"]
