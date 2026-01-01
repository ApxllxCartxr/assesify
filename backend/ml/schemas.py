"""Pydantic models for structured quiz generation outputs."""
from __future__ import annotations

from typing import Optional, List, Union
from pydantic import BaseModel, Field, validator


class StructuredAnswer(BaseModel):
    answer: str = Field(..., min_length=1, description="Concise one-sentence answer")
    options: List[str] = Field(default_factory=list, description="List of 4 multiple choice options")
    correct_answer: str = Field(..., description="The correct answer from the options list")
    hint: Optional[str] = Field(None, description="Short hint for the question")

    @validator("answer")
    def strip_answer(cls, v: str) -> str:
        return v.strip()


class QuizItem(BaseModel):
    question: str
    answer: str
    options: List[str]
    correct_answer: str
    hint: Optional[str]

    @validator("question", "answer", "correct_answer", "hint", pre=True, always=True)
    def default_strip(cls, v):
        if v is None:
            return v
        return str(v).strip()


class Quiz(BaseModel):
    items: List[QuizItem]
