"""
Karta Talantov — ML API v4
===========================
35+ career paths, 9 talent dimensions, interest-based scoring.
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, List
import numpy as np

app = FastAPI(title="Karta Talantov — ML API", version="4.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

TALENTS = ["logic", "creativity", "memory", "leadership", "languages", "music", "sport", "nature", "social"]

# ── 35+ Career Map ─────────────────────────────────────────────────────────────
CAREER_MAP = {
    # Tech & Science
    "programmer":     {"ru":"Программист","uz":"Dasturchi","en":"Programmer","icon":"💻","weights":{"logic":0.45,"creativity":0.15,"memory":0.10,"social":0.10,"languages":0.05,"leadership":0.05,"music":0.03,"sport":0.02,"nature":0.05},"universities":{"ru":"MIT, Stanford, ИТМО","uz":"MIT, Stanford, INHA","en":"MIT, Stanford, CMU"}},
    "data_scientist": {"ru":"Data Scientist / AI","uz":"Data Scientist","en":"Data Scientist / AI","icon":"🤖","weights":{"logic":0.50,"memory":0.20,"creativity":0.10,"languages":0.05,"social":0.05,"leadership":0.04,"music":0.01,"sport":0.01,"nature":0.04},"universities":{"ru":"MIT, Carnegie Mellon","uz":"MIT, Carnegie Mellon","en":"MIT, Carnegie Mellon, Stanford"}},
    "engineer":       {"ru":"Инженер","uz":"Muhandis","en":"Engineer","icon":"⚙️","weights":{"logic":0.40,"creativity":0.20,"memory":0.15,"nature":0.10,"leadership":0.05,"social":0.05,"languages":0.03,"music":0.01,"sport":0.01},"universities":{"ru":"МФТИ, Бауманка","uz":"TATU, Turin Polytechnic","en":"MIT, Caltech, ETH Zurich"}},
    "scientist":      {"ru":"Учёный","uz":"Olim","en":"Research Scientist","icon":"🔬","weights":{"logic":0.40,"memory":0.25,"creativity":0.10,"nature":0.12,"languages":0.07,"leadership":0.02,"social":0.02,"music":0.01,"sport":0.01},"universities":{"ru":"МГУ, MIT, Harvard","uz":"NUUz, INHA","en":"MIT, Harvard, Oxford"}},
    "doctor":         {"ru":"Врач / Хирург","uz":"Shifokor","en":"Doctor / Surgeon","icon":"🩺","weights":{"memory":0.30,"social":0.25,"logic":0.20,"nature":0.10,"leadership":0.08,"creativity":0.04,"languages":0.02,"music":0.01,"sport":0.00},"universities":{"ru":"Первый МГМУ, Harvard Med","uz":"ToshDTU","en":"Harvard Medical, Johns Hopkins"}},
    "biologist":      {"ru":"Биолог / Эколог","uz":"Biolog / Ekolog","en":"Biologist / Ecologist","icon":"🌿","weights":{"nature":0.45,"logic":0.25,"memory":0.15,"creativity":0.05,"social":0.04,"languages":0.03,"leadership":0.01,"music":0.01,"sport":0.01},"universities":{"ru":"МГУ биофак, MIT","uz":"NUUz — Biologiya","en":"MIT, Harvard, Cambridge"}},
    "architect":      {"ru":"Архитектор","uz":"Arxitektor","en":"Architect","icon":"🏛️","weights":{"creativity":0.35,"logic":0.25,"nature":0.15,"memory":0.10,"social":0.08,"languages":0.03,"music":0.02,"sport":0.01,"leadership":0.01},"universities":{"ru":"МАРХИ, ВШЭ","uz":"TAQI","en":"Harvard GSD, ETH Zurich, AA London"}},
    "pilot":          {"ru":"Пилот / Авиатор","uz":"Pilot","en":"Pilot / Aviator","icon":"✈️","weights":{"logic":0.35,"memory":0.25,"sport":0.15,"leadership":0.10,"social":0.05,"nature":0.05,"creativity":0.02,"languages":0.02,"music":0.01},"universities":{"ru":"УВАУГА, лётные училища","uz":"O'zAeronavigatsiya","en":"Embry-Riddle, USAF Academy"}},

    # Creative Arts
    "designer":       {"ru":"Дизайнер / UX-UI","uz":"Dizayner","en":"Designer / UX-UI","icon":"🎨","weights":{"creativity":0.50,"logic":0.15,"social":0.15,"memory":0.08,"music":0.05,"languages":0.03,"nature":0.02,"leadership":0.01,"sport":0.01},"universities":{"ru":"Британская школа дизайна","uz":"O'zDSMI","en":"Rhode Island, Parsons, Royal College"}},
    "artist":         {"ru":"Художник / Иллюстратор","uz":"Rassom","en":"Artist / Illustrator","icon":"🖌️","weights":{"creativity":0.55,"music":0.15,"nature":0.10,"memory":0.08,"social":0.05,"languages":0.03,"logic":0.02,"sport":0.01,"leadership":0.01},"universities":{"ru":"МГХПА Строганова","uz":"O'zDSMI","en":"Parsons, RISD, Central Saint Martins"}},
    "musician":       {"ru":"Музыкант / Композитор","uz":"Musiqachi","en":"Musician / Composer","icon":"🎵","weights":{"music":0.55,"creativity":0.25,"memory":0.10,"social":0.05,"languages":0.02,"logic":0.01,"sport":0.01,"nature":0.01,"leadership":0.00},"universities":{"ru":"Московская консерватория","uz":"O'zDK","en":"Berklee, Juilliard, Royal Academy"}},
    "singer":         {"ru":"Певец / Вокалист","uz":"Qo'shiqchi","en":"Singer / Vocalist","icon":"🎤","weights":{"music":0.50,"creativity":0.20,"social":0.15,"memory":0.08,"languages":0.04,"leadership":0.02,"sport":0.01,"nature":0.00,"logic":0.00},"universities":{"ru":"ГИТИС, Консерватория","uz":"O'zDK","en":"Berklee, Juilliard, Trinity Laban"}},
    "dancer":         {"ru":"Танцор / Хореограф","uz":"Raqqos / Xoreograf","en":"Dancer / Choreographer","icon":"💃","weights":{"sport":0.30,"creativity":0.30,"music":0.20,"social":0.10,"memory":0.05,"leadership":0.03,"nature":0.01,"languages":0.01,"logic":0.00},"universities":{"ru":"ГИТИС, Академия Вагановой","uz":"O'zDSI","en":"Juilliard, RADA, Rambert School"}},
    "actor":          {"ru":"Актёр / Режиссёр","uz":"Aktyor / Rejissyor","en":"Actor / Director","icon":"🎭","weights":{"creativity":0.30,"social":0.25,"music":0.15,"memory":0.15,"languages":0.10,"leadership":0.03,"logic":0.01,"sport":0.01,"nature":0.00},"universities":{"ru":"ГИТИС, Щукинское","uz":"O'zDSI","en":"Juilliard, RADA, NYU Tisch"}},
    "filmmaker":      {"ru":"Режиссёр / Видеограф","uz":"Rejissyor / Videograf","en":"Filmmaker / Videographer","icon":"🎬","weights":{"creativity":0.40,"social":0.20,"music":0.15,"leadership":0.10,"memory":0.07,"languages":0.03,"logic":0.03,"sport":0.01,"nature":0.01},"universities":{"ru":"ВГИК, USC Film","uz":"O'zDSI","en":"USC Film, NYU Tisch, AFI"}},
    "game_developer": {"ru":"Геймдизайнер","uz":"O'yin dizayneri","en":"Game Developer","icon":"🎮","weights":{"creativity":0.30,"logic":0.30,"music":0.15,"memory":0.10,"social":0.08,"languages":0.03,"sport":0.02,"nature":0.01,"leadership":0.01},"universities":{"ru":"ВШЭ gamedev, GameDesignSchool","uz":"INHA","en":"DigiPen, USC Games, Carnegie Mellon"}},
    "photographer":   {"ru":"Фотограф / Оператор","uz":"Fotograf","en":"Photographer","icon":"📷","weights":{"creativity":0.45,"nature":0.20,"social":0.15,"memory":0.08,"music":0.05,"logic":0.03,"languages":0.02,"sport":0.01,"leadership":0.01},"universities":{"ru":"ВГИК, RCA","uz":"O'zDSMI","en":"Royal College of Art, NYU, ICP"}},

    # Communication & Social
    "journalist":     {"ru":"Журналист / Репортёр","uz":"Jurnalist","en":"Journalist / Reporter","icon":"📰","weights":{"languages":0.35,"social":0.25,"creativity":0.15,"memory":0.10,"leadership":0.08,"logic":0.03,"music":0.02,"sport":0.01,"nature":0.01},"universities":{"ru":"МГУ журфак, Columbia","uz":"O'zDJTU","en":"Columbia, Northwestern, Reuters Inst"}},
    "writer":         {"ru":"Писатель / Блогер","uz":"Yozuvchi / Blogger","en":"Writer / Blogger","icon":"✍️","weights":{"languages":0.40,"creativity":0.30,"memory":0.15,"social":0.08,"music":0.03,"logic":0.02,"leadership":0.01,"sport":0.01,"nature":0.00},"universities":{"ru":"Литинститут, МГУ","uz":"O'zDJTU","en":"Columbia, Iowa Writers, Oxford"}},
    "linguist":       {"ru":"Лингвист / Переводчик","uz":"Tilshunos / Tarjimon","en":"Linguist / Translator","icon":"🗣","weights":{"languages":0.55,"memory":0.20,"creativity":0.10,"social":0.08,"logic":0.04,"music":0.01,"sport":0.01,"nature":0.01,"leadership":0.00},"universities":{"ru":"МГИМО, МГУ","uz":"O'zDJTU","en":"Georgetown, Cambridge, Middlebury"}},
    "diplomat":       {"ru":"Дипломат / Политик","uz":"Diplomat","en":"Diplomat / Politician","icon":"🌍","weights":{"languages":0.30,"leadership":0.30,"social":0.20,"memory":0.10,"logic":0.05,"creativity":0.02,"music":0.01,"sport":0.01,"nature":0.01},"universities":{"ru":"МГИМО, МГУ","uz":"O'zDJTU, TSUE","en":"Georgetown, Oxford, LSE"}},
    "psychologist":   {"ru":"Психолог / Терапевт","uz":"Psixolog","en":"Psychologist","icon":"🧠","weights":{"social":0.40,"memory":0.20,"languages":0.15,"leadership":0.10,"creativity":0.08,"logic":0.04,"music":0.01,"sport":0.01,"nature":0.01},"universities":{"ru":"МГУ, ВШЭ, Harvard","uz":"NUUz","en":"Harvard, Stanford, Cambridge"}},
    "teacher":        {"ru":"Учитель / Педагог","uz":"O'qituvchi","en":"Teacher / Educator","icon":"📚","weights":{"social":0.35,"languages":0.20,"memory":0.15,"leadership":0.15,"creativity":0.10,"logic":0.02,"music":0.01,"sport":0.01,"nature":0.01},"universities":{"ru":"МПГУ, МГУ педфак","uz":"NUUz","en":"Harvard Ed, Stanford Ed"}},
    "hr_manager":     {"ru":"HR-менеджер","uz":"HR-menejer","en":"HR Manager","icon":"🤝","weights":{"social":0.45,"leadership":0.25,"languages":0.15,"memory":0.08,"creativity":0.04,"logic":0.01,"music":0.01,"sport":0.01,"nature":0.00},"universities":{"ru":"ВШЭ, РАНХИГС","uz":"TSUE, Westminster","en":"Cornell ILR, Michigan Ross, LSE"}},

    # Business & Leadership
    "entrepreneur":   {"ru":"Предприниматель / CEO","uz":"Tadbirkor / CEO","en":"Entrepreneur / CEO","icon":"👑","weights":{"leadership":0.40,"social":0.20,"logic":0.15,"creativity":0.12,"languages":0.08,"memory":0.02,"music":0.01,"sport":0.01,"nature":0.01},"universities":{"ru":"Harvard Business, Сколково","uz":"Westminster, TSUE","en":"Harvard Business, Wharton, INSEAD"}},
    "lawyer":         {"ru":"Юрист / Адвокат","uz":"Yurist / Advokat","en":"Lawyer / Attorney","icon":"⚖️","weights":{"logic":0.35,"languages":0.25,"memory":0.20,"social":0.10,"leadership":0.05,"creativity":0.03,"music":0.01,"sport":0.01,"nature":0.00},"universities":{"ru":"МГЮА, МГУ юрфак","uz":"ТДЮИ","en":"Harvard Law, Yale Law, Oxford"}},
    "economist":      {"ru":"Экономист / Финансист","uz":"Iqtisodchi","en":"Economist / Financier","icon":"📊","weights":{"logic":0.40,"memory":0.20,"languages":0.15,"leadership":0.10,"social":0.08,"creativity":0.03,"music":0.01,"sport":0.01,"nature":0.02},"universities":{"ru":"ВШЭ, МГУ, LSE","uz":"TSUE, Westminster","en":"LSE, Harvard, Wharton"}},
    "marketer":       {"ru":"Маркетолог / SMM","uz":"Marketolog","en":"Marketer / SMM","icon":"📱","weights":{"creativity":0.30,"social":0.25,"languages":0.20,"leadership":0.10,"logic":0.08,"memory":0.04,"music":0.02,"sport":0.01,"nature":0.00},"universities":{"ru":"ВШЭ, РАНХиГС","uz":"TSUE","en":"Wharton, Kellogg, LSE"}},

    # Sport & Health
    "athlete":        {"ru":"Спортсмен / Тренер","uz":"Sportchi / Murabbiy","en":"Athlete / Coach","icon":"🏆","weights":{"sport":0.55,"leadership":0.18,"social":0.12,"memory":0.05,"logic":0.04,"creativity":0.03,"languages":0.01,"music":0.01,"nature":0.01},"universities":{"ru":"РГУФКСМИТ, Лесгафта","uz":"O'zDSIM","en":"IMG Academy, Ohio State, UCLA"}},
    "nutritionist":   {"ru":"Диетолог / Нутрициолог","uz":"Diyetolog","en":"Nutritionist / Dietitian","icon":"🥗","weights":{"nature":0.30,"social":0.25,"memory":0.20,"logic":0.15,"creativity":0.05,"sport":0.03,"languages":0.01,"music":0.01,"leadership":0.00},"universities":{"ru":"РГУФКСМИТ, МГМУ","uz":"ToshDTU","en":"UC Davis, Tufts, King's College"}},
    "physiotherapist":{"ru":"Физиотерапевт","uz":"Fizioterapevt","en":"Physiotherapist","icon":"💪","weights":{"sport":0.30,"social":0.25,"nature":0.20,"memory":0.15,"logic":0.05,"creativity":0.02,"languages":0.01,"music":0.01,"leadership":0.01},"universities":{"ru":"РГУФКСМИТ, МГМУ","uz":"ToshDTU","en":"King's College, Melbourne, USC"}},

    # Nature & Environment
    "veterinarian":   {"ru":"Ветеринар","uz":"Veterinar","en":"Veterinarian","icon":"🐾","weights":{"nature":0.45,"social":0.20,"memory":0.20,"logic":0.08,"creativity":0.03,"sport":0.02,"languages":0.01,"music":0.01,"leadership":0.00},"universities":{"ru":"МВА, МГАВМ","uz":"SamDVM","en":"Cornell Vet, UC Davis, Edinburgh"}},
    "chef":           {"ru":"Шеф-повар","uz":"Oshpaz","en":"Chef / Culinary Artist","icon":"👨‍🍳","weights":{"creativity":0.35,"nature":0.25,"social":0.20,"memory":0.10,"music":0.05,"logic":0.02,"languages":0.02,"sport":0.01,"leadership":0.00},"universities":{"ru":"Кулинарная академия","uz":"Oziq-ovqat instituti","en":"Le Cordon Bleu, CIA New York"}},
    "environmental_scientist":{"ru":"Эколог / Учёный-природовед","uz":"Ekolog","en":"Environmental Scientist","icon":"♻️","weights":{"nature":0.50,"logic":0.25,"memory":0.10,"creativity":0.05,"social":0.05,"leadership":0.02,"languages":0.01,"music":0.01,"sport":0.01},"universities":{"ru":"МГУ биофак, МИРЭА","uz":"NUUz","en":"MIT, Stanford, ETH Zurich"}},

    # Digital & Media
    "content_creator":{"ru":"Контент-мейкер / YouTube","uz":"Kontent yaratuvchi","en":"Content Creator / YouTuber","icon":"📹","weights":{"creativity":0.35,"social":0.25,"music":0.15,"languages":0.10,"leadership":0.08,"memory":0.03,"logic":0.02,"sport":0.01,"nature":0.01},"universities":{"ru":"ВШЭ медиа, МГИМО","uz":"O'zDJTU","en":"USC, NYU, Emerson"}},
    "animator":       {"ru":"Аниматор / Моушн-дизайнер","uz":"Animator","en":"Animator / Motion Designer","icon":"✨","weights":{"creativity":0.45,"logic":0.15,"music":0.15,"memory":0.10,"social":0.08,"languages":0.03,"sport":0.02,"nature":0.01,"leadership":0.01},"universities":{"ru":"ВГИК, ВШЭ дизайн","uz":"O'zDSMI","en":"CalArts, Ringling, Gobelins"}},
    "fashion_designer":{"ru":"Дизайнер одежды","uz":"Kiyim dizayneri","en":"Fashion Designer","icon":"👗","weights":{"creativity":0.50,"social":0.20,"music":0.10,"memory":0.08,"nature":0.05,"languages":0.03,"logic":0.02,"sport":0.01,"leadership":0.01},"universities":{"ru":"МГУДТ, Esmod","uz":"O'zDSMI","en":"Parsons, Central Saint Martins, FIT"}},
}

STRENGTH_LABELS = {
    "logic":      {"ru":"Сильное логическое мышление","uz":"Kuchli mantiqiy tafakkur","en":"Strong logical thinking"},
    "creativity": {"ru":"Высокий творческий потенциал","uz":"Yuqori ijodiy salohiyat","en":"High creative potential"},
    "memory":     {"ru":"Отличная память и внимание","uz":"A'lo xotira va diqqat","en":"Excellent memory and attention"},
    "leadership": {"ru":"Природные лидерские качества","uz":"Tabiiy liderlik sifatlari","en":"Natural leadership qualities"},
    "languages":  {"ru":"Талант к языкам и общению","uz":"Til va muloqot iste'dodi","en":"Talent for languages"},
    "music":      {"ru":"Развитый музыкальный интеллект","uz":"Musiqiy intellekt","en":"Musical intelligence"},
    "sport":      {"ru":"Высокая физическая активность и спорт","uz":"Yuqori jismoniy faollik","en":"High physical energy and sport"},
    "nature":     {"ru":"Любовь к природе и живому миру","uz":"Tabiatga muhabbat","en":"Love for nature and living world"},
    "social":     {"ru":"Высокий эмоциональный интеллект","uz":"Yuqori hissiy intellekt","en":"High emotional intelligence"},
}

INTEREST_MAP = {
    "q1": [{"logic":1.0},{"creativity":0.9},{"music":0.9},{"social":0.8}],
    "q2": [{"logic":1.0},{"creativity":1.0},{"languages":1.0},{"nature":0.9}],
    "q3": [{"leadership":1.0},{"creativity":0.8},{"social":0.9},{"nature":0.6}],
    "q4": [{"music":1.0},{"music":0.8},{"music":0.4},{"logic":0.3}],
    "q5": [{"creativity":1.0},{"languages":1.0},{"logic":1.0},{"music":0.9}],
    "q6": [{"languages":1.0},{"languages":1.0},{"memory":0.5},{"music":0.4}],
    "q7": [{"logic":1.0},{"social":0.9},{"creativity":1.0},{"nature":0.9}],
    "q8": [{"leadership":1.0},{"creativity":0.8},{"creativity":1.0},{"social":0.9}],
    "q9": [{"logic":1.0},{"creativity":1.0},{"languages":1.0},{"leadership":1.0}],
    "q10":[{"logic":1.0},{"creativity":1.0},{"social":1.0},{"leadership":0.9}],
    "q11":[{"music":1.0},{"music":0.85},{"music":0.5},{"logic":0.4}],
    "q12":[{"logic":1.0},{"creativity":1.0},{"languages":1.0},{"leadership":1.0}],
    "q13":[{"creativity":1.0},{"languages":0.9},{"logic":1.0},{"sport":0.9}],
    "q14":[{"languages":1.0},{"memory":0.8},{"sport":0.7},{"creativity":0.7}],
    "q15":[{"logic":1.0},{"creativity":1.0},{"languages":1.0},{"leadership":1.0}],
    "q16":[{"sport":1.0},{"nature":1.0},{"creativity":0.8},{"logic":0.7}],
    "q17":[{"social":1.0},{"leadership":0.9},{"creativity":0.8},{"memory":0.6}],
    "q18":[{"nature":1.0},{"logic":0.9},{"creativity":0.8},{"languages":0.7}],
    "q19":[{"sport":1.0},{"sport":0.9},{"social":0.7},{"logic":0.6}],
    "q20":[{"logic":1.0},{"creativity":1.0},{"social":1.0},{"nature":0.9}],
    "q21":[{"creativity":1.0},{"music":0.9},{"logic":0.8},{"social":0.7}],
    "q22":[{"social":1.0},{"social":0.9},{"creativity":0.8},{"leadership":0.9}],
    "q23":[{"nature":1.0},{"sport":0.8},{"nature":0.9},{"social":0.6}],
    "q24":[{"leadership":1.0},{"logic":0.9},{"creativity":0.9},{"sport":0.9}],
    "q25":[{"logic":1.0},{"creativity":0.9},{"social":1.0},{"nature":0.9}],
    "q26":[{"music":1.0},{"music":0.9},{"music":0.5},{"creativity":0.8}],
    "q27":[{"sport":1.0},{"sport":0.7},{"social":0.8},{"logic":0.7}],
    "q28":[{"languages":1.0},{"languages":0.9},{"languages":0.5},{"memory":0.6}],
    "q29":[{"nature":1.0},{"logic":0.9},{"nature":0.8},{"social":0.8}],
    "q30":[{"logic":0.8},{"creativity":1.0},{"music":1.0},{"leadership":1.0}],
}

MAX_SCORES = {"logic":7.0,"creativity":8.0,"memory":2.0,"leadership":6.0,"languages":6.0,"music":5.0,"sport":4.0,"nature":5.0,"social":6.0}


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
            for t, v in opts[idx].items():
                raw[t] = raw.get(t, 0) + v
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
        noise = np.random.uniform(-0.015, 0.015)
        ranked.append({
            "id": cid,
            "name": c.get(lang, c["en"]),
            "icon": c["icon"],
            "match_percent": round((match + noise) * 100, 1),
            "universities": c["universities"].get(lang, c["universities"]["en"]),
        })
    ranked.sort(key=lambda x: x["match_percent"], reverse=True)

    # Diversity: max 2 from tech cluster, max 2 from creative cluster
    TECH    = {"programmer","data_scientist","engineer","scientist"}
    CREATIVE= {"designer","artist","filmmaker","animator","fashion_designer","game_developer"}
    result, tech_c, creative_c = [], 0, 0
    for r in ranked:
        if r["id"] in TECH:
            if tech_c >= 2: continue
            tech_c += 1
        if r["id"] in CREATIVE:
            if creative_c >= 2: continue
            creative_c += 1
        result.append(r)
        if len(result) >= top_n: break
    return result


def get_strengths(scores: dict, lang: str) -> list:
    top = sorted(scores, key=scores.get, reverse=True)[:3]
    return [STRENGTH_LABELS[t][lang] for t in top if scores.get(t, 0) >= 15]


@app.get("/health")
def health():
    return {"status":"ok","service":"karta-talantov-ml","version":"4.0","careers":len(CAREER_MAP)}

@app.get("/talents")
def get_talents():
    return {"talents": TALENTS, "careers": len(CAREER_MAP)}

@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(body: AnalyzeRequest):
    lang = body.lang if body.lang in ("ru","uz","en") else "en"
    if body.scores and any(v > 0 for v in body.scores.values()):
        scores = {t: float(body.scores.get(t, 5.0)) for t in TALENTS}
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
