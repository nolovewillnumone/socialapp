"""
Karta Talantov — ML API
========================
FastAPI microservice for talent analysis and career recommendations.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List
import numpy as np

app = FastAPI(
    title="Karta Talantov — ML API",
    version="2.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

TALENTS = ["logic", "creativity", "memory", "leadership", "languages", "music"]

# ── Career map ────────────────────────────────────────────────────────────────
CAREER_MAP = {
    "programmer":   { "ru":"Программист",           "uz":"Dasturchi",             "en":"Software Engineer",     "icon":"💻", "weights":{"logic":0.45,"memory":0.20,"creativity":0.15,"leadership":0.10,"languages":0.05,"music":0.05}, "universities":{"ru":"MIT, Stanford, ИТМО","uz":"MIT, Stanford, INHA","en":"MIT, Stanford, CMU"} },
    "scientist":    { "ru":"Учёный",                 "uz":"Olim",                  "en":"Research Scientist",    "icon":"🔬", "weights":{"logic":0.45,"memory":0.25,"creativity":0.15,"languages":0.10,"leadership":0.03,"music":0.02}, "universities":{"ru":"МГУ, MIT, Harvard","uz":"NUUz, INHA","en":"MIT, Harvard, Oxford"} },
    "designer":     { "ru":"Дизайнер",               "uz":"Dizayner",              "en":"Creative Designer",     "icon":"🎨", "weights":{"creativity":0.50,"logic":0.15,"memory":0.10,"leadership":0.10,"languages":0.10,"music":0.05}, "universities":{"ru":"Британская школа дизайна","uz":"O'zDSMI","en":"Rhode Island, Parsons"} },
    "musician":     { "ru":"Музыкант",               "uz":"Musiqachi",             "en":"Musician",              "icon":"🎵", "weights":{"music":0.55,"creativity":0.25,"memory":0.10,"languages":0.05,"logic":0.03,"leadership":0.02}, "universities":{"ru":"Московская консерватория","uz":"O'zDK","en":"Berklee, Juilliard"} },
    "leader":       { "ru":"Лидер / Предприниматель","uz":"Rahbar / Tadbirkor",    "en":"Leader / Entrepreneur", "icon":"👑", "weights":{"leadership":0.45,"languages":0.20,"logic":0.15,"creativity":0.12,"memory":0.05,"music":0.03}, "universities":{"ru":"Harvard Business, Сколково","uz":"Harvard Business, Westminster","en":"Harvard Business, Wharton"} },
    "linguist":     { "ru":"Лингвист / Переводчик",  "uz":"Tilshunos / Tarjimon",  "en":"Linguist / Translator", "icon":"🗣", "weights":{"languages":0.50,"memory":0.25,"creativity":0.12,"leadership":0.07,"logic":0.04,"music":0.02}, "universities":{"ru":"МГИМО, МГУ","uz":"O'zDJTU","en":"Georgetown, Cambridge"} },
    "engineer":     { "ru":"Инженер",                "uz":"Muhandis",              "en":"Engineer",              "icon":"⚙️", "weights":{"logic":0.40,"creativity":0.25,"memory":0.20,"leadership":0.08,"languages":0.05,"music":0.02}, "universities":{"ru":"МФТИ, Бауманка","uz":"TATU, Turin Polytechnic","en":"MIT, Caltech, ETH Zurich"} },
    "psychologist": { "ru":"Психолог",               "uz":"Psixolog",              "en":"Psychologist",          "icon":"🧠", "weights":{"leadership":0.35,"languages":0.25,"memory":0.20,"creativity":0.12,"logic":0.05,"music":0.03}, "universities":{"ru":"МГУ, ВШЭ","uz":"NUUz","en":"Harvard, Stanford, Cambridge"} },
    "artist":       { "ru":"Художник / Иллюстратор", "uz":"Rassom / Illustrator",  "en":"Artist / Illustrator",  "icon":"🖌️", "weights":{"creativity":0.55,"music":0.20,"memory":0.10,"languages":0.08,"logic":0.05,"leadership":0.02}, "universities":{"ru":"МГХПА Строганова","uz":"O'zDSMI","en":"Parsons, RISD, Royal College of Art"} },
    "diplomat":     { "ru":"Дипломат / Политик",     "uz":"Diplomat / Siyosatchi", "en":"Diplomat / Politician", "icon":"🌍", "weights":{"languages":0.40,"leadership":0.30,"memory":0.15,"logic":0.10,"creativity":0.03,"music":0.02}, "universities":{"ru":"МГИМО, МГУ","uz":"O'zDJTU, TSUE","en":"Georgetown, Oxford, LSE"} },
}

STRENGTH_LABELS = {
    "logic":      {"ru":"Сильное логическое мышление","uz":"Kuchli mantiqiy tafakkur","en":"Strong logical thinking"},
    "creativity": {"ru":"Высокий творческий потенциал","uz":"Yuqori ijodiy salohiyat","en":"High creative potential"},
    "memory":     {"ru":"Отличная память и внимание","uz":"A'lo xotira va diqqat","en":"Excellent memory and attention"},
    "leadership": {"ru":"Природные лидерские качества","uz":"Tabiiy liderlik sifatlari","en":"Natural leadership qualities"},
    "languages":  {"ru":"Талант к языкам и общению","uz":"Til va muloqot iste'dodi","en":"Talent for languages and communication"},
    "music":      {"ru":"Развитый музыкальный интеллект","uz":"Rivojlangan musiqiy intellekt","en":"Developed musical intelligence"},
}

# ── Schemas ───────────────────────────────────────────────────────────────────
class AnalyzeRequest(BaseModel):
    answers: Dict[str, int] = {}
    scores:  Optional[Dict[str, float]] = None   # pre-calculated scores from frontend
    lang:    Optional[str] = "en"

class CareerResult(BaseModel):
    id:            str
    name:          str
    icon:          str
    match_percent: float
    universities:  str = ""

class AnalyzeResponse(BaseModel):
    scores:      Dict[str, float]
    top_talents: List[str]
    careers:     List[CareerResult]
    strengths:   List[str]
    lang:        str


# ── New interest-based scoring from answers ───────────────────────────────────
# Maps each question's answer index to talent scores
# Based on the new interest quiz question structure
INTEREST_SCORE_MAP = {
    "q1":  [{"logic":1.0},{"creativity":0.8},{"music":0.8},{"leadership":0.8}],
    "q2":  [{"logic":1.0},{"creativity":1.0},{"languages":1.0},{"leadership":0.8}],
    "q3":  [{"leadership":1.0},{"creativity":0.8},{"leadership":0.9},{"memory":0.6}],
    "q4":  [{"music":1.0},{"music":0.8},{"music":0.4},{"logic":0.3}],
    "q5":  [{"creativity":1.0},{"languages":1.0},{"logic":1.0},{"music":0.8}],
    "q6":  [{"languages":1.0},{"languages":1.0},{"memory":0.5},{"music":0.4}],
    "q7":  [{"logic":1.0},{"leadership":0.9},{"creativity":1.0},{"languages":0.9}],
    "q8":  [{"leadership":1.0},{"creativity":0.8},{"creativity":1.0},{"leadership":0.8}],
    "q9":  [{"logic":1.0},{"creativity":1.0},{"languages":1.0},{"leadership":1.0}],
    "q10": [{"logic":1.0},{"creativity":1.0},{"leadership":1.0},{"languages":1.0}],
    "q11": [{"music":1.0},{"music":0.85},{"music":0.5},{"logic":0.4}],
    "q12": [{"logic":1.0},{"creativity":1.0},{"languages":1.0},{"leadership":1.0}],
    "q13": [{"creativity":1.0},{"languages":0.9},{"logic":1.0},{"leadership":0.8}],
    "q14": [{"languages":1.0},{"memory":0.8},{"leadership":0.9},{"logic":0.5}],
    "q15": [{"logic":1.0},{"creativity":1.0},{"languages":1.0},{"leadership":1.0}],
}

def compute_scores_from_answers(answers: dict) -> dict:
    """Compute talent scores from interest-based quiz answers."""
    raw    = {t: 0.0 for t in TALENTS}
    counts = {t: 0   for t in TALENTS}

    for qid, ans_idx in answers.items():
        if qid not in INTEREST_SCORE_MAP:
            continue
        options = INTEREST_SCORE_MAP[qid]
        if ans_idx < 0 or ans_idx >= len(options):
            continue
        for talent, score in options[ans_idx].items():
            raw[talent]    += score
            counts[talent] += 1

    # Normalize to 0-100 with some variance
    max_scores = {"logic":5.0,"creativity":5.0,"memory":2.0,"leadership":5.0,"languages":4.0,"music":3.0}
    result = {}
    for t in TALENTS:
        if max_scores[t] > 0:
            pct = (raw[t] / max_scores[t]) * 100
            noise = np.random.uniform(-3, 3)
            result[t] = round(min(100, max(5, pct + noise)), 1)
        else:
            result[t] = 5.0

    return result


def recommend_careers(scores: dict, lang: str = "en", top_n: int = 3) -> list:
    score_vec = np.array([scores.get(t, 0) for t in TALENTS]) / 100.0
    ranked = []
    for career_id, career in CAREER_MAP.items():
        weight_vec  = np.array([career["weights"].get(t, 0) for t in TALENTS])
        match       = float(np.dot(score_vec, weight_vec))
        ranked.append({
            "id":            career_id,
            "name":          career.get(lang, career["en"]),
            "icon":          career["icon"],
            "match_percent": round(match * 100, 1),
            "universities":  career["universities"].get(lang, career["universities"]["en"]),
        })
    ranked.sort(key=lambda x: x["match_percent"], reverse=True)
    return ranked[:top_n]


def get_strengths(scores: dict, lang: str = "en") -> list:
    top3   = sorted(scores, key=scores.get, reverse=True)[:3]
    labels = STRENGTH_LABELS
    return [labels[t][lang] for t in top3 if scores.get(t, 0) >= 20]


# ── Routes ────────────────────────────────────────────────────────────────────
@app.get("/health")
def health():
    return {"status": "ok", "service": "karta-talantov-ml"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(body: AnalyzeRequest):
    lang = body.lang or "en"
    if lang not in ("ru", "uz", "en"):
        lang = "en"

    # Use pre-calculated scores if provided, otherwise compute from answers
    if body.scores and any(v > 0 for v in body.scores.values()):
        scores = {t: float(body.scores.get(t, 5.0)) for t in TALENTS}
    elif body.answers:
        scores = compute_scores_from_answers(body.answers)
    else:
        raise HTTPException(status_code=400, detail="Provide either answers or scores")

    top_talents = sorted(scores, key=scores.get, reverse=True)[:3]
    careers     = recommend_careers(scores, lang=lang)
    strengths   = get_strengths(scores, lang=lang)

    return AnalyzeResponse(
        scores=scores,
        top_talents=top_talents,
        careers=[CareerResult(**c) for c in careers],
        strengths=strengths,
        lang=lang,
    )


@app.get("/talents")
def get_talents():
    return {"talents": TALENTS}
