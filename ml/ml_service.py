"""
Karta Talantov — ML API v3
===========================
20+ career paths, interest-based scoring, trilingual.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List
import numpy as np

app = FastAPI(title="Karta Talantov — ML API", version="3.0.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

TALENTS = ["logic", "creativity", "memory", "leadership", "languages", "music", "sport", "nature", "social"]

# ── 20+ Career Map ────────────────────────────────────────────────────────────
CAREER_MAP = {
    "programmer":    {"ru":"Программист / Разработчик","uz":"Dasturchi","en":"Software Developer","icon":"💻","weights":{"logic":0.40,"creativity":0.20,"memory":0.15,"leadership":0.05,"languages":0.05,"music":0.02,"sport":0.01,"nature":0.02,"social":0.10},"universities":{"ru":"MIT, Stanford, ИТМО","uz":"MIT, Stanford, INHA","en":"MIT, Stanford, CMU"}},
    "data_scientist":{"ru":"Дата-сайентист / AI инженер","uz":"Ma'lumotlar olimi","en":"Data Scientist / AI Engineer","icon":"🤖","weights":{"logic":0.45,"memory":0.20,"creativity":0.15,"languages":0.05,"leadership":0.05,"music":0.01,"sport":0.01,"nature":0.04,"social":0.04},"universities":{"ru":"MIT, Carnegie Mellon, ВШЭ","uz":"MIT, Carnegie Mellon","en":"MIT, Carnegie Mellon, Stanford"}},
    "engineer":      {"ru":"Инженер / Конструктор","uz":"Muhandis","en":"Engineer","icon":"⚙️","weights":{"logic":0.40,"creativity":0.20,"memory":0.20,"leadership":0.05,"languages":0.05,"music":0.01,"sport":0.02,"nature":0.05,"social":0.02},"universities":{"ru":"МФТИ, Бауманка, MIT","uz":"TATU, Turin Polytechnic","en":"MIT, Caltech, ETH Zurich"}},
    "scientist":     {"ru":"Учёный / Исследователь","uz":"Olim","en":"Research Scientist","icon":"🔬","weights":{"logic":0.40,"memory":0.25,"creativity":0.15,"languages":0.10,"leadership":0.02,"music":0.01,"sport":0.01,"nature":0.05,"social":0.01},"universities":{"ru":"МГУ, MIT, Harvard","uz":"NUUz, INHA","en":"MIT, Harvard, Oxford"}},
    "doctor":        {"ru":"Врач / Хирург","uz":"Shifokor","en":"Doctor / Surgeon","icon":"🩺","weights":{"logic":0.25,"memory":0.30,"social":0.20,"nature":0.10,"leadership":0.05,"creativity":0.05,"languages":0.03,"music":0.01,"sport":0.01},"universities":{"ru":"Первый МГМУ, Harvard Medical","uz":"ToshDTU","en":"Harvard Medical, Johns Hopkins"}},
    "psychologist":  {"ru":"Психолог / Терапевт","uz":"Psixolog","en":"Psychologist","icon":"🧠","weights":{"social":0.35,"languages":0.20,"memory":0.15,"leadership":0.10,"creativity":0.10,"logic":0.05,"music":0.03,"sport":0.01,"nature":0.01},"universities":{"ru":"МГУ, ВШЭ, Harvard","uz":"NUUz","en":"Harvard, Stanford, Cambridge"}},
    "designer":      {"ru":"Дизайнер / UX/UI","uz":"Dizayner","en":"Designer / UX-UI","icon":"🎨","weights":{"creativity":0.45,"logic":0.15,"social":0.15,"memory":0.10,"languages":0.05,"music":0.05,"sport":0.01,"nature":0.03,"leadership":0.01},"universities":{"ru":"Британская школа дизайна, Строганова","uz":"O'zDSMI","en":"Rhode Island, Parsons, Royal College of Art"}},
    "artist":        {"ru":"Художник / Иллюстратор","uz":"Rassom","en":"Artist / Illustrator","icon":"🖌️","weights":{"creativity":0.50,"music":0.15,"nature":0.10,"memory":0.10,"languages":0.05,"social":0.05,"logic":0.03,"sport":0.01,"leadership":0.01},"universities":{"ru":"МГХПА, Строганова","uz":"O'zDSMI","en":"Parsons, RISD, Central Saint Martins"}},
    "musician":      {"ru":"Музыкант / Композитор","uz":"Musiqachi","en":"Musician / Composer","icon":"🎵","weights":{"music":0.50,"creativity":0.25,"memory":0.10,"social":0.05,"languages":0.05,"logic":0.02,"sport":0.01,"nature":0.01,"leadership":0.01},"universities":{"ru":"Московская консерватория","uz":"O'zDK","en":"Berklee, Juilliard, Royal Academy of Music"}},
    "actor":         {"ru":"Актёр / Режиссёр","uz":"Aktyor / Rejissyor","en":"Actor / Director","icon":"🎭","weights":{"creativity":0.30,"social":0.25,"music":0.15,"memory":0.15,"languages":0.10,"leadership":0.03,"logic":0.01,"sport":0.01,"nature":0.00},"universities":{"ru":"ГИТИС, Щукинское","uz":"O'zDSI","en":"Juilliard, RADA, NYU Tisch"}},
    "writer":        {"ru":"Писатель / Журналист","uz":"Yozuvchi / Jurnalist","en":"Writer / Journalist","icon":"✍️","weights":{"languages":0.40,"creativity":0.25,"memory":0.15,"social":0.10,"music":0.03,"logic":0.03,"leadership":0.02,"sport":0.01,"nature":0.01},"universities":{"ru":"МГУ журфак, Литинститут","uz":"O'zDJTU","en":"Columbia, Northwestern, Oxford"}},
    "linguist":      {"ru":"Лингвист / Переводчик","uz":"Tilshunos","en":"Linguist / Translator","icon":"🌍","weights":{"languages":0.50,"memory":0.20,"creativity":0.10,"social":0.10,"logic":0.05,"music":0.02,"sport":0.01,"nature":0.01,"leadership":0.01},"universities":{"ru":"МГИМО, МГУ","uz":"O'zDJTU","en":"Georgetown, Cambridge, Middlebury"}},
    "diplomat":      {"ru":"Дипломат / Политик","uz":"Diplomat","en":"Diplomat / Politician","icon":"🤝","weights":{"languages":0.30,"leadership":0.30,"social":0.20,"memory":0.10,"logic":0.05,"creativity":0.02,"music":0.01,"sport":0.01,"nature":0.01},"universities":{"ru":"МГИМО, МГУ","uz":"O'zDJTU, TSUE","en":"Georgetown, Oxford, LSE"}},
    "leader":        {"ru":"Предприниматель / CEO","uz":"Tadbirkor / CEO","en":"Entrepreneur / CEO","icon":"👑","weights":{"leadership":0.40,"social":0.20,"logic":0.15,"creativity":0.10,"languages":0.10,"memory":0.02,"music":0.01,"sport":0.01,"nature":0.01},"universities":{"ru":"Harvard Business, Сколково","uz":"Westminster, TSUE","en":"Harvard Business, Wharton, INSEAD"}},
    "teacher":       {"ru":"Учитель / Педагог","uz":"O'qituvchi","en":"Teacher / Educator","icon":"📚","weights":{"social":0.35,"languages":0.20,"memory":0.15,"leadership":0.15,"creativity":0.10,"logic":0.02,"music":0.01,"sport":0.01,"nature":0.01},"universities":{"ru":"МПГУ, МГУ педфак","uz":"NUUz","en":"Harvard Ed, Stanford Ed, Oxford Ed"}},
    "athlete":       {"ru":"Спортсмен / Тренер","uz":"Sportchi / Murabbiy","en":"Athlete / Coach","icon":"🏆","weights":{"sport":0.50,"leadership":0.20,"social":0.15,"memory":0.05,"logic":0.04,"creativity":0.03,"languages":0.01,"music":0.01,"nature":0.01},"universities":{"ru":"РГУФКСМИТ, Лесгафта","uz":"O'zDSIM","en":"IMG Academy, Ohio State, UCLA"}},
    "biologist":     {"ru":"Биолог / Эколог","uz":"Biolog / Ekolog","en":"Biologist / Ecologist","icon":"🌿","weights":{"nature":0.40,"logic":0.25,"memory":0.20,"creativity":0.05,"social":0.05,"languages":0.03,"music":0.01,"sport":0.01,"leadership":0.00},"universities":{"ru":"МГУ биофак, MIT","uz":"NUUz","en":"MIT, Harvard, Cambridge"}},
    "chef":          {"ru":"Шеф-повар","uz":"Oshpaz","en":"Chef / Culinary Artist","icon":"👨‍🍳","weights":{"creativity":0.35,"nature":0.25,"social":0.20,"memory":0.10,"music":0.05,"logic":0.02,"languages":0.02,"sport":0.01,"leadership":0.00},"universities":{"ru":"Кулинарная академия","uz":"Oziq-ovqat instituti","en":"Le Cordon Bleu, CIA New York"}},
    "architect":     {"ru":"Архитектор","uz":"Arxitektor","en":"Architect","icon":"🏛️","weights":{"creativity":0.35,"logic":0.25,"nature":0.15,"memory":0.10,"social":0.05,"languages":0.04,"music":0.03,"sport":0.01,"leadership":0.02},"universities":{"ru":"МАРХИ, ВШЭ","uz":"TAQI","en":"Harvard GSD, ETH Zurich, AA London"}},
    "lawyer":        {"ru":"Юрист / Адвокат","uz":"Yurist / Advokat","en":"Lawyer / Attorney","icon":"⚖️","weights":{"logic":0.35,"languages":0.25,"memory":0.20,"social":0.10,"leadership":0.05,"creativity":0.03,"music":0.01,"sport":0.01,"nature":0.00},"universities":{"ru":"МГЮА, МГУ юрфак","uz":"ТДЮИ","en":"Harvard Law, Yale Law, Oxford Law"}},
    "economist":     {"ru":"Экономист / Финансист","uz":"Iqtisodchi","en":"Economist / Financier","icon":"📊","weights":{"logic":0.35,"memory":0.20,"languages":0.15,"leadership":0.15,"social":0.10,"creativity":0.03,"music":0.01,"sport":0.01,"nature":0.00},"universities":{"ru":"ВШЭ, МГУ, London School of Economics","uz":"TSUE, Westminster","en":"LSE, Harvard, Wharton"}},
    "pilot":         {"ru":"Пилот / Авиатор","uz":"Pilot","en":"Pilot / Aviator","icon":"✈️","weights":{"logic":0.35,"memory":0.25,"sport":0.15,"leadership":0.10,"social":0.05,"nature":0.05,"creativity":0.02,"languages":0.02,"music":0.01},"universities":{"ru":"УВАУГА, лётные училища","uz":"O'zAeronavigatsiya","en":"Embry-Riddle, USAF Academy"}},
    "gamer_dev":     {"ru":"Геймдизайнер / Разработчик игр","uz":"O'yin dizayneri","en":"Game Designer / Developer","icon":"🎮","weights":{"creativity":0.30,"logic":0.25,"music":0.15,"social":0.10,"memory":0.10,"languages":0.05,"sport":0.02,"nature":0.01,"leadership":0.02},"universities":{"ru":"ВШЭ gamedev, GameDesignSchool","uz":"INHA","en":"DigiPen, USC Games, Carnegie Mellon"}},
}

STRENGTH_LABELS = {
    "logic":      {"ru":"Сильное логическое мышление","uz":"Kuchli mantiqiy tafakkur","en":"Strong logical thinking"},
    "creativity": {"ru":"Высокий творческий потенциал","uz":"Yuqori ijodiy salohiyat","en":"High creative potential"},
    "memory":     {"ru":"Отличная память и внимание","uz":"A'lo xotira va diqqat","en":"Excellent memory and attention"},
    "leadership": {"ru":"Природные лидерские качества","uz":"Tabiiy liderlik sifatlari","en":"Natural leadership qualities"},
    "languages":  {"ru":"Талант к языкам и общению","uz":"Til va muloqot iste'dodi","en":"Talent for languages"},
    "music":      {"ru":"Развитый музыкальный интеллект","uz":"Musiqiy intellekt","en":"Musical intelligence"},
    "sport":      {"ru":"Высокая физическая активность","uz":"Yuqori jismoniy faollik","en":"High physical energy"},
    "nature":     {"ru":"Любовь к природе и живому миру","uz":"Tabiatga muhabbat","en":"Love for nature and living world"},
    "social":     {"ru":"Высокий эмоциональный интеллект","uz":"Yuqori hissiy intellekt","en":"High emotional intelligence"},
}

# ── Interest score map (q1-q30) ───────────────────────────────────────────────
# Each answer maps to a talent with a weight
INTEREST_MAP = {
    "q1":  [{"logic":1.0},{"creativity":0.9},{"music":0.9},{"social":0.8}],
    "q2":  [{"logic":1.0},{"creativity":1.0},{"languages":1.0},{"social":0.9}],
    "q3":  [{"leadership":1.0},{"creativity":0.8},{"social":0.9},{"memory":0.6}],
    "q4":  [{"music":1.0},{"music":0.8},{"music":0.4},{"logic":0.3}],
    "q5":  [{"creativity":1.0},{"languages":1.0},{"logic":1.0},{"music":0.9}],
    "q6":  [{"languages":1.0},{"languages":1.0},{"memory":0.5},{"music":0.4}],
    "q7":  [{"logic":1.0},{"social":0.9},{"creativity":1.0},{"languages":0.9}],
    "q8":  [{"leadership":1.0},{"creativity":0.8},{"creativity":1.0},{"social":0.9}],
    "q9":  [{"logic":1.0},{"creativity":1.0},{"languages":1.0},{"leadership":1.0}],
    "q10": [{"logic":1.0},{"creativity":1.0},{"social":1.0},{"languages":1.0}],
    "q11": [{"music":1.0},{"music":0.85},{"music":0.5},{"logic":0.4}],
    "q12": [{"logic":1.0},{"creativity":1.0},{"languages":1.0},{"leadership":1.0}],
    "q13": [{"creativity":1.0},{"languages":0.9},{"logic":1.0},{"social":0.8}],
    "q14": [{"languages":1.0},{"memory":0.8},{"leadership":0.9},{"logic":0.5}],
    "q15": [{"logic":1.0},{"creativity":1.0},{"languages":1.0},{"leadership":1.0}],
    # New questions
    "q16": [{"sport":1.0},{"nature":1.0},{"creativity":0.8},{"logic":0.7}],
    "q17": [{"social":1.0},{"leadership":0.9},{"creativity":0.8},{"memory":0.7}],
    "q18": [{"nature":1.0},{"logic":0.9},{"creativity":0.8},{"social":0.7}],
    "q19": [{"sport":1.0},{"sport":0.9},{"social":0.8},{"logic":0.6}],
    "q20": [{"logic":1.0},{"creativity":1.0},{"social":1.0},{"nature":0.9}],
    "q21": [{"creativity":1.0},{"music":0.9},{"logic":0.8},{"social":0.7}],
    "q22": [{"social":1.0},{"languages":0.9},{"leadership":0.9},{"creativity":0.7}],
    "q23": [{"nature":1.0},{"sport":0.9},{"creativity":0.8},{"logic":0.7}],
    "q24": [{"leadership":1.0},{"social":0.9},{"languages":0.8},{"creativity":0.7}],
    "q25": [{"logic":1.0},{"creativity":0.9},{"nature":0.8},{"social":0.7}],
    "q26": [{"music":1.0},{"creativity":0.9},{"social":0.8},{"logic":0.6}],
    "q27": [{"sport":1.0},{"leadership":0.9},{"social":0.8},{"logic":0.6}],
    "q28": [{"languages":1.0},{"social":0.9},{"creativity":0.8},{"music":0.7}],
    "q29": [{"nature":1.0},{"logic":0.9},{"sport":0.8},{"creativity":0.7}],
    "q30": [{"creativity":1.0},{"logic":0.9},{"music":0.8},{"leadership":0.7}],
}

MAX_SCORES = {"logic":6.0,"creativity":6.0,"memory":2.0,"leadership":5.0,"languages":5.0,"music":4.0,"sport":3.0,"nature":3.0,"social":5.0}


class AnalyzeRequest(BaseModel):
    answers: Dict[str, int] = {}
    scores:  Optional[Dict[str, float]] = None
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


def compute_scores(answers: dict) -> dict:
    raw = {t: 0.0 for t in TALENTS}
    for qid, idx in answers.items():
        if qid not in INTEREST_MAP: continue
        opts = INTEREST_MAP[qid]
        if 0 <= idx < len(opts):
            for talent, score in opts[idx].items():
                raw[talent] = raw.get(talent, 0) + score
    result = {}
    for t in TALENTS:
        mx = MAX_SCORES.get(t, 5.0)
        pct = (raw.get(t, 0) / mx) * 100
        noise = np.random.uniform(-2, 2)
        result[t] = round(min(100, max(5, pct + noise)), 1)
    return result


def recommend_careers(scores: dict, lang: str, top_n: int = 5) -> list:
    vec = np.array([scores.get(t, 0) for t in TALENTS]) / 100.0
    ranked = []
    for cid, c in CAREER_MAP.items():
        wv = np.array([c["weights"].get(t, 0) for t in TALENTS])
        match = float(np.dot(vec, wv))
        ranked.append({
            "id": cid,
            "name": c.get(lang, c["en"]),
            "icon": c["icon"],
            "match_percent": round(match * 100, 1),
            "universities": c["universities"].get(lang, c["universities"]["en"]),
        })
    ranked.sort(key=lambda x: x["match_percent"], reverse=True)
    return ranked[:top_n]


def get_strengths(scores: dict, lang: str) -> list:
    top = sorted(scores, key=scores.get, reverse=True)[:3]
    return [STRENGTH_LABELS[t][lang] for t in top if scores.get(t, 0) >= 20]


@app.get("/health")
def health():
    return {"status": "ok", "service": "karta-talantov-ml", "version": "3.0"}

@app.get("/talents")
def get_talents():
    return {"talents": TALENTS}

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(body: AnalyzeRequest):
    lang = body.lang if body.lang in ("ru","uz","en") else "en"
    if body.scores and any(v > 0 for v in body.scores.values()):
        scores = {t: float(body.scores.get(t, 5.0)) for t in TALENTS}
        # Fill missing new talents
        for t in TALENTS:
            if t not in scores:
                scores[t] = 5.0
    elif body.answers:
        scores = compute_scores(body.answers)
    else:
        raise HTTPException(status_code=400, detail="Provide answers or scores")

    top_talents = sorted(scores, key=scores.get, reverse=True)[:3]
    careers     = recommend_careers(scores, lang)
    strengths   = get_strengths(scores, lang)

    return AnalyzeResponse(
        scores=scores,
        top_talents=top_talents,
        careers=[CareerResult(**c) for c in careers],
        strengths=strengths,
        lang=lang,
    )
