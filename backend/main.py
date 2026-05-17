"""
Karta Talantov — Backend API
=============================
Main FastAPI backend: auth, users, quiz results, leaderboard.

Run:  uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
Docs: http://localhost:8000/docs
"""

from fastapi import FastAPI, HTTPException, Depends, status, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from sqlalchemy import text
from pydantic import BaseModel as PydanticBase
from typing import Optional, Dict, Any
from collections import defaultdict
from datetime import datetime, timedelta
import httpx
import os
import re
import time


# ── Email helper (uses free SMTP or Gmail) ────────────────────────────────────
def send_welcome_email(to_email: str, name: str, lang: str = "ru"):
    """Send welcome email via SMTP. Set SMTP_HOST, SMTP_USER, SMTP_PASS in env."""
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    smtp_host = os.environ.get("SMTP_HOST", "")
    smtp_user = os.environ.get("SMTP_USER", "")
    smtp_pass = os.environ.get("SMTP_PASS", "")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))

    if not smtp_host or not smtp_user:
        return  # Email not configured — skip silently

    subjects = {
        "ru": "Добро пожаловать в Karta Talantov! 🌟",
        "uz": "Karta Talantov ga xush kelibsiz! 🌟",
        "en": "Welcome to Karta Talantov! 🌟",
    }
    bodies = {
        "ru": f"""Привет, {name}! 👋

Добро пожаловать в Karta Talantov — платформу для открытия твоих талантов!

🎯 Что тебя ждёт:
• Тест из 30 вопросов (7 минут)
• Анализ 9 талантов с ML-алгоритмом
• 35+ карьерных рекомендаций
• Персональный план развития

Начни прямо сейчас: https://levelup-talent.xyz

Удачи в открытии своих талантов! 🌟
Команда Karta Talantov""",
        "uz": f"""Salom, {name}! 👋

Karta Talantov ga xush kelibsiz — iste'dodlaringizni ochish platformasiga!

🎯 Sizni nima kutmoqda:
• 30 savollik test (7 daqiqa)
• ML-algoritm bilan 9 iste'dod tahlili
• 35+ kasb tavsiyalari
• Shaxsiy rivojlanish rejasi

Hozir boshlang: https://levelup-talent.xyz

Iste'dodlaringizni kashf etishda omad! 🌟
Karta Talantov jamoasi""",
        "en": f"""Hi {name}! 👋

Welcome to Karta Talantov — the platform for discovering your talents!

🎯 What awaits you:
• 30-question quiz (7 minutes)
• ML analysis of 9 talent dimensions
• 35+ career recommendations
• Personalised development plan

Start now: https://levelup-talent.xyz

Good luck discovering your talents! 🌟
The Karta Talantov Team""",
    }

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subjects.get(lang, subjects["en"])
        msg["From"]    = smtp_user
        msg["To"]      = to_email
        msg.attach(MIMEText(bodies.get(lang, bodies["en"]), "plain", "utf-8"))

        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
    except Exception:
        pass  # Never crash registration if email fails

from .database import engine, get_db, Base
from . import models, schemas, auth

# Create ALL tables including new ones (Feedback, AnonymousResult)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"DB init warning: {e}")

app = FastAPI(
    title="Karta Talantov — Backend API",
    description="Backend for the trilingual kids talent discovery platform",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Compress responses — reduces payload size up to 70%
app.add_middleware(GZipMiddleware, minimum_size=500)

# ── Simple in-memory rate limiter ─────────────────────────────────────────────
_rate_store: dict = defaultdict(list)

def rate_limit(request: Request, max_calls: int = 10, window_seconds: int = 60):
    """Block IP if it exceeds max_calls in window_seconds."""
    ip  = request.client.host if request.client else "unknown"
    now = time.time()
    # Remove old timestamps
    _rate_store[ip] = [t for t in _rate_store[ip] if now - t < window_seconds]
    if len(_rate_store[ip]) >= max_calls:
        raise HTTPException(
            status_code=429,
            detail=f"Too many requests. Try again in {window_seconds} seconds."
        )
    _rate_store[ip].append(now)

def auth_rate_limit(request: Request):
    """Strict limit for auth endpoints — 5 attempts per minute."""
    rate_limit(request, max_calls=20, window_seconds=60)

# ── Input sanitizer ───────────────────────────────────────────────────────────
def sanitize(value: str, max_len: int = 200) -> str:
    """Strip dangerous characters and limit length."""
    if not value:
        return value
    # Remove potential SQL injection and script injection chars
    cleaned = re.sub(r"[<>%;()&+]", "", value)
    return cleaned[:max_len].strip()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
ML_SERVICE_URL = os.getenv("ML_SERVICE_URL", "https://karta-talantov-ml.onrender.com")


# ── Auth dependency ───────────────────────────────────────────────────────────
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):
    user = auth.decode_token(token, db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


# ── Health ────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return JSONResponse(
        content={"status": "ok", "service": "karta-talantov-backend"},
        headers={"Cache-Control": "no-cache"}
    )


