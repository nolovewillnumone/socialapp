import numpy as np
from dataclasses import dataclass, field
from typing import Optional


# ── Talent dimensions ─────────────────────────────────────────────────────────
TALENTS = ["logic", "creativity", "memory", "leadership", "languages", "music"]

# ── Career mapping: which talents lead to which careers ──────────────────────
CAREER_MAP = {
    "programmer": {
        "uz": "Dasturchi", "ru": "Программист", "en": "Programmer",
        "weights": {"logic": 0.45, "memory": 0.30, "creativity": 0.15, "leadership": 0.05, "languages": 0.05, "music": 0.0},
        "icon": "💻"
    },
    "designer": {
        "uz": "Dizayner", "ru": "Дизайнер", "en": "Designer",
        "weights": {"creativity": 0.50, "logic": 0.15, "memory": 0.10, "leadership": 0.10, "languages": 0.10, "music": 0.05},
        "icon": "🎨"
    },
    "scientist": {
        "uz": "Olim", "ru": "Учёный", "en": "Scientist",
        "weights": {"logic": 0.40, "memory": 0.35, "creativity": 0.15, "languages": 0.05, "leadership": 0.05, "music": 0.0},
        "icon": "🔬"
    },
    "musician": {
        "uz": "Musiqachi", "ru": "Музыкант", "en": "Musician",
        "weights": {"music": 0.55, "creativity": 0.25, "memory": 0.10, "languages": 0.05, "logic": 0.05, "leadership": 0.0},
        "icon": "🎵"
    },
    "leader": {
        "uz": "Rahbar / Menejer", "ru": "Руководитель", "en": "Manager / Leader",
        "weights": {"leadership": 0.50, "languages": 0.20, "logic": 0.15, "creativity": 0.10, "memory": 0.05, "music": 0.0},
        "icon": "🌟"
    },
    "linguist": {
        "uz": "Tilshunos / Tarjimon", "ru": "Лингвист / Переводчик", "en": "Linguist / Translator",
        "weights": {"languages": 0.50, "memory": 0.25, "creativity": 0.15, "leadership": 0.05, "logic": 0.05, "music": 0.0},
        "icon": "🗣"
    },
    "engineer": {
        "uz": "Muhandis", "ru": "Инженер", "en": "Engineer",
        "weights": {"logic": 0.40, "creativity": 0.25, "memory": 0.20, "leadership": 0.10, "languages": 0.05, "music": 0.0},
        "icon": "⚙️"
    },
    "artist": {
        "uz": "San'atkor", "ru": "Художник", "en": "Artist",
        "weights": {"creativity": 0.55, "music": 0.15, "memory": 0.10, "languages": 0.10, "logic": 0.05, "leadership": 0.05},
        "icon": "🖼"
    },
}

# ── Quiz questions with talent weights per answer ────────────────────────────
# Each question maps to a talent dimension with a weight.
# correct_talent: the talent this question primarily measures
# score_map: points awarded per answer option index (0-3)

