import { useState, useEffect } from "react";
import Nav from "../components/Nav";
import Loader from "../components/Loader";
import { quizAPI } from "../api/client";
import { t } from "../i18n";

// ── Per-talent development tips ───────────────────────────────────────────────
const TALENT_TIPS = {
  logic: {
    icon: "🧠",
    color: "#1565C0",
    tips: {
      ru: ["Решай олимпиадные задачи по математике", "Изучи программирование (Python, Scratch)", "Играй в шахматы каждый день", "Попробуй робототехнику и Arduino"],
      uz: ["Matematika olimpiadasi masalalarini yech", "Dasturlashni o'rgan (Python, Scratch)", "Har kuni shaxmat o'yna", "Robototexnika va Arduino sinab ko'r"],
      en: ["Solve math olympiad problems", "Learn programming (Python, Scratch)", "Play chess daily", "Try robotics and Arduino"],
    },
    courses: {
      ru: ["Khan Academy — Математика", "Codecademy — Python", "Coursera — Алгоритмы (Stanford)", "edX — Введение в CS (MIT)"],
      uz: ["Khan Academy — Matematika", "Codecademy — Python", "Coursera — Algoritmlar (Stanford)", "edX — CS ga kirish (MIT)"],
      en: ["Khan Academy — Math", "Codecademy — Python", "Coursera — Algorithms (Stanford)", "edX — Intro to CS (MIT)"],
    },
    universities: {
      ru: ["🇺🇸 MIT — Информатика", "🇺🇸 Stanford — Computer Science", "🇬🇧 Oxford — Математика", "🇷🇺 МФТИ — Прикладная математика", "🇺🇿 INHA University Tashkent"],
      uz: ["🇺🇸 MIT — Informatika", "🇺🇸 Stanford — Computer Science", "🇬🇧 Oxford — Matematika", "🇷🇺 MFTI — Amaliy matematika", "🇺🇿 INHA University Toshkent"],
      en: ["🇺🇸 MIT — Computer Science", "🇺🇸 Stanford — Computer Science", "🇬🇧 Oxford — Mathematics", "🇷🇺 MIPT — Applied Math", "🇺🇿 INHA University Tashkent"],
    },
  },
  creativity: {
    icon: "🎨",
    color: "#FF7043",
    tips: {
      ru: ["Рисуй каждый день — даже 10 минут", "Попробуй 3D-моделирование (Blender)", "Создай свой комикс или анимацию", "Участвуй в хакатонах и дизайн-конкурсах"],
      uz: ["Har kuni chiz — hatto 10 daqiqa", "3D-modellashtirish sinab ko'r (Blender)", "O'z komiksing yoki animatsiyangni yarat", "Xakatonlar va dizayn musobaqalarida qatnash"],
      en: ["Draw every day — even 10 minutes", "Try 3D modeling (Blender)", "Create your own comic or animation", "Join hackathons and design competitions"],
    },
    courses: {
      ru: ["Skillshare — Иллюстрация", "Adobe Creative Cloud — Учебники", "Coursera — Дизайн-мышление (IDEO)", "YouTube — Blender для начинающих"],
      uz: ["Skillshare — Illyustratsiya", "Adobe Creative Cloud — Darsliklar", "Coursera — Dizayn-fikrlash (IDEO)", "YouTube — Blender boshlang'ichlar uchun"],
      en: ["Skillshare — Illustration", "Adobe Creative Cloud — Tutorials", "Coursera — Design Thinking (IDEO)", "YouTube — Blender for Beginners"],
    },
    universities: {
      ru: ["🇺🇸 Rhode Island School of Design", "🇺🇸 Parsons — Дизайн", "🇬🇧 Royal College of Art", "🇷🇺 Британская школа дизайна (Москва)", "🇺🇿 O'zDSMI Tashkent"],
      uz: ["🇺🇸 Rhode Island School of Design", "🇺🇸 Parsons — Dizayn", "🇬🇧 Royal College of Art", "🇷🇺 Britaniya Dizayn Maktabi (Moskva)", "🇺🇿 O'zDSMI Toshkent"],
      en: ["🇺🇸 Rhode Island School of Design", "🇺🇸 Parsons School of Design", "🇬🇧 Royal College of Art", "🇩🇰 Royal Danish Academy", "🇺🇿 O'zDSMI Tashkent"],
    },
  },
  memory: {
    icon: "📚",
    color: "#7E57C2",
    tips: {
      ru: ["Изучи технику Дворца памяти (Метод локусов)", "Читай книги разных жанров", "Учи стихи наизусть", "Пробуй технику интервальных повторений (Anki)"],
      uz: ["Xotira saroyi texnikasini o'rgan (Lokus usuli)", "Turli janrdagi kitoblar o'qi", "She'rlarni yod ol", "Intervalli takrorlash texnikasini sinab ko'r (Anki)"],
      en: ["Learn the Memory Palace technique (Method of Loci)", "Read books of different genres", "Memorize poetry", "Try spaced repetition (Anki)"],
    },
    courses: {
      ru: ["Anki — Интервальные повторения", "Coursera — Учись учиться (UC San Diego)", "Khan Academy — Чтение и понимание", "Udemy — Скорочтение"],
      uz: ["Anki — Intervalli takrorlash", "Coursera — O'rganishni o'rgan (UC San Diego)", "Khan Academy — O'qish va tushunish", "Udemy — Tez o'qish"],
      en: ["Anki — Spaced Repetition", "Coursera — Learning How to Learn (UC San Diego)", "Khan Academy — Reading Comprehension", "Udemy — Speed Reading"],
    },
    universities: {
      ru: ["🇺🇸 Harvard — Когнитивные науки", "🇬🇧 Cambridge — Психология", "🇺🇸 Stanford — Нейронаука", "🇷🇺 МГУ — Психология", "🇺🇿 NUUz — Психология"],
      uz: ["🇺🇸 Harvard — Kognitiv fanlar", "🇬🇧 Cambridge — Psixologiya", "🇺🇸 Stanford — Neyrologiya", "🇷🇺 MGU — Psixologiya", "🇺🇿 NUUz — Psixologiya"],
      en: ["🇺🇸 Harvard — Cognitive Science", "🇬🇧 Cambridge — Psychology", "🇺🇸 Stanford — Neuroscience", "🇷🇺 MSU — Psychology", "🇺🇿 NUUz — Psychology"],
    },
  },
  leadership: {
    icon: "👑",
    color: "#FFB300",
    tips: {
      ru: ["Организуй школьное мероприятие или клуб", "Читай биографии великих лидеров", "Практикуй публичные выступления", "Вступи в дебатный клуб или студенческий совет"],
      uz: ["Maktab tadbirini yoki klubini tashkil qil", "Buyuk rahbarlar tarjimai holini o'qi", "Ommaviy nutq amaliyotini qil", "Debat klubi yoki talabalar kengashiga qo'shil"],
      en: ["Organize a school event or club", "Read biographies of great leaders", "Practice public speaking", "Join debate club or student council"],
    },
    courses: {
      ru: ["Coursera — Лидерство (Yale)", "Harvard Online — Управление и лидерство", "TED Talks — Навыки презентации", "Toastmasters — Публичные выступления"],
      uz: ["Coursera — Liderlik (Yale)", "Harvard Online — Boshqaruv va liderlik", "TED Talks — Taqdimot ko'nikmalari", "Toastmasters — Ommaviy nutq"],
      en: ["Coursera — Leadership (Yale)", "Harvard Online — Management & Leadership", "TED Talks — Presentation Skills", "Toastmasters — Public Speaking"],
    },
    universities: {
      ru: ["🇺🇸 Harvard Business School", "🇺🇸 Wharton School (UPenn)", "🇬🇧 London Business School", "🇷🇺 Сколково", "🇺🇿 Westminster Tashkent"],
      uz: ["🇺🇸 Harvard Business School", "🇺🇸 Wharton School (UPenn)", "🇬🇧 London Business School", "🇷🇺 Skolkovo", "🇺🇿 Westminster Toshkent"],
      en: ["🇺🇸 Harvard Business School", "🇺🇸 Wharton School (UPenn)", "🇬🇧 London Business School", "🇨🇭 IMD Lausanne", "🇺🇿 Westminster Tashkent"],
    },
  },
  languages: {
    icon: "🌍",
    color: "#26C6DA",
    tips: {
      ru: ["Смотри фильмы на иностранном языке без субтитров", "Говори с носителями языка (italki, Tandem)", "Читай книги в оригинале", "Учи по 10 новых слов каждый день"],
      uz: ["Xorijiy tillarda filmlarni subtitrlar siz ko'r", "Ona tili so'zlovchilari bilan gaplash (italki, Tandem)", "Kitoblarni asliyatida o'qi", "Har kuni 10 ta yangi so'z o'rgan"],
      en: ["Watch films in foreign languages without subtitles", "Speak with native speakers (italki, Tandem)", "Read books in the original language", "Learn 10 new words every day"],
    },
    courses: {
      ru: ["Duolingo — Ежедневная практика", "italki — Разговор с носителями", "Coursera — Лингвистика (MIT)", "BBC Languages — Бесплатные уроки"],
      uz: ["Duolingo — Kundalik amaliyot", "italki — Ona tili so'zlovchilari bilan suhbat", "Coursera — Lingvistika (MIT)", "BBC Languages — Bepul darslar"],
      en: ["Duolingo — Daily Practice", "italki — Native Speaker Conversations", "Coursera — Linguistics (MIT)", "BBC Languages — Free Lessons"],
    },
    universities: {
      ru: ["🇺🇸 Georgetown — Лингвистика", "🇬🇧 Cambridge — Современные языки", "🇫🇷 Сорбонна — Французский", "🇷🇺 МГИМО — Международные отношения", "🇺🇿 O'zDJTU Tashkent"],
      uz: ["🇺🇸 Georgetown — Lingvistika", "🇬🇧 Cambridge — Zamonaviy tillar", "🇫🇷 Sorbonna — Fransuz tili", "🇷🇺 MGIMO — Xalqaro munosabatlar", "🇺🇿 O'zDJTU Toshkent"],
      en: ["🇺🇸 Georgetown — Linguistics", "🇬🇧 Cambridge — Modern Languages", "🇫🇷 Sorbonne — French", "🇷🇺 MGIMO — International Relations", "🇺🇿 O'zDJTU Tashkent"],
    },
  },
  music: {
    icon: "🎵",
    color: "#66BB6A",
    tips: {
      ru: ["Занимайся на инструменте минимум 30 минут в день", "Учись читать ноты", "Запиши свою первую мелодию (GarageBand, FL Studio)", "Слушай музыку разных эпох и стилей"],
      uz: ["Har kuni kamida 30 daqiqa asbobda mashq qil", "Notalarni o'qishni o'rgan", "Birinchi melodiyangni yozib ol (GarageBand, FL Studio)", "Turli davrlar va uslubdagi musiqalarni eshit"],
      en: ["Practice your instrument at least 30 minutes daily", "Learn to read music notation", "Record your first melody (GarageBand, FL Studio)", "Listen to music from different eras and styles"],
    },
    courses: {
      ru: ["Simply Piano — Фортепиано", "Yousician — Гитара/Фортепиано", "Coursera — Введение в музыку (Berklee)", "YouTube — Теория музыки бесплатно"],
      uz: ["Simply Piano — Fortepiano", "Yousician — Gitara/Fortepiano", "Coursera — Musiqaga kirish (Berklee)", "YouTube — Musiqa nazariyasi bepul"],
      en: ["Simply Piano — Piano", "Yousician — Guitar/Piano", "Coursera — Introduction to Music (Berklee)", "YouTube — Music Theory Free"],
    },
    universities: {
      ru: ["🇺🇸 Berklee College of Music", "🇺🇸 Juilliard School (New York)", "🇬🇧 Royal Academy of Music", "🇷🇺 Московская консерватория", "🇺🇿 O'zbekiston Davlat Konservatoriyasi"],
      uz: ["🇺🇸 Berklee College of Music", "🇺🇸 Juilliard School (Nyu-York)", "🇬🇧 Royal Academy of Music", "🇷🇺 Moskva Konservatoriyasi", "🇺🇿 O'zbekiston Davlat Konservatoriyasi"],
      en: ["🇺🇸 Berklee College of Music", "🇺🇸 Juilliard School (New York)", "🇬🇧 Royal Academy of Music", "🇩🇰 Royal Danish Academy of Music", "🇺🇿 State Conservatory of Uzbekistan"],
    },
  },
};