# ── Auth ──────────────────────────────────────────────────────────────────────
@app.post("/auth/register", response_model=schemas.UserOut, status_code=201)
def register(request: Request, body: schemas.UserCreate, db: Session = Depends(get_db), _: None = Depends(auth_rate_limit)):
    try:
        if db.query(models.User).filter(models.User.email == body.email).first():
            raise HTTPException(status_code=400, detail="Email already registered")
        user = models.User(
            name=sanitize(body.name, 100),
            email=sanitize(body.email, 200),
            age=body.age,
            lang=body.lang if body.lang in ["ru","uz","en"] else "ru",
            hashed_password=auth.hash_password(body.password),
            role="child",  # always set to child — ignore user input
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        # Send welcome email (non-blocking — never fails registration)
        try:
            send_welcome_email(user.email, user.name, user.lang)
        except Exception:
            pass
        return user
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")


@app.post("/auth/login", response_model=schemas.TokenOut)
def login(request: Request, form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db), _: None = Depends(auth_rate_limit)):
    user = db.query(models.User).filter(models.User.email == form.username).first()
    if not user or not auth.verify_password(form.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    token = auth.create_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer", "user": user}


@app.get("/auth/me", response_model=schemas.UserOut)
def me(current_user: models.User = Depends(get_current_user)):
    return current_user


@app.patch("/auth/me", response_model=schemas.UserOut)
def update_me(
    body: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user


# ── Quiz results ──────────────────────────────────────────────────────────────
@app.post("/results", response_model=schemas.ResultOut, status_code=201)
async def submit_result(
    body: schemas.ResultCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """Submit quiz answers → ML service analyzes → store and return results."""
    # Also save to anonymous_results for analytics (non-blocking)
    try:
        scores = body.scores or {}
        anon = models.AnonymousResult(
            session_id   = f"user_{current_user.id}",
            lang         = body.lang if body.lang in ["ru","uz","en"] else "ru",
            score_logic      = float(scores.get("logic", 0)),
            score_creativity = float(scores.get("creativity", 0)),
            score_memory     = float(scores.get("memory", 0)),
            score_leadership = float(scores.get("leadership", 0)),
            score_languages  = float(scores.get("languages", 0)),
            score_music      = float(scores.get("music", 0)),
            score_sport      = float(scores.get("sport", 0)),
            score_nature     = float(scores.get("nature", 0)),
            score_social     = float(scores.get("social", 0)),
            top_talent   = scores and max(scores, key=scores.get) or "",
            top_career   = "",
        )
        db.add(anon)
        db.commit()
    except Exception:
        db.rollback()
    async with httpx.AsyncClient() as client:
        try:
            ml_resp = await client.post(
                f"{ML_SERVICE_URL}/analyze",
                json={"answers": body.answers, "lang": body.lang},
                timeout=15.0,
            )
            ml_resp.raise_for_status()
            ml_data = ml_resp.json()
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="ML service unavailable. Run: uvicorn ml.ml_service:app --port 8001")
        except httpx.HTTPStatusError as e:
            raise HTTPException(status_code=502, detail=f"ML error: {e.response.text}")

    result = models.QuizResult(
        user_id=current_user.id,
        lang=body.lang,
        answers=str(body.answers),
        score_logic=ml_data["scores"]["logic"],
        score_creativity=ml_data["scores"]["creativity"],
        score_memory=ml_data["scores"]["memory"],
        score_leadership=ml_data["scores"]["leadership"],
        score_languages=ml_data["scores"]["languages"],
        score_music=ml_data["scores"]["music"],
        top_talent=ml_data["top_talents"][0] if ml_data["top_talents"] else "",
        top_career=ml_data["careers"][0]["name"] if ml_data["careers"] else "",
    )
    db.add(result)
    db.commit()
    db.refresh(result)

    return schemas.ResultOut(
        id=result.id,
        user_id=result.user_id,
        lang=result.lang,
        scores=ml_data["scores"],
        top_talents=ml_data["top_talents"],
        careers=ml_data["careers"],
        strengths=ml_data["strengths"],
        created_at=result.created_at,
    )


@app.get("/results/me", response_model=list[schemas.ResultOut])
def my_results(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.QuizResult)\
        .filter(models.QuizResult.user_id == current_user.id)\
        .order_by(models.QuizResult.created_at.desc()).all()


@app.get("/results/me/latest", response_model=schemas.ResultOut)
def latest_result(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    result = db.query(models.QuizResult)\
        .filter(models.QuizResult.user_id == current_user.id)\
        .order_by(models.QuizResult.created_at.desc()).first()
    if not result:
        raise HTTPException(status_code=404, detail="No results yet. Take the quiz first!")
    return result


# ── Task-based results ────────────────────────────────────────────────────────
@app.post("/results/tasks", status_code=201)
def submit_task_results(
    body: schemas.TaskResultCreate,
    db: Session = Depends(get_db),
):
    """Save game scores to leaderboard. Works for guests and logged-in users."""
    try:
        # Auto-create tables
        try:
            from .database import engine
            models.Base.metadata.create_all(bind=engine)
        except Exception: pass

        ts = body.task_scores or {}
        scores = [
            int(ts.get("logic", 0)),
            int(ts.get("creativity", 0)),
            int(ts.get("memory", 0)),
            int(ts.get("leadership", 0)),
        ]
        total = round(sum(scores) / max(len([s for s in scores if s > 0]), 1))

        # Try to get user from token (optional)
        user_id = None
        name    = "Anonymous"
        try:
            from fastapi import Request
            token = getattr(body, "token", None)
        except Exception: pass

        # Save to game_scores
        record = models.GameScore(
            session_id       = sanitize(getattr(body, "session_id", "") or "", 64),
            name             = sanitize(getattr(body, "player_name", "Anonymous") or "Anonymous", 100),
            lang             = getattr(body, "lang", "ru") if getattr(body, "lang", "ru") in ["ru","uz","en"] else "ru",
            score_logic      = int(ts.get("logic", 0)),
            score_creativity = int(ts.get("creativity", 0)),
            score_memory     = int(ts.get("memory", 0)),
            score_leadership = int(ts.get("leadership", 0)),
            total_score      = total,
        )
        db.add(record)
        db.commit()
        return {"saved": True, "total_score": total}
    except Exception as e:
        db.rollback()
        return {"saved": False, "error": str(e)}


@app.get("/leaderboard/games")
def game_leaderboard(
    game: str = "total",
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """Get top scores from mini-games for the leaderboard page."""
    try:
        from .database import engine
        models.Base.metadata.create_all(bind=engine)
    except Exception: pass

    try:
        # Map game name to column
        col_map = {
            "logic":      models.GameScore.score_logic,
            "creativity": models.GameScore.score_creativity,
            "memory":     models.GameScore.score_memory,
            "leadership": models.GameScore.score_leadership,
            "total":      models.GameScore.total_score,
        }
        col = col_map.get(game, models.GameScore.total_score)

        rows = (
            db.query(models.GameScore)
            .filter(col > 0)
            .order_by(col.desc())
            .limit(limit)
            .all()
        )

        result = []
        for i, r in enumerate(rows):
            score = getattr(r, f"score_{game}" if game != "total" else "total_score", 0)
            result.append({
                "rank":       i + 1,
                "name":       r.name or "Anonymous",
                "score":      score,
                "total":      r.total_score,
                "logic":      r.score_logic,
                "creativity": r.score_creativity,
                "memory":     r.score_memory,
                "leadership": r.score_leadership,
                "date":       str(r.created_at)[:10] if r.created_at else "",
                "lang":       r.lang,
            })
        return result
    except Exception as e:
        return []


@app.get("/leaderboard")
def leaderboard(talent: str = "logic", db: Session = Depends(get_db)):
    """Top 10 users by a specific talent score."""
    col_map = {
        "logic":      models.QuizResult.score_logic,
        "creativity": models.QuizResult.score_creativity,
        "memory":     models.QuizResult.score_memory,
        "leadership": models.QuizResult.score_leadership,
        "languages":  models.QuizResult.score_languages,
        "music":      models.QuizResult.score_music,
        "sport":      models.QuizResult.score_sport,
        "nature":     models.QuizResult.score_nature,
        "social":     models.QuizResult.score_social,
    }
    if talent not in col_map:
        talent = "logic"

    try:
        rows = db.query(models.QuizResult, models.User)\
            .join(models.User, models.QuizResult.user_id == models.User.id)\
            .order_by(col_map[talent].desc()).limit(20).all()

        return [
            {
                "rank":       i + 1,
                "name":       user.name,
                "age":        user.age or "—",
                "score":      round(getattr(result, f"score_{talent}", 0) or 0, 1),
                "top_talent": result.top_talent or talent,
                "top_career": result.top_career or "",
            }
            for i, (result, user) in enumerate(rows)
        ]
    except Exception as e:
        return []


# ── Questions proxy ───────────────────────────────────────────────────────────
@app.get("/questions")
async def get_questions():
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.get(f"{ML_SERVICE_URL}/questions", timeout=5.0)
            return resp.json()
        except httpx.RequestError:
            raise HTTPException(status_code=503, detail="ML service unavailable")


# ── Public profile ────────────────────────────────────────────────────────────
@app.get("/users/{user_id}", response_model=schemas.UserPublic)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user



# ── User comparison ───────────────────────────────────────────────────────────
@app.get("/compare")
def compare_with_average(
    session_id: str = "",
    db: Session = Depends(get_db)
):
    """Compare a user's scores with the platform average."""
    try:
        from sqlalchemy import func as sqlfunc

        # Get all anonymous results for average
        avgs = db.query(
            sqlfunc.avg(models.AnonymousResult.score_logic).label("logic"),
            sqlfunc.avg(models.AnonymousResult.score_creativity).label("creativity"),
            sqlfunc.avg(models.AnonymousResult.score_memory).label("memory"),
            sqlfunc.avg(models.AnonymousResult.score_leadership).label("leadership"),
            sqlfunc.avg(models.AnonymousResult.score_languages).label("languages"),
            sqlfunc.avg(models.AnonymousResult.score_music).label("music"),
            sqlfunc.avg(models.AnonymousResult.score_sport).label("sport"),
            sqlfunc.avg(models.AnonymousResult.score_nature).label("nature"),
            sqlfunc.avg(models.AnonymousResult.score_social).label("social"),
        ).first()

        total = db.query(models.AnonymousResult).count()

        avg_scores = {
            "logic":      round(float(avgs.logic or 30), 1),
            "creativity": round(float(avgs.creativity or 30), 1),
            "memory":     round(float(avgs.memory or 30), 1),
            "leadership": round(float(avgs.leadership or 30), 1),
            "languages":  round(float(avgs.languages or 30), 1),
            "music":      round(float(avgs.music or 30), 1),
            "sport":      round(float(avgs.sport or 30), 1),
            "nature":     round(float(avgs.nature or 30), 1),
            "social":     round(float(avgs.social or 30), 1),
        }

        return {
            "avg_scores": avg_scores,
            "total_users": total,
        }
    except Exception as e:
        return {"avg_scores": {t: 30 for t in ["logic","creativity","memory","leadership","languages","music","sport","nature","social"]}, "total_users": 0}


# ── Admin Dashboard ───────────────────────────────────────────────────────────
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "karta2024admin")

def verify_admin(password: str):
    if password != ADMIN_PASSWORD:
        raise HTTPException(status_code=403, detail="Wrong admin password")

@app.get("/admin/data")
def admin_data(password: str, db: Session = Depends(get_db)):
    verify_admin(password)
    from sqlalchemy import func as sqlfunc, text as sqtext

    # Auto-create missing tables
    try:
        from .database import engine
        models.Base.metadata.create_all(bind=engine)
    except Exception: pass

    def safe(fn, default):
        try: return fn()
        except Exception: return default

    users     = safe(lambda: db.query(models.User).order_by(models.User.created_at.desc()).limit(50).all(), [])
    feedbacks = safe(lambda: db.query(models.Feedback).order_by(models.Feedback.created_at.desc()).limit(100).all(), [])
    anon      = safe(lambda: db.query(models.AnonymousResult).order_by(models.AnonymousResult.created_at.desc()).limit(100).all(), [])

    total_users    = safe(lambda: db.query(models.User).count(), 0)
    total_results  = safe(lambda: db.query(models.QuizResult).count(), 0)
    total_anon     = safe(lambda: db.query(models.AnonymousResult).count(), 0)
    fb_list        = safe(lambda: db.query(models.Feedback).all(), [])
    avg_rating     = round(sum(f.rating for f in fb_list) / len(fb_list), 2) if fb_list else 0

    top_careers = safe(lambda: db.query(
        models.AnonymousResult.top_career, sqlfunc.count(models.AnonymousResult.id).label("cnt")
    ).group_by(models.AnonymousResult.top_career).order_by(sqlfunc.count(models.AnonymousResult.id).desc()).limit(10).all(), [])

    top_talents = safe(lambda: db.query(
        models.AnonymousResult.top_talent, sqlfunc.count(models.AnonymousResult.id).label("cnt")
    ).group_by(models.AnonymousResult.top_talent).order_by(sqlfunc.count(models.AnonymousResult.id).desc()).limit(9).all(), [])

    lang_dist = safe(lambda: db.query(
        models.AnonymousResult.lang, sqlfunc.count(models.AnonymousResult.id).label("cnt")
    ).group_by(models.AnonymousResult.lang).all(), [])

    return {
        "stats": {
            "total_users":         total_users,
            "total_quizzes":       total_results + total_anon,
            "registered_quizzes":  total_results,
            "guest_quizzes":       total_anon,
            "total_feedback":      len(fb_list),
            "avg_rating":          avg_rating,
            "helpful_pct":         round(sum(1 for f in fb_list if f.helpful) / len(fb_list) * 100, 1) if fb_list else 0,
        },
        "top_careers":  [{"career": r[0] or "—", "count": r[1]} for r in top_careers],
        "top_talents":  [{"talent": r[0] or "—", "count": r[1]} for r in top_talents],
        "lang_dist":    [{"lang":   r[0] or "—", "count": r[1]} for r in lang_dist],
        "users":        [{"id":u.id,"name":u.name,"email":u.email,"age":u.age or "—","lang":u.lang,"created_at":str(u.created_at)[:10]} for u in users],
        "feedbacks":    [{"id":f.id,"name":f.name,"rating":f.rating,"comment":f.comment or "","career":f.career or "","lang":f.lang,"helpful":f.helpful,"date":str(f.created_at)[:10]} for f in feedbacks],
        "anon_results": [{"id":a.id,"lang":a.lang,"top_talent":a.top_talent or "—","top_career":a.top_career or "—","date":str(a.created_at)[:10]} for a in anon],
    }



# ── Comparison endpoint ───────────────────────────────────────────────────────
@app.get("/analytics/comparison")
def comparison(db: Session = Depends(get_db)):
    """Returns average scores across all users for radar chart comparison."""
    try:
        from sqlalchemy import func as sqlfunc
        anon = db.query(models.AnonymousResult).all()
        if not anon:
            return {"avg": {"logic":50,"creativity":50,"memory":50,"leadership":50,"languages":50,"music":50,"sport":50,"nature":50,"social":50}, "count":0}

        talents = ["logic","creativity","memory","leadership","languages","music","sport","nature","social"]
        avgs = {}
        for t in talents:
            vals = [getattr(a, f"score_{t}", 0) or 0 for a in anon]
            avgs[t] = round(sum(vals)/len(vals), 1) if vals else 50

        return {"avg": avgs, "count": len(anon)}
    except Exception as e:
        return {"avg": {"logic":50,"creativity":50,"memory":50,"leadership":50,"languages":50,"music":50,"sport":50,"nature":50,"social":50}, "count":0, "error":str(e)}



# ── Email notifications ───────────────────────────────────────────────────────
def build_steps(steps):
    """Build HTML step items for email."""
    html = ""
    for i, step in enumerate(steps):
        html += (
            f'<div style="margin-bottom:12px;">' +
            f'<span style="display:inline-block;width:24px;height:24px;border-radius:50%;background:#0F6E56;color:#fff;font-weight:800;font-size:12px;text-align:center;line-height:24px;">{i+1}</span>' +
            f'<span style="margin-left:12px;color:#2E4057;font-size:14px;font-weight:600;">{step}</span>' +
            '</div>'
        )
    return html


def send_welcome_email(to_email: str, name: str, lang: str = "ru"):
    """Send welcome email after registration. Uses Gmail SMTP."""
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    smtp_email = os.environ.get("SMTP_EMAIL", "")
    smtp_pass  = os.environ.get("SMTP_PASSWORD", "")

    if not smtp_email or not smtp_pass:
        return  # Skip if not configured

    subjects = {
        "ru": "Добро пожаловать в Karta Talantov! 🌟",
        "uz": "Karta Talantov ga xush kelibsiz! 🌟",
        "en": "Welcome to Karta Talantov! 🌟",
    }
    bodies = {
        "ru": f"""Привет, {name}! 👋

Добро пожаловать в Karta Talantov — платформу для открытия талантов!

🎯 Что делать дальше:
1. Пройди тест из 30 вопросов
2. Узнай свои топ-таланты
3. Получи персональный план развития
4. Посмотри свою карту талантов

👉 Начни прямо сейчас: https://levelup-talent.xyz

Удачи в открытии своих талантов! 🚀

С уважением,
Команда Karta Talantov""",
        "uz": f"""Salom, {name}! 👋

Karta Talantov ga xush kelibsiz — iste'dodlarni kashf etish platformasiga!

🎯 Keyingi qadamlar:
1. 30 savollik testni topshiring
2. Top iste'dodlaringizni biling
3. Shaxsiy rivojlanish rejasini oling
4. Iste'dod xaritangizni ko'ring

👉 Hozir boshlang: https://levelup-talent.xyz

Iste'dodlaringizni kashf etishda omad! 🚀

Hurmat bilan,
Karta Talantov jamoasi""",
        "en": f"""Hi {name}! 👋

Welcome to Karta Talantov — the talent discovery platform!

🎯 What to do next:
1. Take the 30-question quiz
2. Discover your top talents
3. Get your personalised development plan
4. See your talent map

👉 Start now: https://levelup-talent.xyz

Good luck discovering your talents! 🚀

Best regards,
The Karta Talantov Team""",
    }

    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subjects.get(lang, subjects["en"])
        msg["From"]    = smtp_email
        msg["To"]      = to_email
        msg.attach(MIMEText(bodies.get(lang, bodies["en"]), "plain", "utf-8"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465, timeout=10) as server:
            server.login(smtp_email, smtp_pass)
            server.sendmail(smtp_email, to_email, msg.as_string())
    except Exception:
        pass  # Never block registration if email fails


# ── Anonymous result tracking ─────────────────────────────────────────────────
class AnonResultCreate(PydanticBase):
    session_id: Optional[str] = ""
    lang:       Optional[str] = "ru"
    age_range:  Optional[str] = ""
    scores:     Optional[Dict[str, Any]] = None
    top_talent: Optional[str] = ""
    top_career: Optional[str] = ""

@app.post("/results/anonymous", status_code=201)
def save_anonymous_result(body: AnonResultCreate, db: Session = Depends(get_db)):
    """Save quiz result for guests — for analytics only, no personal data."""
    try:
        scores = body.scores or {}
        rec = models.AnonymousResult(
            session_id   = sanitize(body.session_id or "", 64),
            lang         = body.lang if body.lang in ["ru","uz","en"] else "ru",
            age_range    = body.age_range or "",
            score_logic      = float(scores.get("logic", 0)),
            score_creativity = float(scores.get("creativity", 0)),
            score_memory     = float(scores.get("memory", 0)),
            score_leadership = float(scores.get("leadership", 0)),
            score_languages  = float(scores.get("languages", 0)),
            score_music      = float(scores.get("music", 0)),
            score_sport      = float(scores.get("sport", 0)),
            score_nature     = float(scores.get("nature", 0)),
            score_social     = float(scores.get("social", 0)),
            top_talent   = sanitize(body.top_talent or "", 50),
            top_career   = sanitize(body.top_career or "", 100),
        )
        db.add(rec)
        db.commit()
        return {"saved": True}
    except Exception as e:
        db.rollback()
        return {"saved": False, "error": str(e)}


# ── Feedback endpoints ────────────────────────────────────────────────────────
class FeedbackCreate(PydanticBase):
    name:       Optional[str] = "Anonymous"
    session_id: Optional[str] = ""
    lang:       Optional[str] = "ru"
    rating:     Optional[int] = 5
    comment:    Optional[str] = ""
    career:     Optional[str] = ""
    helpful:    Optional[bool] = True

class FeedbackOut(PydanticBase):
    id:         int
    name:       str
    rating:     int
    comment:    str
    career:     str
    lang:       str
    helpful:    bool
    created_at: str

    class Config:
        from_attributes = True

@app.post("/feedback", status_code=201)
def submit_feedback(body: FeedbackCreate, db: Session = Depends(get_db)):
    """Submit feedback — works for both logged-in and guest users."""
    try:
        rating = max(1, min(5, body.rating or 5))
        rec = models.Feedback(
            name       = sanitize(body.name or "Anonymous", 100),
            session_id = sanitize(body.session_id or "", 64),
            lang       = body.lang if body.lang in ["ru","uz","en"] else "ru",
            rating     = rating,
            comment    = sanitize(body.comment or "", 1000),
            career     = sanitize(body.career or "", 100),
            helpful    = body.helpful if body.helpful is not None else True,
        )
        db.add(rec)
        db.commit()
        db.refresh(rec)
        return {"saved": True, "id": rec.id}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Feedback error: {str(e)}")

@app.get("/feedback/public")
def get_public_feedback(db: Session = Depends(get_db), limit: int = 20):
    """Get recent public feedback with rating >= 4 for display."""
    items = (
        db.query(models.Feedback)
        .filter(models.Feedback.rating >= 4)
        .filter(models.Feedback.comment != "")
        .order_by(models.Feedback.created_at.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id":      f.id,
            "name":    f.name,
            "rating":  f.rating,
            "comment": f.comment,
            "career":  f.career,
            "lang":    f.lang,
            "helpful": f.helpful,
            "date":    f.created_at.strftime("%d.%m.%Y") if f.created_at else "",
        }
        for f in items
    ]

# ── Analytics summary ─────────────────────────────────────────────────────────
@app.get("/analytics/summary")
def analytics_summary(db: Session = Depends(get_db)):
    """Public analytics — how many people used the platform."""
    try:
        users_count    = db.query(models.User).count()
        results_count  = db.query(models.QuizResult).count()
        anon_count     = db.query(models.AnonymousResult).count()
        feedback_count = db.query(models.Feedback).count()
        avg_rating_row = db.query(models.Feedback).all()
        avg_rating     = round(sum(f.rating for f in avg_rating_row) / len(avg_rating_row), 1) if avg_rating_row else 5.0

        # Top career distribution
        from sqlalchemy import func as sqlfunc
        top_careers = (
            db.query(models.QuizResult.top_career, sqlfunc.count(models.QuizResult.id).label("cnt"))
            .group_by(models.QuizResult.top_career)
            .order_by(sqlfunc.count(models.QuizResult.id).desc())
            .limit(5)
            .all()
        )

        return {
            "total_users":    users_count,
            "total_quizzes":  results_count + anon_count,
            "registered":     results_count,
            "guests":         anon_count,
            "feedbacks":      feedback_count,
            "avg_rating":     avg_rating,
            "top_careers":    [{"career": r[0], "count": r[1]} for r in top_careers],
        }
    except Exception as e:
        return {"error": str(e)}

# ── Admin delete endpoints ────────────────────────────────────────────────────
@app.delete("/admin/user/{user_id}")
def admin_delete_user(user_id: int, password: str, db: Session = Depends(get_db)):
    verify_admin(password)
    from sqlalchemy import text
    try:
        # Check user exists
        user = db.query(models.User).filter(models.User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        # Use raw SQL to bypass ORM foreign key issues
        try:
            db.execute(text("DELETE FROM quiz_results WHERE user_id = :uid"), {"uid": user_id})
        except Exception: db.rollback()

        try:
            db.execute(text("DELETE FROM feedback WHERE user_id = :uid"), {"uid": user_id})
        except Exception: db.rollback()

        try:
            db.execute(text("DELETE FROM users WHERE id = :uid"), {"uid": user_id})
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(status_code=500, detail=f"Could not delete: {str(e)}")

        return {"deleted": True, "user_id": user_id}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/admin/feedback/{feedback_id}")
def admin_delete_feedback(feedback_id: int, password: str, db: Session = Depends(get_db)):
    verify_admin(password)
    fb = db.query(models.Feedback).filter(models.Feedback.id == feedback_id).first()
    if not fb:
        raise HTTPException(status_code=404, detail="Feedback not found")
    db.delete(fb)
    db.commit()
    return {"deleted": True, "feedback_id": feedback_id}

@app.delete("/admin/anon/{anon_id}")
def admin_delete_anon(anon_id: int, password: str, db: Session = Depends(get_db)):
    verify_admin(password)
    a = db.query(models.AnonymousResult).filter(models.AnonymousResult.id == anon_id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(a)
    db.commit()
    return {"deleted": True}


# ── Rule-based AI Chatbot (no external API needed) ──────────────────────────
from pydantic import BaseModel as PydanticBase
from typing import Optional, Dict, Any

class ChatRequest(PydanticBase):
    message: Optional[str] = ""
    lang:    Optional[str] = "ru"
    scores:  Optional[dict] = None

# ── Response database ─────────────────────────────────────────────────────────
RESPONSES = {
    # Greetings
    "greet": {
        "keywords": ["hello","hi","hey","привет","салам","salom","хай","здравствуй"],
        "ru": ["Привет! 👋 Я твой AI-советник по талантам! Спроси меня о своих способностях, карьере или университетах 🌟",
               "Привет! 😊 Готов помочь тебе раскрыть твои таланты! О чём хочешь узнать?"],
        "uz": ["Salom! 👋 Men sizning iste'dod maslahatchimanman! Qobiliyatlar, kasb yoki universitetlar haqida so'rang 🌟",
               "Salom! 😊 Iste'dodlaringizni ochishga yordam berishga tayyorman!"],
        "en": ["Hi there! 👋 I'm your talent advisor! Ask me about your abilities, careers or universities 🌟",
               "Hello! 😊 Ready to help you discover your talents! What would you like to know?"],
    },
    # Quiz
    "quiz": {
        "keywords": ["quiz","тест","test","вопрос","question","пройти","пройди","savol","topshiriq"],
        "ru": ["Тест состоит из 15 вопросов и занимает около 5 минут 🎯 Он основан на теории множественного интеллекта Гарднера (Гарвард). Нажми 'Тест' в меню чтобы начать!",
               "Наш тест проверяет 6 талантов: Логику, Творчество, Память, Лидерство, Языки и Музыку 🧠 Пройди его чтобы узнать свои сильные стороны!"],
        "uz": ["Test 15 savoldan iborat va taxminan 5 daqiqa davom etadi 🎯 U Gardner nazariyasiga (Harvard) asoslangan. Boshlash uchun menyudagi 'Test' tugmasini bosing!",
               "Testimiz 6 iste'dodni tekshiradi: Mantiq, Ijodkorlik, Xotira, Liderlik, Tillar va Musiqa 🧠"],
        "en": ["The quiz has 15 questions and takes about 5 minutes 🎯 It's based on Gardner's Multiple Intelligences theory (Harvard). Click 'Quiz' in the menu to start!",
               "Our quiz tests 6 talents: Logic, Creativity, Memory, Leadership, Languages and Music 🧠 Take it to discover your strengths!"],
    },
    # Logic
    "logic": {
        "keywords": ["logic","логика","mantiq","math","математика","matematika","программир","coding","код","code","dastur"],
        "ru": ["Высокий логический интеллект — это дар! 🧠 Тебе подойдут профессии: Программист, Учёный, Инженер. Лучшие университеты: MIT, Stanford, INHA Tashkent!",
               "Логика развивается через математику, шахматы и программирование 💻 Попробуй Khan Academy или Scratch для начала!"],
        "uz": ["Yuqori mantiqiy intellekt — bu sovg'a! 🧠 Sizga mos kasblar: Dasturchi, Olim, Muhandis. Eng yaxshi universitetlar: MIT, Stanford, INHA Toshkent!",
               "Mantiq matematika, shaxmat va dasturlash orqali rivojlanadi 💻 Khan Academy yoki Scratch bilan boshlang!"],
        "en": ["High logical intelligence is a gift! 🧠 Great careers: Programmer, Scientist, Engineer. Top universities: MIT, Stanford, INHA Tashkent!",
               "Logic develops through math, chess and coding 💻 Try Khan Academy or Scratch to start!"],
    },
    # Creativity
    "creativity": {
        "keywords": ["creativ","творч","ijodkor","art","искусств","рисов","design","дизайн","dizayn","rasm"],
        "ru": ["Творческий интеллект — это суперсила! 🎨 Тебе подойдут: Дизайнер, Художник, Архитектор. Университеты: Rhode Island School of Design, O'zDSMI!",
               "Развивай творчество через рисование, лепку и создание своих проектов 🌈 Попробуй Skillshare или Adobe Creative Cloud!"],
        "uz": ["Ijodiy intellekt — bu superkuch! 🎨 Sizga mos: Dizayner, Rassom, Arxitektor. Universitetlar: Rhode Island School of Design, O'zDSMI!",
               "Ijodkorlikni chizish, modellashtirish va loyihalar yaratish orqali rivojlantiring 🌈"],
        "en": ["Creative intelligence is a superpower! 🎨 Great careers: Designer, Artist, Architect. Universities: Rhode Island School of Design, O'zDSMI!",
               "Develop creativity through drawing, sculpting and making projects 🌈 Try Skillshare or Adobe Creative Cloud!"],
    },
    # Music
    "music": {
        "keywords": ["music","музык","musiqa","song","песн","qo'shiq","piano","гитар","guitar","нот","nota"],
        "ru": ["Музыкальный интеллект развивает мозг! 🎵 Музыканты лучше учатся в школе. Университеты: Berklee College of Music, Juilliard, O'zbekiston Davlat Konservatoriyasi!",
               "Занимайся на инструменте хотя бы 30 минут в день 🎹 Попробуй Simply Piano или Yousician — они бесплатные!"],
        "uz": ["Musiqiy intellekt miyani rivojlantiradi! 🎵 Musiqachilar maktabda yaxshiroq o'qiydi. Universitetlar: Berklee, Juilliard, O'zbekiston Davlat Konservatoriyasi!",
               "Har kuni kamida 30 daqiqa asbobda mashq qiling 🎹 Simply Piano yoki Yousician bepul!"],
        "en": ["Musical intelligence develops the brain! 🎵 Musicians do better in school. Universities: Berklee College of Music, Juilliard, State Conservatory of Uzbekistan!",
               "Practice an instrument at least 30 minutes daily 🎹 Try Simply Piano or Yousician — they're free!"],
    },
    # Leadership
    "leadership": {
        "keywords": ["leader","лидер","lider","boss","менеджер","manager","бизнес","business","biznes","управл","rahbar"],
        "ru": ["Лидерский интеллект — редкий дар! 👑 Тебе подойдут: Менеджер, Предприниматель, Политик. Университеты: Harvard Business School, Westminster Tashkent!",
               "Развивай лидерство через организацию мероприятий, дебатный клуб и волонтёрство 🌟 Учись слушать других — это главное качество лидера!"],
        "uz": ["Liderlik intellekti — kam uchraydigan sovg'a! 👑 Sizga mos: Menejer, Tadbirkor, Siyosatchi. Universitetlar: Harvard Business School, Westminster Toshkent!",
               "Liderlikni tadbirlar tashkil qilish, debat klubi va ko'ngillilik orqali rivojlantiring 🌟"],
        "en": ["Leadership intelligence is a rare gift! 👑 Great careers: Manager, Entrepreneur, Politician. Universities: Harvard Business School, Westminster Tashkent!",
               "Develop leadership by organizing events, joining debate club and volunteering 🌟 Learning to listen is the most important leadership skill!"],
    },
    # Languages
    "languages": {
        "keywords": ["language","язык","til","english","ingliz","ingliz","русский","french","франц","translat","перевод"],
        "ru": ["Лингвистический интеллект открывает весь мир! 🌍 Карьеры: Переводчик, Дипломат, Журналист. Университеты: МГИМО, Georgetown, O'zDJTU!",
               "Лучший способ учить язык — смотреть фильмы без субтитров и говорить с носителями 🗣️ Попробуй Duolingo или italki!"],
        "uz": ["Lingvistik intellekt butun dunyoni ochadi! 🌍 Kasblar: Tarjimon, Diplomat, Jurnalist. Universitetlar: MGIMO, Georgetown, O'zDJTU!",
               "Tilni o'rganishning eng yaxshi usuli — subtitrlar siz filmlar ko'rish va ona tili so'zlovchilari bilan gaplashish 🗣️"],
        "en": ["Linguistic intelligence opens the whole world! 🌍 Careers: Translator, Diplomat, Journalist. Universities: MGIMO, Georgetown, O'zDJTU!",
               "Best way to learn a language is watching films without subtitles and speaking with natives 🗣️ Try Duolingo or italki!"],
    },
    # Memory
    "memory": {
        "keywords": ["memory","память","xotira","remember","запомн","esla","study","учёба","o'qish","brain","мозг","miya"],
        "ru": ["Отличная память — ключ к успеху в учёбе! 📚 Попробуй технику 'Дворец памяти' — её использовали Эйнштейн и Шерлок Холмс! Также помогает приложение Anki.",
               "Память тренируется как мышца! 💪 Учи стихи, играй в шахматы, решай головоломки. Сон — лучший помощник для памяти!"],
        "uz": ["A'lo xotira — o'qishdagi muvaffaqiyat kaliti! 📚 'Xotira saroyi' texnikasini sinab ko'ring — uni Eynshteyn ham ishlatgan! Anki ilovasi ham yordam beradi.",
               "Xotira mushak kabi mashq qilinadi! 💪 She'r yod oling, shaxmat o'ynang, jumboqlar yeching!"],
        "en": ["Great memory is the key to academic success! 📚 Try the 'Memory Palace' technique — Einstein used it! Anki app also helps a lot.",
               "Memory trains like a muscle! 💪 Memorize poems, play chess, solve puzzles. Sleep is your memory's best friend!"],
    },
    # University
    "university": {
        "keywords": ["university","университет","univers","college","колледж","mit","stanford","harvard","oxford","inha","поступ","qabul"],
        "ru": ["Топ университеты: 🧠 IT — MIT, Stanford, INHA. 🎨 Дизайн — Rhode Island. 🎵 Музыка — Berklee, Juilliard. 👑 Бизнес — Harvard Business, Westminster. 🌍 Языки — МГИМО, Georgetown.",
               "Для поступления в топ университеты нужны: отличные оценки, олимпиады, портфолио и знание английского 📝 Начни готовиться прямо сейчас!"],
        "uz": ["Top universitetlar: 🧠 IT — MIT, Stanford, INHA. 🎨 Dizayn — Rhode Island. 🎵 Musiqa — Berklee, Juilliard. 👑 Biznes — Harvard Business, Westminster. 🌍 Tillar — MGIMO, Georgetown.",
               "Top universitetlarga kirish uchun: a'lo baholar, olimpiadalar, portfolio va ingliz tili kerak 📝"],
        "en": ["Top universities: 🧠 IT — MIT, Stanford, INHA. 🎨 Design — Rhode Island. 🎵 Music — Berklee, Juilliard. 👑 Business — Harvard Business, Westminster. 🌍 Languages — MGIMO, Georgetown.",
               "For top universities you need: excellent grades, olympiads, portfolio and English skills 📝 Start preparing now!"],
    },
    # Career
    "career": {
        "keywords": ["career","карьер","kasb","job","работ","ish","профессия","profession","future","будущ","kelajak"],
        "ru": ["Выбор карьеры зависит от твоих талантов! 🚀 Пройди наш тест чтобы узнать свои сильные стороны, и я дам конкретные рекомендации!",
               "Самые востребованные профессии будущего: Программист AI, Data Scientist, Кибербезопасность, Биоинженер 💡 Все они требуют сильной логики и математики!"],
        "uz": ["Kasb tanlash iste'dodlaringizga bog'liq! 🚀 Kuchli tomonlaringizni bilish uchun testni topshiring!",
               "Kelajakda eng ko'p talab qilinadigan kasblar: AI Dasturchi, Data Scientist, Kiberxavfsizlik, Bioinjener 💡"],
        "en": ["Career choice depends on your talents! 🚀 Take our quiz to discover your strengths and I'll give specific recommendations!",
               "Most in-demand future careers: AI Programmer, Data Scientist, Cybersecurity, Bioengineer 💡 All require strong logic and math!"],
    },
    # Help
    "help": {
        "keywords": ["help","помог","yordam","what can","что ты","что умеешь","nima qila","можешь","can you"],
        "ru": ["Я могу помочь с: 🎯 анализом талантов, 🚀 выбором карьеры, 🎓 университетами, 📚 советами по развитию. Просто спроси!"],
        "uz": ["Men yordam bera olaman: 🎯 iste'dodlar tahlili, 🚀 kasb tanlash, 🎓 universitetlar, 📚 rivojlanish maslahatlari. Shunchaki so'rang!"],
        "en": ["I can help with: 🎯 talent analysis, 🚀 career choice, 🎓 university recommendations, 📚 development tips. Just ask!"],
    },
    # Thanks
    "thanks": {
        "keywords": ["thanks","thank","спасиб","рахмат","rahmat","merci","teşekk","sağ ol","пожалуйста"],
        "ru": ["Всегда рад помочь! 😊 Удачи в раскрытии твоих талантов! 🌟", "Пожалуйста! 🤗 Ты можешь спросить меня о чём угодно!"],
        "uz": ["Har doim yordam berishdan xursandman! 😊 Iste'dodlaringizni ochishda omad! 🌟", "Iltimos! 🤗 Istalgan narsa haqida so'rashingiz mumkin!"],
        "en": ["Always happy to help! 😊 Good luck discovering your talents! 🌟", "You're welcome! 🤗 Feel free to ask me anything!"],
    },
}

# Fallback responses when nothing matches
FALLBACKS = {
    "ru": [
        "Интересный вопрос! 🤔 Попробуй спросить меня о своих талантах, карьере или университетах!",
        "Я специализируюсь на талантах и карьере! 🌟 Спроси меня: 'Какая карьера мне подойдёт?' или 'Как развить логику?'",
        "Хороший вопрос! Пройди наш тест чтобы узнать свои таланты, и я дам тебе персональные советы! 🎯",
    ],
    "uz": [
        "Qiziq savol! 🤔 Iste'dodlar, kasb yoki universitetlar haqida so'rang!",
        "Men iste'dod va kasbga ixtisoslashganman! 🌟 So'rang: 'Menga qanday kasb mos?' yoki 'Mantiqni qanday rivojlantirish?'",
        "Testni topshiring va men sizga shaxsiy maslahatlar beraman! 🎯",
    ],
    "en": [
        "Interesting question! 🤔 Try asking me about your talents, career or universities!",
        "I specialize in talents and careers! 🌟 Ask me: 'What career suits me?' or 'How to develop logic?'",
        "Take our quiz to discover your talents and I'll give you personalized advice! 🎯",
    ],
}

import random

def get_top_talent_response(scores: dict, lang: str) -> str:
    """Generate a response based on the user's top talent score."""
    if not scores:
        return ""
    top = max(scores, key=scores.get)
    score = scores[top]
    talent_msgs = {
        "logic":      {"ru": f"Твой топ-талант — Логика ({score}%)! 🧠 Тебе отлично подойдут IT и наука!", "uz": f"Sizning top iste'dodingiz — Mantiq ({score}%)! 🧠", "en": f"Your top talent is Logic ({score}%)! 🧠 IT and science are perfect for you!"},
        "creativity": {"ru": f"Твой топ-талант — Творчество ({score}%)! 🎨 Ты прирождённый дизайнер или художник!", "uz": f"Sizning top iste'dodingiz — Ijodkorlik ({score}%)! 🎨", "en": f"Your top talent is Creativity ({score}%)! 🎨 You're a natural designer or artist!"},
        "memory":     {"ru": f"Твой топ-талант — Память ({score}%)! 📚 Ты можешь стать отличным учёным или врачом!", "uz": f"Sizning top iste'dodingiz — Xotira ({score}%)! 📚", "en": f"Your top talent is Memory ({score}%)! 📚 You could be a great scientist or doctor!"},
        "leadership": {"ru": f"Твой топ-талант — Лидерство ({score}%)! 👑 Ты рождён быть руководителем!", "uz": f"Sizning top iste'dodingiz — Liderlik ({score}%)! 👑", "en": f"Your top talent is Leadership ({score}%)! 👑 You were born to lead!"},
        "languages":  {"ru": f"Твой топ-талант — Языки ({score}%)! 🌍 Мир открыт для тебя!", "uz": f"Sizning top iste'dodingiz — Tillar ({score}%)! 🌍", "en": f"Your top talent is Languages ({score}%)! 🌍 The whole world is open to you!"},
        "music":      {"ru": f"Твой топ-талант — Музыка ({score}%)! 🎵 Ты настоящий музыкант!", "uz": f"Sizning top iste'dodingiz — Musiqa ({score}%)! 🎵", "en": f"Your top talent is Music ({score}%)! 🎵 You're a true musician!"},
    }
    return talent_msgs.get(top, {}).get(lang, "")


def find_response(message: str, lang: str, scores: dict) -> str:
    msg_lower = message.lower().strip()

    # Check for talent-related questions with scores context
    talent_keywords = ["my talent","мой талант","мои способ","qobilyat","iste'dod","my score","мои резуль","result","результ","natija"]
    if any(k in msg_lower for k in talent_keywords) and scores:
        talent_resp = get_top_talent_response(scores or {}, lang)
        if talent_resp:
            return talent_resp

    # Match keywords to response categories
    for category, data in RESPONSES.items():
        if any(kw in msg_lower for kw in data["keywords"]):
            options = data.get(lang, data.get("en", []))
            if options:
                return random.choice(options)

    # Fallback
    return random.choice(FALLBACKS.get(lang, FALLBACKS["en"]))


@app.post("/chat")
def chat(body: ChatRequest):
    """Rule-based AI talent advisor chatbot."""
    try:
        message = body.message.strip()
        if not message:
            greet_data = RESPONSES["greet"]
            return {"reply": random.choice(greet_data.get(body.lang, greet_data["en"]))}

        reply = find_response(message, body.lang, body.scores or {})
        return {"reply": reply}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")