QUESTIONS = [
    # Logic questions
    {
        "id": "q1", "talent": "logic", "weight": 1.0,
        "question": {
            "uz": "2, 4, 8, 16, __ — qaysi son davom ettiradi?",
            "ru": "2, 4, 8, 16, __ — какое число продолжает ряд?",
            "en": "2, 4, 8, 16, __ — which number continues?"
        },
        "options": {
            "uz": ["24", "32", "30", "28"],
            "ru": ["24", "32", "30", "28"],
            "en": ["24", "32", "30", "28"],
        },
        "score_map": [0.2, 1.0, 0.2, 0.2],  # index 1 (32) is correct → full score
    },
    {
        "id": "q2", "talent": "logic", "weight": 1.0,
        "question": {
            "uz": "Agar barcha mushuklar hayvon bo'lsa va ba'zi hayvonlar uchsa, u holda...",
            "ru": "Если все кошки — животные, и некоторые животные летают, то...",
            "en": "If all cats are animals and some animals can fly, then..."
        },
        "options": {
            "uz": ["Barcha mushuklar ucha oladi", "Ba'zi mushuklar ucha olishi mumkin", "Mushuklar uchmaydigan hayvonlar", "Aytib bo'lmaydi"],
            "ru": ["Все кошки летают", "Некоторые кошки могут летать", "Кошки не летают", "Нельзя сказать точно"],
            "en": ["All cats can fly", "Some cats might fly", "Cats definitely don't fly", "Cannot be determined"],
        },
        "score_map": [0.0, 0.6, 0.3, 1.0],
    },
    # Memory questions
    {
        "id": "q3", "talent": "memory", "weight": 1.0,
        "question": {
            "uz": "Bu raqamlarni eslab qoling: 7, 3, 9, 1, 5 — oxirgi raqam?",
            "ru": "Запомните числа: 7, 3, 9, 1, 5 — последнее число?",
            "en": "Remember these numbers: 7, 3, 9, 1, 5 — what was the last?"
        },
        "options": {
            "uz": ["1", "5", "9", "3"],
            "ru": ["1", "5", "9", "3"],
            "en": ["1", "5", "9", "3"],
        },
        "score_map": [0.0, 1.0, 0.0, 0.0],
    },
    {
        "id": "q4", "talent": "memory", "weight": 1.0,
        "question": {
            "uz": "Kecha nima yedingiz? Bu savol qaysi xotira turini tekshiradi?",
            "ru": "Что вы ели вчера? Какой тип памяти это проверяет?",
            "en": "What did you eat yesterday? What type of memory does this test?"
        },
        "options": {
            "uz": ["Qisqa muddatli xotira", "Uzoq muddatli xotira", "Epizodik xotira", "Protsedural xotira"],
            "ru": ["Кратковременная память", "Долговременная память", "Эпизодическая память", "Процедурная память"],
            "en": ["Short-term memory", "Long-term memory", "Episodic memory", "Procedural memory"],
        },
        "score_map": [0.2, 0.4, 1.0, 0.0],
    },
    # Creativity questions
    {
        "id": "q5", "talent": "creativity", "weight": 1.0,
        "question": {
            "uz": "Bir eski gazeta bilan nima qilish mumkin?",
            "ru": "Что можно сделать со старой газетой?",
            "en": "What can you do with an old newspaper?"
        },
        "options": {
            "uz": ["O'qish", "Axlatga tashlash", "Ko'p narsalar: qog'oz qayiq, o'yin, art", "Yoqish"],
            "ru": ["Прочитать", "Выбросить", "Много всего: кораблик, игра, арт", "Сжечь"],
            "en": ["Read it", "Throw it away", "Many things: boat, game, art", "Burn it"],
        },
        "score_map": [0.3, 0.0, 1.0, 0.1],
    },
    {
        "id": "q6", "talent": "creativity", "weight": 1.0,
        "question": {
            "uz": "Yangi ixtiro qilish uchun eng muhim narsa nima?",
            "ru": "Что самое важное для создания нового изобретения?",
            "en": "What is most important for creating a new invention?"
        },
        "options": {
            "uz": ["Pul", "Qoida va tartib", "Tasavvur va yangicha fikrlash", "Boshqalarni nusxalash"],
            "ru": ["Деньги", "Правила и порядок", "Воображение и нестандартное мышление", "Копировать других"],
            "en": ["Money", "Rules and order", "Imagination and original thinking", "Copying others"],
        },
        "score_map": [0.2, 0.1, 1.0, 0.0],
    },
    # Leadership questions
    {
        "id": "q7", "talent": "leadership", "weight": 1.0,
        "question": {
            "uz": "Guruh loyihasida siz odatda nima qilasiz?",
            "ru": "В групповом проекте вы обычно...",
            "en": "In a group project, you usually..."
        },
        "options": {
            "uz": ["Yetakchilik qilaman va vazifalarni taqsimlaman", "Buyruq kutaman", "Yolg'iz ishlashni afzal ko'raman", "Ozgina yordam beraman"],
            "ru": ["Беру инициативу и распределяю задачи", "Жду указаний", "Предпочитаю работать один", "Немного помогаю"],
            "en": ["Take initiative and assign tasks", "Wait for instructions", "Prefer working alone", "Just help a little"],
        },
        "score_map": [1.0, 0.1, 0.2, 0.3],
    },
    {
        "id": "q8", "talent": "leadership", "weight": 1.0,
        "question": {
            "uz": "Do'stingiz xafa bo'lsa, siz nima qilasiz?",
            "ru": "Если друг расстроен, вы...",
            "en": "If your friend is upset, you..."
        },
        "options": {
            "uz": ["E'tibor bermayman", "Darhol yordam beraman va tinglayman", "Boshqa birovga aytaman", "Qo'rqib ketaman"],
            "ru": ["Не обращаю внимания", "Сразу помогаю и слушаю", "Говорю кому-то другому", "Теряюсь"],
            "en": ["Ignore it", "Help immediately and listen", "Tell someone else", "Feel lost"],
        },
        "score_map": [0.0, 1.0, 0.3, 0.1],
    },
    # Languages questions
    {
        "id": "q9", "talent": "languages", "weight": 1.0,
        "question": {
            "uz": "Nechta tilda gaplasha olasiz?",
            "ru": "На скольких языках вы можете говорить?",
            "en": "How many languages can you speak?"
        },
        "options": {
            "uz": ["Faqat 1 ta", "2 ta", "3 ta", "4 va undan ko'p"],
            "ru": ["Только 1", "2 языка", "3 языка", "4 и более"],
            "en": ["Only 1", "2 languages", "3 languages", "4 or more"],
        },
        "score_map": [0.1, 0.4, 0.7, 1.0],
    },
    # Music questions
    {
        "id": "q10", "talent": "music", "weight": 1.0,
        "question": {
            "uz": "Musiqa asbobini chalasizmi yoki qo'shiq aytirishni yoqtirasizmi?",
            "ru": "Вы играете на музыкальном инструменте или любите петь?",
            "en": "Do you play an instrument or love to sing?"
        },
        "options": {
            "uz": ["Ha, professional darajada", "Ha, hobiy sifatida", "Ba'zan, lekin ko'p emas", "Yo'q, qiziqmayman"],
            "ru": ["Да, на профессиональном уровне", "Да, как хобби", "Иногда, но не часто", "Нет, не интересует"],
            "en": ["Yes, at a professional level", "Yes, as a hobby", "Sometimes, not much", "No, not interested"],
        },
        "score_map": [1.0, 0.7, 0.3, 0.0],
    },
]


