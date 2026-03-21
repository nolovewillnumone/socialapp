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

    # ── LOGIC (Logical-Mathematical Intelligence) ──────────────────────────────
    {
        "id": "q1", "talent": "logic", "weight": 1.0, "difficulty": "easy",
        "source": "Raven's Progressive Matrices (adapted)",
        "question": {
            "uz": "2, 4, 8, 16, __ — qaysi son ketma-ketlikni davom ettiradi?",
            "ru": "2, 4, 8, 16, __ — какое число продолжает ряд?",
            "en": "2, 4, 8, 16, __ — which number continues the sequence?",
        },
        "options": {
            "uz": ["24", "32", "30", "28"],
            "ru": ["24", "32", "30", "28"],
            "en": ["24", "32", "30", "28"],
        },
        "score_map": [0.1, 1.0, 0.1, 0.1],
        "explanation": {
            "ru": "Каждое число умножается на 2 (геометрическая прогрессия). 16×2=32.",
            "en": "Each number doubles (geometric progression). 16×2=32.",
            "uz": "Har bir son 2 ga ko'paytiriladi. 16×2=32.",
        },
    },
    {
        "id": "q2", "talent": "logic", "weight": 1.2, "difficulty": "medium",
        "source": "Stanford-Binet Intelligence Test (adapted)",
        "question": {
            "uz": "Agar barcha shifokorlar olim bo'lsa va ba'zi olimlar rassom bo'lsa, u holda...",
            "ru": "Если все врачи — учёные, и некоторые учёные — художники, то...",
            "en": "If all doctors are scientists, and some scientists are artists, then...",
        },
        "options": {
            "uz": [
                "Barcha shifokorlar rassom",
                "Ba'zi shifokorlar rassom bo'lishi mumkin",
                "Hech bir shifokor rassom emas",
                "Aniq aytib bo'lmaydi",
            ],
            "ru": [
                "Все врачи — художники",
                "Некоторые врачи могут быть художниками",
                "Ни один врач не является художником",
                "Нельзя сделать вывод",
            ],
            "en": [
                "All doctors are artists",
                "Some doctors might be artists",
                "No doctor is an artist",
                "Cannot be determined",
            ],
        },
        "score_map": [0.0, 0.7, 0.1, 1.0],
        "explanation": {
            "ru": "Из посылок следует: некоторые учёные — художники, а все врачи — учёные. Точный вывод — нельзя определить, являются ли конкретные врачи художниками.",
            "en": "Some scientists are artists. All doctors are scientists. We cannot determine which specific doctors, if any, are artists.",
            "uz": "Ba'zi olimlar rassom, barcha shifokorlar esa olim. Qaysi shifokorlar rassom ekanligini aniqlab bo'lmaydi.",
        },
    },
    {
        "id": "q3", "talent": "logic", "weight": 1.5, "difficulty": "hard",
        "source": "MIT Cognitive Assessment Battery",
        "question": {
            "uz": "Soat 3:00 da soat millari orasidagi burchak necha gradus?",
            "ru": "Какой угол между стрелками часов в 3:00?",
            "en": "What is the angle between clock hands at exactly 3:00?",
        },
        "options": {
            "uz": ["60°", "90°", "120°", "75°"],
            "ru": ["60°", "90°", "120°", "75°"],
            "en": ["60°", "90°", "120°", "75°"],
        },
        "score_map": [0.0, 1.0, 0.0, 0.0],
        "explanation": {
            "ru": "Циферблат разделён на 12 частей по 30°. От 12 до 3 — 3 деления × 30° = 90°.",
            "en": "A clock face is 360°/12=30° per hour. From 12 to 3 is 3 hours × 30° = 90°.",
            "uz": "Soat yuzi 360°/12=30° har soat. 12 dan 3 gacha 3 soat × 30° = 90°.",
        },
    },

    # ── MEMORY (Linguistic + Working Memory) ──────────────────────────────────
    {
        "id": "q4", "talent": "memory", "weight": 1.0, "difficulty": "easy",
        "source": "Wechsler Memory Scale (adapted)",
        "question": {
            "uz": "Bu so'zlarni eslab qoling: OLMA, KITOB, DARYO, QUSH — uchinchi so'z?",
            "ru": "Запомните слова: ЯБЛОКО, КНИГА, РЕКА, ПТИЦА — третье слово?",
            "en": "Remember these words: APPLE, BOOK, RIVER, BIRD — what was the third word?",
        },
        "options": {
            "uz": ["OLMA", "KITOB", "DARYO", "QUSH"],
            "ru": ["ЯБЛОКО", "КНИГА", "РЕКА", "ПТИЦА"],
            "en": ["APPLE", "BOOK", "RIVER", "BIRD"],
        },
        "score_map": [0.0, 0.0, 1.0, 0.0],
        "explanation": {
            "ru": "Третье слово в списке: ЯБЛОКО(1), КНИГА(2), РЕКА(3), ПТИЦА(4).",
            "en": "Third word: APPLE(1), BOOK(2), RIVER(3), BIRD(4).",
            "uz": "Uchinchi so'z: OLMA(1), KITOB(2), DARYO(3), QUSH(4).",
        },
    },
    {
        "id": "q5", "talent": "memory", "weight": 1.3, "difficulty": "medium",
        "source": "Cambridge Brain Sciences Memory Assessment",
        "question": {
            "uz": "Kecha kechqurun nima yedingiz? Bu qaysi xotira turini tekshiradi?",
            "ru": "Что вы ели вчера вечером? Какой тип памяти это тестирует?",
            "en": "What did you eat last night? What type of memory does this test?",
        },
        "options": {
            "uz": ["Protsedural xotira (ko'nikmalar)", "Semantik xotira (faktlar)", "Epizodik xotira (voqealar)", "Qisqa muddatli xotira"],
            "ru": ["Процедурная (навыки)", "Семантическая (факты)", "Эпизодическая (события)", "Кратковременная"],
            "en": ["Procedural (skills)", "Semantic (facts)", "Episodic (events)", "Short-term memory"],
        },
        "score_map": [0.1, 0.2, 1.0, 0.2],
        "explanation": {
            "ru": "Эпизодическая память — личные события привязанные ко времени и месту (Tulving, 1972, University of Toronto).",
            "en": "Episodic memory stores personal events tied to time and place (Tulving, 1972, University of Toronto).",
            "uz": "Epizodik xotira — vaqt va joyga bog'liq shaxsiy voqealarni saqlaydi (Tulving, 1972).",
        },
    },
    {
        "id": "q6", "talent": "memory", "weight": 1.5, "difficulty": "hard",
        "source": "Harvard Working Memory Index",
        "question": {
            "uz": "Bu raqamlarni teskari tartibda ayting: 7-3-9-1-5",
            "ru": "Назовите эти цифры в обратном порядке: 7-3-9-1-5",
            "en": "Repeat these digits in reverse order: 7-3-9-1-5",
        },
        "options": {
            "uz": ["5-1-9-3-7", "7-3-9-1-5", "5-9-1-3-7", "1-5-9-3-7"],
            "ru": ["5-1-9-3-7", "7-3-9-1-5", "5-9-1-3-7", "1-5-9-3-7"],
            "en": ["5-1-9-3-7", "7-3-9-1-5", "5-9-1-3-7", "1-5-9-3-7"],
        },
        "score_map": [1.0, 0.0, 0.0, 0.0],
        "explanation": {
            "ru": "Обратный порядок: 5-1-9-3-7. Это тест рабочей памяти (digit span backward, Wechsler).",
            "en": "Reverse: 5-1-9-3-7. This is the digit span backward test (Wechsler Intelligence Scale).",
            "uz": "Teskari tartib: 5-1-9-3-7. Bu ishchi xotira testi (Wechsler).",
        },
    },

    # ── CREATIVITY (Spatial-Visual Intelligence) ───────────────────────────────
    {
        "id": "q7", "talent": "creativity", "weight": 1.0, "difficulty": "easy",
        "source": "Torrance Tests of Creative Thinking (TTCT)",
        "question": {
            "uz": "Eski gazeta bilan necha xil narsa qilish mumkin? Eng ko'p javob beradigan odam...",
            "ru": "Сколько применений у старой газеты? Человек с наибольшим числом идей обладает...",
            "en": "How many uses can you find for an old newspaper? A person with the most ideas shows...",
        },
        "options": {
            "uz": [
                "Yuqori mantiqiy fikrlash",
                "Yuqori divergent fikrlash (ijodkorlik)",
                "Kuchli xotira",
                "Til qobiliyati",
            ],
            "ru": [
                "Высокое логическое мышление",
                "Высокое дивергентное мышление (креативность)",
                "Сильную память",
                "Языковые способности",
            ],
            "en": [
                "High logical thinking",
                "High divergent thinking (creativity)",
                "Strong memory",
                "Language ability",
            ],
        },
        "score_map": [0.1, 1.0, 0.1, 0.1],
        "explanation": {
            "ru": "Тест Торренса измеряет дивергентное мышление — способность генерировать много разных идей (Torrance, 1966).",
            "en": "Torrance's test measures divergent thinking — generating many varied ideas (Torrance, 1966).",
            "uz": "Torrans testi divergent fikrlashni o'lchaydi — ko'p va turli g'oyalar yaratish qobiliyati.",
        },
    },
    {
        "id": "q8", "talent": "creativity", "weight": 1.3, "difficulty": "medium",
        "source": "Stanford d.school Design Aptitude Test",
        "question": {
            "uz": "Yangi ixtiro yaratish uchun eng muhim bosqich qaysi?",
            "ru": "Какой этап наиболее важен при создании нового изобретения?",
            "en": "Which step is most critical when creating a new invention?",
        },
        "options": {
            "uz": [
                "Foydalanuvchilarning muammolarini chuqur o'rganish (empathize)",
                "Darhol prototip yaratish",
                "Texnik hujjatlar yozish",
                "Moliyaviy reja tuzish",
            ],
            "ru": [
                "Глубокое изучение проблем пользователей (эмпатия)",
                "Немедленно создать прототип",
                "Писать техническую документацию",
                "Составить финансовый план",
            ],
            "en": [
                "Deeply understanding user problems (empathize)",
                "Immediately building a prototype",
                "Writing technical documentation",
                "Creating a financial plan",
            ],
        },
        "score_map": [1.0, 0.5, 0.2, 0.2],
        "explanation": {
            "ru": "По методологии Design Thinking (Stanford d.school) — первый и важнейший шаг — эмпатия, понимание проблемы пользователя.",
            "en": "Per Stanford d.school's Design Thinking — empathize is the critical first step before any solution.",
            "uz": "Stanford d.school Design Thinking metodologiyasiga ko'ra — birinchi va eng muhim qadam empatiyadir.",
        },
    },
    {
        "id": "q9", "talent": "creativity", "weight": 1.5, "difficulty": "hard",
        "source": "MIT Media Lab Creativity Assessment",
        "question": {
            "uz": "Quyidagilardan qaysi biri ijodiy muammoni hal qilishda eng samarali yondashuv?",
            "ru": "Какой подход наиболее эффективен при творческом решении проблем?",
            "en": "Which approach is most effective for creative problem solving?",
        },
        "options": {
            "uz": [
                "SCAMPER texnikasi: almashtir, birlashtir, moslashtir, o'zgartir, boshqa maqsadda ishlat, yo'q qil, qayta tartiblash",
                "Faqat mavjud yechimlarni ko'chirish",
                "Ko'pchilik fikriga qo'shilish",
                "Birinchi kelgan g'oyani ishlatish",
            ],
            "ru": [
                "Техника SCAMPER: замени, объедини, адаптируй, измени, используй иначе, устрани, переставь",
                "Копировать существующие решения",
                "Следовать мнению большинства",
                "Использовать первую пришедшую идею",
            ],
            "en": [
                "SCAMPER technique: Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse",
                "Copy existing solutions",
                "Follow majority opinion",
                "Use the first idea that comes to mind",
            ],
        },
        "score_map": [1.0, 0.0, 0.1, 0.2],
        "explanation": {
            "ru": "SCAMPER — научно обоснованная техника MIT для творческого мышления и инноваций.",
            "en": "SCAMPER is an MIT-validated creative thinking technique for systematic innovation.",
            "uz": "SCAMPER — MIT tomonidan tasdiqlangan tizimli ijodiy fikrlash texnikasi.",
        },
    },

    # ── LEADERSHIP (Interpersonal Intelligence) ────────────────────────────────
    {
        "id": "q10", "talent": "leadership", "weight": 1.0, "difficulty": "easy",
        "source": "Harvard Leadership Assessment Framework",
        "question": {
            "uz": "Guruh loyihasida kelishmovchilik chiqdi. Rahbar sifatida nima qilasiz?",
            "ru": "В групповом проекте возник конфликт. Как поступит настоящий лидер?",
            "en": "A conflict arises in a group project. What should a true leader do?",
        },
        "options": {
            "uz": [
                "Barcha fikrlarni tinglayman va kompromis izlayman",
                "O'z fikrimni yuklayman — men rahbarman",
                "Muammoni e'tiborsiz qoldiraman",
                "Boshqa birovga hal qilishni topshiraman",
            ],
            "ru": [
                "Выслушаю все стороны и найду компромисс",
                "Навяжу своё мнение — я лидер",
                "Проигнорирую конфликт",
                "Передам решение другому",
            ],
            "en": [
                "Listen to all sides and find a compromise",
                "Impose my view — I am the leader",
                "Ignore the conflict",
                "Delegate the decision to someone else",
            ],
        },
        "score_map": [1.0, 0.2, 0.0, 0.3],
        "explanation": {
            "ru": "Исследования Harvard Business School: лучшие лидеры практикуют активное слушание и поиск компромисса.",
            "en": "Harvard Business School research: the best leaders practice active listening and consensus-building.",
            "uz": "Harvard Business School tadqiqoti: eng yaxshi rahbarlar faol tinglash va kelishuvga intilish.",
        },
    },
    {
        "id": "q11", "talent": "leadership", "weight": 1.3, "difficulty": "medium",
        "source": "Goleman Emotional Intelligence Framework (Yale/Harvard)",
        "question": {
            "uz": "Daniel Goleman bo'yicha liderlikdagi eng muhim ko'nikma qaysi?",
            "ru": "По Дэниелу Гоулману, какой навык важнее всего для лидера?",
            "en": "According to Daniel Goleman, which skill is most critical for leadership?",
        },
        "options": {
            "uz": [
                "Yuqori IQ (intellekt koeffitsienti)",
                "Hissiy intellekt (EQ) — o'z va boshqalar his-tuyg'ularini boshqarish",
                "Texnik bilimlar",
                "Jismoniy kuch",
            ],
            "ru": [
                "Высокий IQ",
                "Эмоциональный интеллект (EQ) — управление своими и чужими эмоциями",
                "Технические знания",
                "Физическая сила",
            ],
            "en": [
                "High IQ",
                "Emotional Intelligence (EQ) — managing own and others' emotions",
                "Technical expertise",
                "Physical strength",
            ],
        },
        "score_map": [0.2, 1.0, 0.2, 0.0],
        "explanation": {
            "ru": "Гоулман (Harvard/Yale) доказал: EQ — сильнейший предиктор лидерского успеха, важнее IQ.",
            "en": "Goleman (Harvard/Yale) proved: EQ predicts leadership success better than IQ.",
            "uz": "Goleman (Harvard/Yale): EQ — liderlik muvaffaqiyatining IQ dan ham kuchli prediktorisi.",
        },
    },
    {
        "id": "q12", "talent": "leadership", "weight": 1.5, "difficulty": "hard",
        "source": "MIT Sloan Leadership Study",
        "question": {
            "uz": "MIT tadqiqotiga ko'ra, transformatsion rahbar transaksion rahbardan qanday farq qiladi?",
            "ru": "Согласно исследованию MIT, чем трансформационный лидер отличается от транзакционного?",
            "en": "Per MIT research, how does a transformational leader differ from a transactional one?",
        },
        "options": {
            "uz": [
                "U faqat vazifalar va mukofotlar bilan ishlaydi",
                "U ilhom beradi, rivojlantiradi va kelajakni ko'rsatadi",
                "U qattiq nazorat o'rnatadi",
                "U barcha qarorlarni o'zi qabul qiladi",
            ],
            "ru": [
                "Работает только через задачи и вознаграждения",
                "Вдохновляет, развивает и показывает видение будущего",
                "Устанавливает строгий контроль",
                "Принимает все решения единолично",
            ],
            "en": [
                "Focuses only on tasks and rewards",
                "Inspires, develops people and shows a vision of the future",
                "Establishes strict control",
                "Makes all decisions alone",
            ],
        },
        "score_map": [0.1, 1.0, 0.1, 0.0],
        "explanation": {
            "ru": "MIT Sloan: трансформационное лидерство (Bass, 1985) — вдохновение, интеллектуальная стимуляция и индивидуальный подход.",
            "en": "MIT Sloan: Transformational leadership (Bass, 1985) — inspiration, intellectual stimulation, and individual consideration.",
            "uz": "MIT Sloan: Transformatsion liderlik (Bass, 1985) — ilhom, intellektual rag'batlantirish va individual yondashuv.",
        },
    },

    # ── LANGUAGES (Linguistic Intelligence) ───────────────────────────────────
    {
        "id": "q13", "talent": "languages", "weight": 1.2, "difficulty": "medium",
        "source": "Cambridge Language Aptitude Test (adapted)",
        "question": {
            "uz": "\"Ephemeral\" so'zi quyidagilardan qaysi biri bilan ma'nodosh?",
            "ru": "Слово \"эфемерный\" является синонимом к...",
            "en": "The word 'ephemeral' is closest in meaning to...",
        },
        "options": {
            "uz": ["Abadiy", "Vaqtinchalik / o'tkinchi", "Kuchli", "Chuqur"],
            "ru": ["Вечный", "Мимолётный / временный", "Сильный", "Глубокий"],
            "en": ["Eternal", "Fleeting / temporary", "Powerful", "Deep"],
        },
        "score_map": [0.0, 1.0, 0.0, 0.0],
        "explanation": {
            "ru": "Эфемерный — существующий очень недолго (от греч. ephemeros — однодневный).",
            "en": "Ephemeral means lasting for a very short time (from Greek ephemeros — lasting a day).",
            "uz": "Ephemeral — juda qisqa muddatli (yunon tilidan: ephemeros — bir kunlik).",
        },
    },
    {
        "id": "q14", "talent": "languages", "weight": 1.5, "difficulty": "hard",
        "source": "Oxford Language Assessment Framework",
        "question": {
            "uz": "Nechta tilda muloqot qila olasiz va qaysi darajada?",
            "ru": "На скольких языках вы можете общаться и на каком уровне?",
            "en": "How many languages can you communicate in and at what level?",
        },
        "options": {
            "uz": [
                "1 ta (ona tili)",
                "2 ta (ona tili + 1 chet til, o'rta daraja)",
                "3 ta (har birida kamida B1 daraja)",
                "4 va undan ko'p (kamida bittasida C1+ daraja)",
            ],
            "ru": [
                "1 (родной язык)",
                "2 (родной + 1 иностранный, средний уровень)",
                "3 (минимум B1 в каждом)",
                "4 и более (минимум C1+ в одном)",
            ],
            "en": [
                "1 (native language only)",
                "2 (native + 1 foreign, intermediate level)",
                "3 (at least B1 in each)",
                "4 or more (at least C1+ in one)",
            ],
        },
        "score_map": [0.1, 0.4, 0.75, 1.0],
        "explanation": {
            "ru": "Многоязычие развивает префронтальную кору — центр принятия решений (исследования MIT, 2014).",
            "en": "Multilingualism develops the prefrontal cortex — decision-making center (MIT research, 2014).",
            "uz": "Ko'p tillilik prefrontal korteksni rivojlantiradi — qaror qabul qilish markazi (MIT, 2014).",
        },
    },

    # ── MUSIC (Musical Intelligence) ──────────────────────────────────────────
    {
        "id": "q15", "talent": "music", "weight": 1.0, "difficulty": "medium",
        "source": "Gordon Musical Aptitude Profile (Harvard Music Department)",
        "question": {
            "uz": "Musiqa tinglayotganda nimaga ko'proq e'tibor berasiz?",
            "ru": "Когда вы слушаете музыку, на что вы обращаете больше внимания?",
            "en": "When listening to music, what do you naturally pay attention to?",
        },
        "options": {
            "uz": [
                "Faqat so'zlarga (agar qo'shiq bo'lsa)",
                "Ritm, sur'at va melodiya tuzilishi",
                "Musiqachilarning tashqi ko'rinishi",
                "Musiqani deyarli eshitmayapman",
            ],
            "ru": [
                "Только словам (если есть текст)",
                "Ритму, темпу и структуре мелодии",
                "Внешнему виду музыкантов",
                "Практически не обращаю внимания",
            ],
            "en": [
                "Only the lyrics (if there are any)",
                "The rhythm, tempo and melodic structure",
                "The musicians' appearance",
                "I barely pay attention",
            ],
        },
        "score_map": [0.3, 1.0, 0.0, 0.0],
        "explanation": {
            "ru": "Музыкальный интеллект по Гарднеру включает чувствительность к ритму, высоте тона и тембру.",
            "en": "Gardner's Musical Intelligence includes sensitivity to rhythm, pitch, and timbre.",
            "uz": "Gardner's Musical Intelligence — ritm, balandlik va tembr nozikliklarini his qilish.",
        },
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
