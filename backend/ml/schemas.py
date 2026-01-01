"""Pydantic models for structured quiz generation outputs."""
from __future__ import annotations

from typing import Optional, List
from pydantic import BaseModel, Field, validator


class StructuredAnswer(BaseModel):
    answer: str = Field(..., min_length=1, description="Concise one-sentence answer")
    hint: Optional[str] = Field(None, description="Short hint for the question")

    @validator("answer")
    def strip_answer(cls, v: str) -> str:
        return v.strip()


class QuizItem(BaseModel):
    question: str
    answer: str
    hint: Optional[str]

    @validator("question", "answer", "hint", pre=True, always=True)
    def default_strip(cls, v):
        if v is None:
            return v
        return str(v).strip()


class Quiz(BaseModel):
    items: List[QuizItem]