# ── Core scoring logic ────────────────────────────────────────────────────────
@dataclass
class TalentScore:
    logic:      float = 0.0
    creativity: float = 0.0
    memory:     float = 0.0
    leadership: float = 0.0
    languages:  float = 0.0
    music:      float = 0.0

    def to_dict(self) -> dict:
        return {
            "logic":      round(self.logic, 1),
            "creativity": round(self.creativity, 1),
            "memory":     round(self.memory, 1),
            "leadership": round(self.leadership, 1),
            "languages":  round(self.languages, 1),
            "music":      round(self.music, 1),
        }

    def top_talents(self, n: int = 3) -> list[str]:
        """Return the top n talent names by score."""
        scores = self.to_dict()
        return sorted(scores, key=scores.get, reverse=True)[:n]


def compute_talent_scores(answers: dict[str, int]) -> TalentScore:
    """
    Compute talent scores from quiz answers.

    Args:
        answers: { question_id: selected_option_index }
                 e.g. { "q1": 1, "q2": 3, "q3": 0, ... }

    Returns:
        TalentScore with each talent as a percentage 0–100.
    """
    raw = {t: 0.0 for t in TALENTS}
    max_possible = {t: 0.0 for t in TALENTS}

    for q in QUESTIONS:
        qid    = q["id"]
        talent = q["talent"]
        weight = q["weight"]
        max_possible[talent] += weight

        if qid in answers:
            option_idx = answers[qid]
            if 0 <= option_idx < len(q["score_map"]):
                raw[talent] += q["score_map"][option_idx] * weight

    # Normalize to 0–100
    scores = TalentScore()
    for talent in TALENTS:
        if max_possible[talent] > 0:
            pct = (raw[talent] / max_possible[talent]) * 100
            # Add small random noise for realism (±3%)
            noise = np.random.uniform(-3, 3)
            setattr(scores, talent, round(min(100, max(0, pct + noise)), 1))
        else:
            setattr(scores, talent, 0.0)

    return scores


