

from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from .database import Base


class User(Base):
    __tablename__ = "users"

    id              = Column(Integer, primary_key=True, index=True)
    name            = Column(String(100), nullable=False)
    email           = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    age             = Column(Integer, default=None)
    lang            = Column(String(5), default="ru")       # uz | ru | en
    role            = Column(String(20), default="child")   # child | parent | teacher
    is_active       = Column(Boolean, default=True)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    results         = relationship("QuizResult", back_populates="user")


class QuizResult(Base):
    __tablename__ = "quiz_results"

    id               = Column(Integer, primary_key=True, index=True)
    user_id          = Column(Integer, ForeignKey("users.id"), nullable=False)
    lang             = Column(String(5), default="ru")
    answers          = Column(Text, default="")

    score_logic      = Column(Float, default=0.0)
    score_creativity = Column(Float, default=0.0)
    score_memory     = Column(Float, default=0.0)
    score_leadership = Column(Float, default=0.0)
    score_languages  = Column(Float, default=0.0)
    score_music      = Column(Float, default=0.0)

    top_talent       = Column(String(50), default="")
    top_career       = Column(String(100), default="")
    created_at       = Column(DateTime(timezone=True), server_default=func.now())

    user             = relationship("User", back_populates="results")
