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
from collections import defaultdict
from datetime import datetime, timedelta
import httpx
import os
import re
import time


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
    rate_limit(request, max_calls=5, window_seconds=60)

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


# ── Rule-based AI Chatbot (no external API needed) ──────────────────────────
from pydantic import BaseModel as PydanticBase
from typing import Optional

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