def recommend_careers(scores: TalentScore, lang: str = "en", top_n: int = 3) -> list[dict]:
    """
    Match talent scores to careers using dot-product similarity.

    Args:
        scores:  TalentScore object
        lang:    "uz" | "ru" | "en"
        top_n:   number of career recommendations to return

    Returns:
        List of career dicts with name, icon, match_percent, and tips.
    """
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
        })

    ranked.sort(key=lambda x: x["match_percent"], reverse=True)
    return ranked[:top_n]


def get_strengths(scores: TalentScore, lang: str = "en") -> list[str]:
    """Return human-readable strength descriptions for top talents."""
    STRENGTH_LABELS = {
        "uz": {
            "logic":      "Ajoyib mantiqiy fikrlash",
            "creativity": "Kuchli ijodkorlik",
            "memory":     "A'lo xotira",
            "leadership": "Tabiiy liderlik qobiliyati",
            "languages":  "Tillarni tez o'rganish",
            "music":      "Musiqiy iste'dod",
        },
        "ru": {
            "logic":      "Отличное логическое мышление",
            "creativity": "Сильное творческое начало",
            "memory":     "Превосходная память",
            "leadership": "Природный лидер",
            "languages":  "Способность к языкам",
            "music":      "Музыкальный талант",
        },
        "en": {
            "logic":      "Excellent logical thinking",
            "creativity": "Strong creative ability",
            "memory":     "Outstanding memory",
            "leadership": "Natural born leader",
            "languages":  "Fast language learner",
            "music":      "Musical talent",
        },
    }
    top = scores.top_talents(n=3)
    labels = STRENGTH_LABELS.get(lang, STRENGTH_LABELS["en"])
    return [labels[t] for t in top if getattr(scores, t) >= 40]


def full_analysis(answers: dict[str, int], lang: str = "en") -> dict:
    """
    Run the complete ML pipeline:
      1. Compute talent scores from answers
      2. Recommend careers
      3. Generate strength descriptions

    Args:
        answers: { question_id: option_index }
        lang:    "uz" | "ru" | "en"

    Returns:
        Full analysis result dict.
    """
    scores   = compute_talent_scores(answers)
    careers  = recommend_careers(scores, lang=lang)
    strengths = get_strengths(scores, lang=lang)

    return {
        "scores":    scores.to_dict(),
        "top_talents": scores.top_talents(n=3),
        "careers":   careers,
        "strengths": strengths,
        "lang":      lang,
    }


# ── CLI test ──────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    # Simulated answers: question_id → option index chosen
    test_answers = {
        "q1": 1,   # 32 ✓ logic
        "q2": 3,   # cannot be determined ✓ logic
        "q3": 1,   # 5 ✓ memory
        "q4": 2,   # episodic memory ✓
        "q5": 2,   # many things ✓ creativity
        "q6": 2,   # imagination ✓ creativity
        "q7": 0,   # take initiative ✓ leadership
        "q8": 1,   # help and listen ✓ leadership
        "q9": 2,   # 3 languages
        "q10": 1,  # hobby musician
    }

    for lang in ["uz", "ru", "en"]:
        print(f"\n{'='*50}")
        print(f"Language: {lang.upper()}")
        result = full_analysis(test_answers, lang=lang)
        print(f"Scores: {result['scores']}")
        print(f"Top talents: {result['top_talents']}")
        print(f"Careers: {[c['name'] + ' ' + str(c['match_percent'])+'%' for c in result['careers']]}")
        print(f"Strengths: {result['strengths']}")
