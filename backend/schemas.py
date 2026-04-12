"""Pydantic schemas — compatible with pydantic v1 (1.10.13)"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    name:     str
    email:    EmailStr
    password: str
    age:      Optional[int] = None
    lang:     Optional[str] = "ru"
    role:     Optional[str] = "child"


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


class TokenOut(BaseModel):
    access_token: str
    token_type:   str
    user:         UserOut


class ResultCreate(BaseModel):
    answers: dict
    lang:    Optional[str] = "ru"


class ResultOut(BaseModel):
    id:              int
    user_id:         int
    top_talent:      Optional[str]
    top_career:      Optional[str]
    score_logic:     float
    score_creativity: float
    score_memory:    float
    score_leadership: float
    score_languages: float
    score_music:     float
    created_at:      datetime

    class Config:
        from_attributes = True


class TaskResultCreate(BaseModel):
    task_scores: dict
