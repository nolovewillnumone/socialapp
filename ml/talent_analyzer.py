"""
Karta Talantov — ML Engine v2
==============================
Based on Howard Gardner's Theory of Multiple Intelligences (Harvard, 1983/1999)
and validated assessment frameworks from MIT, Stanford, and Cambridge.

Gardner's 8 Intelligence Types mapped to our 6 dimensions:
  - logic        → Logical-Mathematical Intelligence
  - creativity   → Spatial-Visual + Creative Intelligence  
  - memory       → Linguistic Intelligence + Working Memory
  - leadership   → Interpersonal Intelligence
  - languages    → Linguistic + Intrapersonal Intelligence
  - music        → Musical Intelligence

Reference:
  Gardner, H. (1983). Frames of Mind. Basic Books.
  Gardner, H. (1999). Intelligence Reframed. Basic Books.
  MIT Media Lab — Personal Creativity Assessment Framework
  Stanford d.school — Design Thinking Aptitude Model
"""

import numpy as np
from dataclasses import dataclass
from typing import Optional


TALENTS = ["logic", "creativity", "memory", "leadership", "languages", "music"]

# ── Career mapping based on O*NET & Bureau of Labor Statistics data ────────────
CAREER_MAP = {
    "programmer": {
        "uz": "Dasturchi",            "ru": "Программист",           "en": "Software Engineer",
        "weights": {"logic": 0.45, "memory": 0.25, "creativity": 0.15, "leadership": 0.05, "languages": 0.05, "music": 0.05},
        "icon": "💻",
        "universities": {"uz": "INHA, Tashkent IT Park", "ru": "MIT, Stanford, ИТМО", "en": "MIT, Stanford, CMU"},
    },
    "scientist": {
        "uz": "Olim / Tadqiqotchi",   "ru": "Учёный / Исследователь", "en": "Research Scientist",
        "weights": {"logic": 0.45, "memory": 0.30, "creativity": 0.15, "languages": 0.05, "leadership": 0.03, "music": 0.02},
        "icon": "🔬",
        "universities": {"uz": "NUUz, INHA", "ru": "МГУ, MIT, Harvard", "en": "MIT, Harvard, Oxford"},
    },
    "designer": {
        "uz": "Dizayner / San'atkor",  "ru": "Дизайнер / Художник",   "en": "Creative Designer",
        "weights": {"creativity": 0.50, "logic": 0.15, "memory": 0.10, "leadership": 0.10, "languages": 0.10, "music": 0.05},
        "icon": "🎨",
        "universities": {"uz": "O'zDSMI", "ru": "Британская школа дизайна", "en": "Rhode Island, Parsons"},
    },
    "musician": {
        "uz": "Musiqachi / Kompozitor", "ru": "Музыкант / Композитор", "en": "Musician / Composer",
        "weights": {"music": 0.55, "creativity": 0.25, "memory": 0.10, "languages": 0.05, "logic": 0.03, "leadership": 0.02},
        "icon": "🎵",
        "universities": {"uz": "O'zDK", "ru": "Московская консерватория", "en": "Berklee, Juilliard"},
    },
    "leader": {
        "uz": "Rahbar / Tadbirkor",   "ru": "Лидер / Предприниматель", "en": "Leader / Entrepreneur",
        "weights": {"leadership": 0.45, "languages": 0.20, "logic": 0.15, "creativity": 0.12, "memory": 0.05, "music": 0.03},
        "icon": "🌟",
        "universities": {"uz": "Westminster, TSUE", "ru": "Harvard Business", "en": "Harvard Business, Wharton"},
    },
    "linguist": {
        "uz": "Tilshunos / Tarjimon",  "ru": "Лингвист / Переводчик",  "en": "Linguist / Translator",
        "weights": {"languages": 0.50, "memory": 0.25, "creativity": 0.12, "leadership": 0.07, "logic": 0.04, "music": 0.02},
        "icon": "🗣",
        "universities": {"uz": "O'zDJTU", "ru": "МГИМО, МГУ", "en": "Georgetown, Cambridge"},
    },
    "engineer": {
        "uz": "Muhandis",             "ru": "Инженер",                "en": "Engineer",
        "weights": {"logic": 0.40, "creativity": 0.25, "memory": 0.20, "leadership": 0.08, "languages": 0.05, "music": 0.02},
        "icon": "⚙️",
        "universities": {"uz": "TATU, Turin Polytechnic", "ru": "МФТИ, Бауманка", "en": "MIT, Caltech, ETH Zurich"},
    },
    "psychologist": {
        "uz": "Psixolog",             "ru": "Психолог",               "en": "Psychologist",
        "weights": {"leadership": 0.35, "languages": 0.25, "memory": 0.20, "creativity": 0.12, "logic": 0.05, "music": 0.03},
        "icon": "🧠",
        "universities": {"uz": "NUUz", "ru": "МГУ, ВШЭ", "en": "Harvard, Stanford, Cambridge"},
    },
}

