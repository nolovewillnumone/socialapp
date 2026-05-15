"""Pydantic schemas — pydantic v1 compatible"""

from pydantic import BaseModel, validator
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    name:     str
    email:    str      # plain str — avoid EmailStr dependency issues
    password: str
    age:      Optional[int] = None
    lang:     Optional[str] = "ru"
    role:     Optional[str] = "child"

    @validator("email")
    def email_valid(cls, v):
        v = v.strip().lower()
        if "@" not in v or "." not in v.split("@")[-1]:
            raise ValueError("Invalid email")
        return v

    @validator("name")
    def name_valid(cls, v):
        v = v.strip()
        if len(v) < 1:
            raise ValueError("Name is required")
        return v

    @validator("password")
    def password_valid(cls, v):
        if len(v) < 6:
            raise ValueError("Password must be at least 6 characters")
        return v


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
        orm_mode = True          # pydantic v1


class UserPublic(BaseModel):
    id:   int
    name: str
    age:  Optional[int]
    lang: str
    role: str

    class Config:
        orm_mode = True


class TokenOut(BaseModel):
    access_token: str
    token_type:   str
    user:         UserOut


class ResultCreate(BaseModel):
    answers:    dict
    lang:       Optional[str] = "ru"
    scores:     Optional[dict] = None
    top_career: Optional[str] = ""


class ResultOut(BaseModel):
    id:               int
    user_id:          int
    top_talent:       Optional[str]
    top_career:       Optional[str]
    score_logic:      float
    score_creativity: float
    score_memory:     float
    score_leadership: float
    score_languages:  float
    score_music:      float
    score_sport:      Optional[float] = 0
    score_nature:     Optional[float] = 0
    score_social:     Optional[float] = 0
    created_at:       datetime

    class Config:
        orm_mode = True


class TaskResultCreate(BaseModel):
    task_scores: dict