const TALENT_NAMES = {
  logic:      { ru:"Логика",      uz:"Mantiq",      en:"Logic"       },
  creativity: { ru:"Творчество",  uz:"Ijodkorlik",  en:"Creativity"  },
  memory:     { ru:"Память",      uz:"Xotira",       en:"Memory"      },
  leadership: { ru:"Лидерство",   uz:"Liderlik",     en:"Leadership"  },
  languages:  { ru:"Языки",       uz:"Tillar",       en:"Languages"   },
  music:      { ru:"Музыка",      uz:"Musiqa",       en:"Music"       },
};

export default function DevelopPage({ setPage, results, lang, dark }) {
  const [loading, setLoading]   = useState(false);
  const [data, setData]         = useState(null);
  const [activeTab, setActiveTab] = useState(0); // which top talent is shown

  // Load latest results if not passed from quiz
  useEffect(() => {
    if (results?.scores) {
      setData(results);
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) return;
    setLoading(true);
    quizAPI.latestResult()
      .then((res) => {
        const d = res.data;
        setData({
          scores: {
            logic:      d.score_logic,
            creativity: d.score_creativity,
            memory:     d.score_memory,
            leadership: d.score_leadership,
            languages:  d.score_languages,
            music:      d.score_music,
          },
          careers:   [{ name: d.top_career, icon: "⭐", match_percent: null }],
          strengths: [],
          top_talents: [d.top_talent],
        });
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [results]);

  if (loading) return (
    <div className="page-wrap">
      <Nav page="develop" setPage={setPage} lang={lang} dark={dark} />
      <Loader message={lang==="ru"?"Загружаем рекомендации...":lang==="uz"?"Tavsiyalar yuklanmoqda...":"Loading recommendations..."} />
    </div>
  );

  // Get top 3 talents sorted by score
  const topTalents = data?.scores
    ? Object.entries(data.scores)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([key]) => key)
    : null;

  const activeTalent = topTalents?.[activeTab];
  const talentData   = activeTalent ? TALENT_TIPS[activeTalent] : null;
  const careers      = data?.careers || [];

  const L = {
    ru: {
      banner:      "Развивай свои таланты!",
      personal:    "⭐ Персональные рекомендации",
      noResults:   "Пройди тест сначала, чтобы получить персональные рекомендации!",
      startQuiz:   "Пройти тест →",
      topTalents:  "Твои топ таланты:",
      tips:        "Как развивать:",
      courses:     "Рекомендуемые курсы:",
      universities:"🎓 Университеты для тебя:",
      careers:     "Карьеры для тебя:",
      match:       "совпадение",
      toHome:      "← На главную",
      toTasks:     "Пройти игры 🎮",
      framework:   "На основе исследований Gardner (Harvard) · MIT · Stanford · Oxford",
    },
    uz: {
      banner:      "Iste'dodingni rivojlantir!",
      personal:    "⭐ Shaxsiy tavsiyalar",
      noResults:   "Shaxsiy tavsiyalar olish uchun avval testni o'ting!",
      startQuiz:   "Testni boshlash →",
      topTalents:  "Eng yuqori iste'dodlaring:",
      tips:        "Qanday rivojlantirish:",
      courses:     "Tavsiya etilgan kurslar:",
      universities:"🎓 Sening universitetlaring:",
      careers:     "Sening kasblar:",
      match:       "mos",
      toHome:      "← Bosh sahifa",
      toTasks:     "O'yinlarni o'yna 🎮",
      framework:   "Gardner (Harvard) · MIT · Stanford · Oxford tadqiqotlari asosida",
    },
    en: {
      banner:      "Develop your talents!",
      personal:    "⭐ Personal recommendations",
      noResults:   "Take the quiz first to get your personal recommendations!",
      startQuiz:   "Take the quiz →",
      topTalents:  "Your top talents:",
      tips:        "How to develop:",
      courses:     "Recommended courses:",
      universities:"🎓 Universities for you:",
      careers:     "Careers for you:",
      match:       "match",
      toHome:      "← Home",
      toTasks:     "Play games 🎮",
      framework:   "Based on Gardner (Harvard) · MIT · Stanford · Oxford research",
    },
  }[lang] || {};

  return (
    <div className="page-wrap">
      <Nav page="develop" setPage={setPage} lang={lang} dark={dark} />

      <div className="develop-section">
        {/* Banner */}
        <div className="develop-banner">
          <div className="develop-banner-title">{L.banner}</div>
          <span style={{ color:"#fff", fontSize:"0.9rem", fontWeight:700 }}>{L.personal}</span>
        </div>

        {/* No results state */}
        {!data && (
          <div style={{ textAlign:"center", padding:"48px 24px" }}>
            <div style={{ fontSize:"3rem", marginBottom:16 }}>📊</div>
            <p style={{ fontWeight:700, color:"#546E7A", marginBottom:24, fontSize:"1rem" }}>{L.noResults}</p>
            <button className="hero-cta" onClick={() => setPage("quiz")}>{L.startQuiz}</button>
          </div>
        )}

        {/* Results available */}
        {data && topTalents && (
          <>
            {/* ── Top talent tabs ── */}
            <div style={{ marginBottom:20 }}>
              <p style={{ fontSize:"0.8rem", fontWeight:800, color:"#90A4AE", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>
                {L.topTalents}
              </p>
              <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
                {topTalents.map((talent, i) => {
                  const td = TALENT_TIPS[talent];
                  const score = Math.round(data.scores[talent]);
                  const isActive = i === activeTab;
                  return (
                    <button key={talent} onClick={() => setActiveTab(i)}
                      style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 18px", borderRadius:50, border:`2px solid ${isActive ? td.color : "#E3F2FD"}`, background: isActive ? td.color : (dark?"#1A2A3A":"#fff"), color: isActive ? "#fff" : (dark?"#E3F2FD":"#1A237E"), fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.9rem", cursor:"pointer", transition:"all 0.2s", boxShadow: isActive ? `0 4px 16px ${td.color}44` : "none" }}>
                      <span>{td.icon}</span>
                      {TALENT_NAMES[talent]?.[lang]}
                      <span style={{ background: isActive?"rgba(255,255,255,0.25)":"#E3F2FD", color: isActive?"#fff":td.color, borderRadius:99, padding:"2px 8px", fontSize:"0.78rem", fontWeight:900 }}>
                        {score}%
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ── Active talent detail ── */}
            {talentData && (
              <div style={{ display:"flex", gap:20, flexWrap:"wrap", marginBottom:24 }}>

                {/* Tips card */}
                <div className="develop-card" style={{ flex:1, minWidth:220, borderTop:`3px solid ${talentData.color}` }}>
                  <div className="develop-card-title" style={{ color:talentData.color }}>
                    {talentData.icon} {L.tips}
                  </div>
                  <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:8 }}>
                    {talentData.tips[lang]?.map((tip, i) => (
                      <li key={i} style={{ fontSize:"0.88rem", fontWeight:700, color: dark?"#E3F2FD":"#37474F", display:"flex", gap:8, alignItems:"flex-start" }}>
                        <span style={{ color:talentData.color, flexShrink:0 }}>✔</span> {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Courses card */}
                <div className="develop-card" style={{ flex:1, minWidth:220, borderTop:`3px solid ${talentData.color}` }}>
                  <div className="develop-card-title" style={{ color:talentData.color }}>
                    💻 {L.courses}
                  </div>
                  <ul style={{ listStyle:"none", display:"flex", flexDirection:"column", gap:8 }}>
                    {talentData.courses[lang]?.map((course, i) => (
                      <li key={i} style={{ fontSize:"0.88rem", fontWeight:700, color: dark?"#E3F2FD":"#37474F", display:"flex", gap:8, alignItems:"flex-start" }}>
                        <span style={{ color:"#FF7043", flexShrink:0 }}>→</span> {course}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* ── University recommendations ── */}
            {talentData && (
              <div className="develop-card" style={{ marginBottom:24, borderTop:`3px solid ${talentData.color}`, background: dark?"#1A2A3A": `linear-gradient(135deg, ${talentData.color}08, #fff)` }}>
                <div className="develop-card-title" style={{ color:talentData.color, fontSize:"1rem" }}>
                  {L.universities}
                </div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginTop:4 }}>
                  {talentData.universities[lang]?.map((uni, i) => (
                    <div key={i} style={{ background: dark?"#0F1923":"#fff", border:`1.5px solid ${talentData.color}33`, borderRadius:12, padding:"8px 14px", fontSize:"0.82rem", fontWeight:800, color: dark?"#E3F2FD":"#1A237E", boxShadow:`0 2px 8px ${talentData.color}15`, transition:"transform 0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.transform="translateY(-2px)"}
                      onMouseLeave={e => e.currentTarget.style.transform=""}>
                      {uni}
                    </div>
                  ))}
                </div>
                <p style={{ fontSize:"0.72rem", color:"#90A4AE", fontWeight:700, marginTop:12 }}>
                  📚 {L.framework}
                </p>
              </div>
            )}

            {/* ── Career recommendations ── */}
            {careers.length > 0 && (
              <div className="develop-card" style={{ marginBottom:24 }}>
                <div className="develop-card-title">🚀 {L.careers}</div>
                <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>
                  {careers.map((career, i) => (
                    <div key={i} style={{ display:"flex", alignItems:"center", gap:10, background: dark?"#0F1923":"#F8FBFF", border:"1.5px solid #E3F2FD", borderRadius:14, padding:"10px 16px", flex:1, minWidth:160 }}>
                      <span style={{ fontSize:"1.6rem" }}>{career.icon}</span>
                      <div>
                        <div style={{ fontWeight:800, color: dark?"#E3F2FD":"#1A237E", fontSize:"0.9rem" }}>{career.name}</div>
                        {career.match_percent != null && (
                          <div style={{ fontSize:"0.78rem", fontWeight:700, color:"#1565C0" }}>
                            {Math.round(career.match_percent)}% {L.match}
                          </div>
                        )}
                        {career.universities && (
                          <div style={{ fontSize:"0.72rem", color:"#90A4AE", fontWeight:600, marginTop:2 }}>
                            🎓 {career.universities}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Buttons */}
        <div style={{ display:"flex", gap:16, marginTop:8, justifyContent:"center", flexWrap:"wrap" }}>
          <button className="quiz-next" style={{ background:"#1565C0" }} onClick={() => setPage("home")}>
            {L.toHome}
          </button>
          <button className="quiz-next" onClick={() => setPage("tasks")}>
            {L.toTasks}
          </button>
        </div>
      </div>
    </div>
  );
}