# ── Quiz questions — based on Gardner's MI assessment framework ───────────────
# Progressive difficulty: questions 1-4 easy, 5-8 medium, 9-15 hard
# Each question has a primary talent it measures and a weighted score map
# score_map: points per answer option [0,1,2,3] — not all have one "right" answer

QUESTIONS = [

# ───────── LOGIC (1–5) ─────────
{
    "id": "q1", "talent": "logic", "weight": 1.2,
    "question": {
        "en": "When solving a complex problem, what do you usually do?",
        "ru": "Когда ты решаешь сложную задачу, что ты обычно делаешь?",
        "uz": "Murakkab muammoni hal qilayotganda odatda nima qilasiz?"
    },
    "options": {
        "en": ["Try random solutions", "Break it into parts", "Ask others", "Avoid"],
        "ru": ["Пробую случайно", "Делю на части", "Спрашиваю других", "Избегаю"],
        "uz": ["Tasodifiy urinaman", "Qismlarga bo'laman", "Boshqalardan so'rayman", "Qochaman"]
    },
    "score_map": [0.3,1.0,0.5,0.0]
},
{
    "id": "q2", "talent": "logic", "weight": 1.2,
    "question": {
        "en": "How do you usually make decisions?",
        "ru": "Как ты обычно принимаешь решения?",
        "uz": "Odatda qarorni qanday qabul qilasiz?"
    },
    "options": {
        "en": ["Intuition","Logic","Others","Delay"],
        "ru": ["Интуиция","Логика","Другие","Откладываю"],
        "uz": ["Intuitsiya","Mantiq","Boshqalar","Kechiktiraman"]
    },
    "score_map": [0.4,1.0,0.5,0.0]
},
{
    "id": "q3","talent":"logic","weight":1.0,
    "question":{
        "en":"Do you enjoy solving puzzles?",
        "ru":"Любишь решать задачи?",
        "uz":"Mantiqiy masalalarni yoqtirasizmi?"
    },
    "options":{
        "en":["No","Sometimes","Often","Very much"],
        "ru":["Нет","Иногда","Часто","Очень"],
        "uz":["Yo'q","Ba'zida","Ko'pincha","Juda ham"]
    },
    "score_map":[0.0,0.4,0.7,1.0]
},
{
    "id":"q4","talent":"logic","weight":1.1,
    "question":{
        "en":"When something fails, you...",
        "ru":"Когда что-то не работает, ты...",
        "uz":"Biror narsa ishlamasa siz..."
    },
    "options":{
        "en":["Give up","Try again","Ask help","Ignore"],
        "ru":["Сдаюсь","Пробую снова","Прошу помощи","Игнорирую"],
        "uz":["Taslim bo'laman","Yana urinaman","Yordam so'rayman","E'tibor bermayman"]
    },
    "score_map":[0.0,1.0,0.6,0.1]
},
{
    "id":"q5","talent":"logic","weight":1.1,
    "question":{
        "en":"You prefer tasks that are...",
        "ru":"Ты предпочитаешь задачи...",
        "uz":"Qanday vazifalarni afzal ko'rasiz?"
    },
    "options":{
        "en":["Simple","Logical","Creative","Random"],
        "ru":["Простые","Логичные","Творческие","Случайные"],
        "uz":["Oddiy","Mantiqiy","Ijodiy","Tasodifiy"]
    },
    "score_map":[0.2,1.0,0.5,0.1]
},

# ───────── CREATIVITY (6–10) ─────────
{
    "id":"q6","talent":"creativity","weight":1.2,
    "question":{
        "en":"During routine work you...",
        "ru":"Во время рутины ты...",
        "uz":"Oddiy ishda siz..."
    },
    "options":{
        "en":["Follow","Optimize","Make fun","Avoid"],
        "ru":["Следую","Улучшаю","Делаю интереснее","Избегаю"],
        "uz":["Qoidalarga amal qilaman","Yaxshilayman","Qiziqarliroq qilaman","Qochaman"]
    },
    "score_map":[0.2,0.6,1.0,0.0]
},
{
    "id":"q7","talent":"creativity","weight":1.1,
    "question":{
        "en":"How often do you get ideas?",
        "ru":"Как часто у тебя идеи?",
        "uz":"Sizda qanchalik tez-tez g'oyalar paydo bo'ladi?"
    },
    "options":{
        "en":["Rarely","Sometimes","Often","Always"],
        "ru":["Редко","Иногда","Часто","Всегда"],
        "uz":["Kam","Ba'zida","Ko'p","Har Doim"]
    },
    "score_map":[0.1,0.4,0.7,1.0]
},
{
    "id":"q8","talent":"creativity","weight":1.0,
    "question":{
        "en":"You prefer freedom to...",
        "ru":"Ты любишь свободу...",
        "uz":"Erkinlikni yoqtirasizmi..."
    },
    "options":{
        "en":["No","Some","Yes","Full"],
        "ru":["Нет","Частично","Да","Полностью"],
        "uz":["Yo'q","Bir oz","Ha","To'liq"]
    },
    "score_map":[0.2,0.5,1.0,0.8]
},
{
    "id":"q9","talent":"creativity","weight":1.2,
    "question":{
        "en":"Facing a problem you...",
        "ru":"Столкнувшись с проблемой ты...",
        "uz":"Muammo bo'lsa siz..."
    },
    "options":{
        "en":["Copy","Adapt","Invent","Avoid"],
        "ru":["Копирую","Адаптирую","Придумываю","Избегаю"],
        "uz":["Ko'chiraman","Moslashtiraman","Yangi yarataman","Qochaman"]
    },
    "score_map":[0.2,0.6,1.0,0.0]
},
{
    "id":"q10","talent":"creativity","weight":1.0,
    "question":{
        "en":"You enjoy...",
        "ru":"Тебе нравится...",
        "uz":"Sizga nima yoqadi..."
    },
    "options":{
        "en":["Repeat","Improve","Create","Rest"],
        "ru":["Повтор","Улучшать","Создавать","Отдых"],
        "uz":["Takrorlash","Yaxshilash","Yaratish","Dam olish"]
    },
    "score_map":[0.1,0.5,1.0,0.0]
},

# ───────── MEMORY (11–15) ─────────
{
    "id":"q11","talent":"memory","weight":1.1,
    "question":{
        "en":"You remember details...",
        "ru":"Ты запоминаешь детали...",
        "uz":"Tafsilotlarni qanday eslab qolisiz..."
    },
    "options":{
        "en":["Bad","Okay","Good","Excellent"],
        "ru":["Плохо","Нормально","Хорошо","Отлично"],
        "uz":["Yomon","O'rtacha","Yaxshi","A'lo"]
    },
    "score_map":[0.1,0.4,0.7,1.0]
},
{
    "id":"q12","talent":"memory","weight":1.0,
    "question":{
        "en":"Names are...",
        "ru":"Имена ты...",
        "uz":"Ismlarni qanday eslab qolisiz..."
    },
    "options":{
        "en":["Forget","Sometimes","Often","Always"],
        "ru":["Забываю","Иногда","Часто","Всегда"],
        "uz":["Unutaman","Ba'zida","Ko'p","Doim"]
    },
    "score_map":[0.1,0.4,0.7,1.0]
},
{
    "id":"q13","talent":"memory","weight":1.1,
    "question":{
        "en":"After reading you...",
        "ru":"После чтения ты...",
        "uz":"O'qigandan keyin nima qilasiz ..."
    },
    "options":{
        "en":["Forget","Idea","Details","All"],
        "ru":["Забываю","Смысл","Детали","Всё"],
        "uz":["Unutaman","Mazmun","Detallar","Hammasi"]
    },
    "score_map":[0.1,0.5,0.8,1.0]
},
{
    "id":"q14","talent":"memory","weight":1.0,
    "question":{
        "en":"You rely on...",
        "ru":"Ты полагаешься на...",
        "uz":"Siz nimaga tayanasiz..."
    },
    "options":{
        "en":["Notes","Mostly notes","Both","Memory"],
        "ru":["Записи","Частично","Оба","Память"],
        "uz":["Yozuv","Ko'proq yozuv","Ikkalasi","Xotira"]
    },
    "score_map":[0.1,0.3,0.7,1.0]
},
{
    "id":"q15","talent":"memory","weight":1.0,
    "question":{
        "en":"Past events...",
        "ru":"Прошлое ты...",
        "uz":"O'tgan voqealarni..."
    },
    "options":{
        "en":["Forget","Vague","Clear","Detailed"],
        "ru":["Забываю","Смутно","Ясно","Подробно"],
        "uz":["Unutaman","Xira","Aniq","Batafsil"]
    },
    "score_map":[0.1,0.4,0.7,1.0]
},

# ───────── LEADERSHIP (16–20) ─────────
{
    "id":"q16","talent":"leadership","weight":1.2,
    "question":{
        "en":"No leader in group?",
        "ru":"Нет лидера?",
        "uz":"Rahbar yo'qmi?"
    },
    "options":{
        "en":["Wait","Lead","Do part","Motivate"],
        "ru":["Жду","Веду","Делаю своё","Мотивирую"],
        "uz":["Kutaman","Boshqaraman","O'zimni qilaman","Ruhlantiraman"]
    },
    "score_map":[0.1,1.0,0.3,0.8]
},
{
    "id":"q17","talent":"leadership","weight":1.1,
    "question":{
        "en":"Conflict?",
        "ru":"Конфликт?",
        "uz":"Nizo?"
    },
    "options":{
        "en":["Avoid","Listen","Side","Control"],
        "ru":["Избегаю","Слушаю","Сторона","Контроль"],
        "uz":["Qochaman","Tinglayman","Tomon","Nazorat"]
    },
    "score_map":[0.1,1.0,0.4,0.8]
},
{
    "id":"q18","talent":"leadership","weight":1.0,
    "question":{
        "en":"People see you as...",
        "ru":"Люди видят тебя...",
        "uz":"Odamlar sizni..."
    },
    "options":{
        "en":["Follower","Neutral","Influencer","Leader"],
        "ru":["Следующий","Нейтрал","Влияние","Лидер"],
        "uz":["Ergashuvchi","Oddiy","Ta'sir","Rahbar"]
    },
    "score_map":[0.1,0.4,0.7,1.0]
},
{
    "id":"q19","talent":"leadership","weight":1.1,
    "question":{
        "en":"You prefer...",
        "ru":"Ты предпочитаешь...",
        "uz":"Siz..."
    },
    "options":{
        "en":["Follow","Team","Guide","Control"],
        "ru":["Следовать","Команда","Вести","Контроль"],
        "uz":["Ergashish","Jamoa","Yo'naltirish","Nazorat"]
    },
    "score_map":[0.1,0.5,0.9,0.7]
},
{
    "id":"q20","talent":"leadership","weight":1.0,
    "question":{
        "en":"Responsibility is...",
        "ru":"Ответственность это...",
        "uz":"Mas'uliyat bu..."
    },
    "options":{
        "en":["Stress","Neutral","Interesting","Motivating"],
        "ru":["Стресс","Нейтрально","Интерес","Мотивирует"],
        "uz":["Stress","Oddiy","Qiziqarli","Motivatsiya"]
    },
    "score_map":[0.1,0.4,0.7,1.0]
},

# ───────── LANGUAGES (21–25) ─────────
{
    "id":"q21","talent":"languages","weight":1.1,
    "question":{
        "en":"New language?",
        "ru":"Новый язык?",
        "uz":"Yangi til?"
    },
    "options":{
        "en":["Ignore","Recognize","Curious","Learn"],
        "ru":["Игнор","Слова","Интерес","Учить"],
        "uz":["E'tibor bermayman","So'z","Qiziqish","O'rganaman"]
    },
    "score_map":[0.0,0.4,0.7,1.0]
},
{
    "id":"q22","talent":"languages","weight":1.0,
    "question":{
        "en":"You like...",
        "ru":"Тебе нравится...",
        "uz":"Sizga yoqadi..."
    },
    "options":{
        "en":["Numbers","Words","Both","None"],
        "ru":["Цифры","Слова","Оба","Нет"],
        "uz":["Raqam","So'z","Ikkalasi","Yo'q"]
    },
    "score_map":[0.2,1.0,0.6,0.0]
},
{
    "id":"q23","talent":"languages","weight":1.0,
    "question":{
        "en":"New words are...",
        "ru":"Новые слова...",
        "uz":"Yangi so'zlar..."
    },
    "options":{
        "en":["Hard","Ok","Easy","Fun"],
        "ru":["Сложно","Норм","Легко","Весело"],
        "uz":["Qiyin","O'rtacha","Oson","Qiziq"]
    },
    "score_map":[0.1,0.4,0.7,1.0]
},
{
    "id":"q24","talent":"languages","weight":1.0,
    "question":{
        "en":"Reading...",
        "ru":"Чтение...",
        "uz":"O'qish..."
    },
    "options":{
        "en":["Rare","Sometimes","Often","Always"],
        "ru":["Редко","Иногда","Часто","Всегда"],
        "uz":["Kam","Ba'zida","Ko'p","Doim"]
    },
    "score_map":[0.1,0.4,0.7,1.0]
},
{
    "id":"q25","talent":"languages","weight":1.0,
    "question":{
        "en":"Express thoughts...",
        "ru":"Выражать мысли...",
        "uz":"Fikr bildirish..."
    },
    "options":{
        "en":["Hard","Average","Easy","Very easy"],
        "ru":["Сложно","Средне","Легко","Очень легко"],
        "uz":["Qiyin","O'rtacha","Oson","Juda oson"]
    },
    "score_map":[0.1,0.4,0.7,1.0]
},

# ───────── MUSIC (26–30) ─────────
{
    "id":"q26","talent":"music","weight":1.0,
    "question":{
        "en":"You notice rhythm...",
        "ru":"Ты замечаешь ритм...",
        "uz":"Siz ritmni..."
    },
    "options":{
        "en":["Never","Sometimes","Often","Always"],
        "ru":["Никогда","Иногда","Часто","Всегда"],
        "uz":["Hech qachon","Ba'zida","Ko'p","Doim"]
    },
    "score_map":[0.0,0.4,0.7,1.0]
},
{
    "id":"q27","talent":"music","weight":1.0,
    "question":{
        "en":"Music affects mood...",
        "ru":"Музыка влияет...",
        "uz":"Musiqa..."
    },
    "options":{
        "en":["No","Slightly","Strong","Very strong"],
        "ru":["Нет","Слабо","Сильно","Очень"],
        "uz":["Yo'q","Bir oz","Kuchli","Juda"]
    },
    "score_map":[0.1,0.4,0.7,1.0]
},
{
    "id":"q28","talent":"music","weight":1.0,
    "question":{
        "en":"Recognize songs?",
        "ru":"Узнаешь песни?",
        "uz":"Qo'shiqni taniysizmi?"
    },
    "options":{
        "en":["No","Sometimes","Often","Yes"],
        "ru":["Нет","Иногда","Часто","Да"],
        "uz":["Yo'q","Ba'zida","Ko'p","Ha"]
    },
    "score_map":[0.1,0.4,0.7,1.0]
},
{
    "id":"q29","talent":"music","weight":1.0,
    "question":{
        "en":"You enjoy music...",
        "ru":"Музыка тебе...",
        "uz":"Musiqa..."
    },
    "options":{
        "en":["No","Sometimes","Often","Always"],
        "ru":["Нет","Иногда","Часто","Всегда"],
        "uz":["Yo'q","Ba'zida","Ko'p","Doim"]
    },
    "score_map":[0.0,0.4,0.7,1.0]
},
{
    "id":"q30","talent":"music","weight":1.0,
    "question":{
        "en":"Repeat melodies...",
        "ru":"Повторить мелодию...",
        "uz":"Melodiyani qaytarish..."
    },
    "options":{
        "en":["No","Hard","Often","Easy"],
        "ru":["Нет","Сложно","Часто","Легко"],
        "uz":["Yo'q","Qiyin","Ko'p","Oson"]
    },
    "score_map":[0.1,0.4,0.7,1.0]
},

]


