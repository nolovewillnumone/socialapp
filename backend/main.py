"""
Karta Talantov — Backend API
=============================
Main FastAPI backend: auth, users, quiz results, leaderboard.

Run:  uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
Docs: http://localhost:8000/docs
"""

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import httpx
import os

from .database import engine, get_db, Base
from . import models, schemas, auth

Base.metadata.create_all(bind=engine)

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
    return {"status": "ok", "service": "karta-talantov-backend"}


# ── Auth ──────────────────────────────────────────────────────────────────────
@app.post("/auth/register", response_model=schemas.UserOut, status_code=201)
def register(body: schemas.UserCreate, db: Session = Depends(get_db)):
    if db.query(models.User).filter(models.User.email == body.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    user = models.User(
        name=body.name,
        email=body.email,
        age=body.age,
        lang=body.lang,
        hashed_password=auth.hash_password(body.password),
        role=body.role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.post("/auth/login", response_model=schemas.TokenOut)
def login(form: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
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


@app.get("/results/me", response_model=list[schemas.ResultSummary])
def my_results(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.QuizResult)\
        .filter(models.QuizResult.user_id == current_user.id)\
        .order_by(models.QuizResult.created_at.desc()).all()


@app.get("/results/me/latest", response_model=schemas.ResultSummary)
def latest_result(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    result = db.query(models.QuizResult)\
        .filter(models.QuizResult.user_id == current_user.id)\
        .order_by(models.QuizResult.created_at.desc()).first()
    if not result:
        raise HTTPException(status_code=404, detail="No results yet. Take the quiz first!")
    return result


# ── Task-based results ────────────────────────────────────────────────────────
@app.post("/results/tasks", status_code=201)
async def submit_task_results(
    body: schemas.TaskResultCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    """
    Submit scores from mini-games (Tasks page).
    Merges with latest quiz result or creates a new one.
    task_scores: { logic: 80, creativity: 60, memory: 70, leadership: 90 }
    """
    ts = body.task_scores

    # Try to find and update the latest result for this user
    existing = db.query(models.QuizResult)\
        .filter(models.QuizResult.user_id == current_user.id)\
        .order_by(models.QuizResult.created_at.desc()).first()

    if existing:
        # Blend task scores with quiz scores (average them)
        if ts.get("logic")      is not None: existing.score_logic      = (existing.score_logic      + ts["logic"])      / 2
        if ts.get("creativity") is not None: existing.score_creativity = (existing.score_creativity + ts["creativity"]) / 2
        if ts.get("memory")     is not None: existing.score_memory     = (existing.score_memory     + ts["memory"])     / 2
        if ts.get("leadership") is not None: existing.score_leadership = (existing.score_leadership + ts["leadership"]) / 2
        db.commit()
        db.refresh(existing)
        return { "message": "Task scores merged with quiz results", "result_id": existing.id }
    else:
        # No quiz taken yet — create a new result from task scores only
        result = models.QuizResult(
            user_id=current_user.id,
            lang=body.lang,
            answers="{}",
            score_logic=ts.get("logic", 0),
            score_creativity=ts.get("creativity", 0),
            score_memory=ts.get("memory", 0),
            score_leadership=ts.get("leadership", 0),
            score_languages=0,
            score_music=0,
            top_talent=max(ts, key=ts.get) if ts else "",
            top_career="",
        )
        db.add(result)
        db.commit()
        db.refresh(result)
        return { "message": "Task results saved", "result_id": result.id }


# ── Leaderboard ───────────────────────────────────────────────────────────────
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
    }
    if talent not in col_map:
        raise HTTPException(status_code=400, detail=f"Invalid talent. Choose: {list(col_map.keys())}")

    rows = db.query(models.QuizResult, models.User)\
        .join(models.User, models.QuizResult.user_id == models.User.id)\
        .order_by(col_map[talent].desc()).limit(10).all()

    return [
        {
            "rank": i + 1,
            "name": user.name,
            "age": user.age,
            "score": round(getattr(result, f"score_{talent}"), 1),
            "top_talent": result.top_talent,
        }
        for i, (result, user) in enumerate(rows)
    ]


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
