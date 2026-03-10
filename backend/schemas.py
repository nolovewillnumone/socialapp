"""Pydantic schemas for Karta Talantov."""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


# ── User ──────────────────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    name:     str      = Field(..., min_length=2, max_length=100, example="Azizbek")
    email:    EmailStr = Field(..., example="azizbek@mail.ru")
    password: str      = Field(..., min_length=6)
    age:      Optional[int] = Field(None, ge=6, le=18)
    lang:     str      = Field("ru", pattern="^(uz|ru|en)$")
    role:     str      = Field("child", pattern="^(child|parent|teacher)$")


class UserUpdate(BaseModel):
    name: Optional[str] = None
    age:  Optional[int] = None
    lang: Optional[str] = None


class UserOut(BaseModel):
    id:         int
    name:       str
    email:      str
    age:        Optional[int]
    lang:       str
    role:       str
    is_active:  bool
    created_at: datetime

    class Config:
        from_attributes = True


class UserPublic(BaseModel):
    id:   int
    name: str
    age:  Optional[int]
    lang: str
    role: str

    class Config:
        from_attributes = True


# ── Auth ──────────────────────────────────────────────────────────────────────
class TokenOut(BaseModel):
    access_token: str
    token_type:   str
    user:         UserOut


# ── Quiz ──────────────────────────────────────────────────────────────────────
class ResultCreate(BaseModel):
    answers: dict[str, int] = Field(
        ...,
        example={"q1": 1, "q2": 3, "q3": 1, "q4": 2, "q5": 2, "q6": 2, "q7": 0, "q8": 1, "q9": 2, "q10": 1}
    )
    lang: str = Field("ru", pattern="^(uz|ru|en)$")


class CareerResult(BaseModel):
    id:            str
    name:          str
    icon:          str
    match_percent: float


class ResultOut(BaseModel):
    id:          int
    user_id:     int
    lang:        str
    scores:      dict[str, float]
    top_talents: list[str]
    careers:     list[CareerResult]
    strengths:   list[str]
    created_at:  datetime

    class Config:
        from_attributes = True


class ResultSummary(BaseModel):
    id:              int
    user_id:         int
    lang:            str
    score_logic:     float
    score_creativity: float
    score_memory:    float
    score_leadership: float
    score_languages: float
    score_music:     float
    top_talent:      str
    top_career:      str
    created_at:      datetime

    class Config:
        from_attributes = True