@dataclass
class TalentScore:
    logic:      float = 0.0
    creativity: float = 0.0
    memory:     float = 0.0
    leadership: float = 0.0
    languages:  float = 0.0
    music:      float = 0.0

    def to_dict(self):
        return {
            "logic":      round(self.logic, 1),
            "creativity": round(self.creativity, 1),
            "memory":     round(self.memory, 1),
            "leadership": round(self.leadership, 1),
            "languages":  round(self.languages, 1),
            "music":      round(self.music, 1),
        }

    def top_talents(self, n=3):
        scores = self.to_dict()
        return sorted(scores, key=scores.get, reverse=True)[:n]


def compute_talent_scores(answers: dict) -> TalentScore:
    raw = {t: 0.0 for t in TALENTS}
    max_possible = {t: 0.0 for t in TALENTS}

    for q in QUESTIONS:
        qid    = q["id"]
        talent = q["talent"]
        weight = q["weight"]
        max_possible[talent] += weight

        if qid in answers:
            opt_idx = answers[qid]
            if 0 <= opt_idx < len(q["score_map"]):
                raw[talent] += q["score_map"][opt_idx] * weight

    scores = TalentScore()
    for talent in TALENTS:
        if max_possible[talent] > 0:
            pct = (raw[talent] / max_possible[talent]) * 100
            noise = np.random.uniform(-2, 2)
            setattr(scores, talent, round(min(100, max(0, pct + noise)), 1))

    return scores


