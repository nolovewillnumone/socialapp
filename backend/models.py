"""SQLAlchemy ORM models for Karta Talantov."""

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
    lang            = Column(String(5), default="ru")
    role            = Column(String(20), default="child")
    is_active       = Column(Boolean, default=True)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    results         = relationship("QuizResult", back_populates="user")
    feedbacks       = relationship("Feedback", back_populates="user")


class QuizResult(Base):
    __tablename__ = "quiz_results"

    id               = Column(Integer, primary_key=True, index=True)
    user_id          = Column(Integer, ForeignKey("users.id"), nullable=True)
    lang             = Column(String(5), default="ru")
    answers          = Column(Text, default="")

    score_logic      = Column(Float, default=0.0)
    score_creativity = Column(Float, default=0.0)
    score_memory     = Column(Float, default=0.0)
    score_leadership = Column(Float, default=0.0)
    score_languages  = Column(Float, default=0.0)
    score_music      = Column(Float, default=0.0)
    score_sport      = Column(Float, default=0.0)
    score_nature     = Column(Float, default=0.0)
    score_social     = Column(Float, default=0.0)

    top_talent       = Column(String(50), default="")
    top_career       = Column(String(100), default="")
    created_at       = Column(DateTime(timezone=True), server_default=func.now())

    user             = relationship("User", back_populates="results")


class AnonymousResult(Base):
    """Stores quiz results for guests (no account). For analytics only."""
    __tablename__ = "anonymous_results"

    id               = Column(Integer, primary_key=True, index=True)
    session_id       = Column(String(64), index=True)
    lang             = Column(String(5), default="ru")
    age_range        = Column(String(10), default="")   # "8-10", "11-13", "14-16"

    score_logic      = Column(Float, default=0.0)
    score_creativity = Column(Float, default=0.0)
    score_memory     = Column(Float, default=0.0)
    score_leadership = Column(Float, default=0.0)
    score_languages  = Column(Float, default=0.0)
    score_music      = Column(Float, default=0.0)
    score_sport      = Column(Float, default=0.0)
    score_nature     = Column(Float, default=0.0)
    score_social     = Column(Float, default=0.0)

    top_talent       = Column(String(50), default="")
    top_career       = Column(String(100), default="")
    created_at       = Column(DateTime(timezone=True), server_default=func.now())


class Feedback(Base):
    """User feedback and reviews."""
    __tablename__ = "feedback"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(String(64), nullable=True)   # for guests
    name       = Column(String(100), default="Anonymous")
    lang       = Column(String(5), default="ru")
    rating     = Column(Integer, default=5)           # 1-5 stars
    comment    = Column(Text, default="")
    career     = Column(String(100), default="")      # which career was suggested
    helpful    = Column(Boolean, default=True)        # did it help?
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user       = relationship("User", back_populates="feedbacks")


class GameScore(Base):
    """Leaderboard scores from mini-games on Tasks page."""
    __tablename__ = "game_scores"

    id         = Column(Integer, primary_key=True, index=True)
    user_id    = Column(Integer, ForeignKey("users.id"), nullable=True)
    session_id = Column(String(64), nullable=True, index=True)
    name       = Column(String(100), default="Anonymous")
    lang       = Column(String(5), default="ru")

    score_logic      = Column(Integer, default=0)
    score_creativity = Column(Integer, default=0)
    score_memory     = Column(Integer, default=0)
    score_leadership = Column(Integer, default=0)
    total_score      = Column(Integer, default=0)  # average of all 4

    created_at = Column(DateTime(timezone=True), server_default=func.now())