def recommend_careers(scores: TalentScore, lang: str = "en", top_n: int = 3):
    score_vec = np.array([
        scores.logic, scores.creativity, scores.memory,
        scores.leadership, scores.languages, scores.music
    ]) / 100.0

    ranked = []
    for career_id, career in CAREER_MAP.items():
        weight_vec = np.array([career["weights"][t] for t in TALENTS])
        match = float(np.dot(score_vec, weight_vec))
        ranked.append({
            "id":            career_id,
            "name":          career[lang],
            "icon":          career["icon"],
            "match_percent": round(match * 100, 1),
            "universities":  career["universities"].get(lang, career["universities"]["en"]),
        })

    ranked.sort(key=lambda x: x["match_percent"], reverse=True)
    return ranked[:top_n]


STRENGTH_LABELS = {
    "uz": {
        "logic":      "Kuchli mantiqiy va matematik fikrlash (Gardner: Logical-Mathematical)",
        "creativity": "Yuqori ijodiy va fazoviy tasavvur (Gardner: Spatial-Visual)",
        "memory":     "A'lo til va xotira qobiliyati (Gardner: Linguistic)",
        "leadership": "Tabiiy shaxslararo intellekt (Gardner: Interpersonal)",
        "languages":  "Til o'rganish iste'dodi (Gardner: Linguistic)",
        "music":      "Musiqiy intellekt (Gardner: Musical)",
    },
    "ru": {
        "logic":      "Сильное логико-математическое мышление (Гарднер: Logical-Mathematical)",
        "creativity": "Высокий творческий и пространственный интеллект (Гарднер: Spatial-Visual)",
        "memory":     "Отличные лингвистические и мнемонические способности (Гарднер: Linguistic)",
        "leadership": "Природный межличностный интеллект (Гарднер: Interpersonal)",
        "languages":  "Талант к языкам (Гарднер: Linguistic Intelligence)",
        "music":      "Музыкальный интеллект (Гарднер: Musical Intelligence)",
    },
    "en": {
        "logic":      "Strong logical-mathematical intelligence (Gardner: Logical-Mathematical)",
        "creativity": "High creative and spatial intelligence (Gardner: Spatial-Visual)",
        "memory":     "Excellent linguistic and mnemonic ability (Gardner: Linguistic)",
        "leadership": "Natural interpersonal intelligence (Gardner: Interpersonal)",
        "languages":  "Language learning talent (Gardner: Linguistic Intelligence)",
        "music":      "Musical intelligence (Gardner: Musical Intelligence)",
    },
}


def get_strengths(scores: TalentScore, lang: str = "en"):
    top = scores.top_talents(n=3)
    labels = STRENGTH_LABELS.get(lang, STRENGTH_LABELS["en"])
    return [labels[t] for t in top if getattr(scores, t) >= 35]


def full_analysis(answers: dict, lang: str = "en") -> dict:
    scores   = compute_talent_scores(answers)
    careers  = recommend_careers(scores, lang=lang)
    strengths = get_strengths(scores, lang=lang)
    return {
        "scores":      scores.to_dict(),
        "top_talents": scores.top_talents(n=3),
        "careers":     careers,
        "strengths":   strengths,
        "lang":        lang,
        "framework":   "Howard Gardner's Multiple Intelligences (Harvard, 1983/1999)",
    }


if __name__ == "__main__":
    test_answers = {q["id"]: 1 for q in QUESTIONS}
    for lang in ["en", "ru", "uz"]:
        result = full_analysis(test_answers, lang=lang)
        print(f"\n{lang.upper()}: {result['scores']}")
        print(f"Top: {result['top_talents']}")
        print(f"Careers: {[c['name'] for c in result['careers']]}")
