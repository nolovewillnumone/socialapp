import { useState } from "react";
import Nav from "../components/Nav";
import Loader from "../components/Loader";
import { quizAPI } from "../api/client";
import { t } from "../i18n";

// ── Questions based on Gardner's Multiple Intelligences (Harvard) ─────────────
// Progressive difficulty: Easy → Medium → Hard per talent
// Sources: Stanford-Binet, Wechsler, Torrance, Harvard, MIT, Cambridge
const QUESTIONS = {
  ru: [
    // LOGIC — Easy
    { id:"q1",  talent:"logic",      diff:"🟢",
      q: "2, 4, 8, 16, __ — какое число продолжает ряд?",
      hint: "Геометрическая прогрессия (Stanford-Binet)",
      opts: ["24","32","30","28"] },
    // MEMORY — Easy
    { id:"q4",  talent:"memory",     diff:"🟢",
      q: "Запомните слова: ЯБЛОКО, КНИГА, РЕКА, ПТИЦА — третье слово?",
      hint: "Кратковременная память (Wechsler Memory Scale)",
      opts: ["ЯБЛОКО","КНИГА","РЕКА","ПТИЦА"] },
    // CREATIVITY — Easy
    { id:"q7",  talent:"creativity", diff:"🟢",
      q: "Человек придумавший 50 применений для кирпича демонстрирует высокий...",
      hint: "Тест Торренса на творческое мышление",
      opts: ["Логический интеллект","Дивергентное мышление (креативность)","Музыкальный слух","Лингвистику"] },
    // LEADERSHIP — Easy
    { id:"q10", talent:"leadership", diff:"🟢",
      q: "В групповом проекте возник конфликт. Как поступит настоящий лидер?",
      hint: "Harvard Leadership Assessment",
      opts: ["Выслушаю все и найду компромисс","Навяжу своё мнение","Проигнорирую конфликт","Передам другому"] },
    // LOGIC — Medium
    { id:"q2",  talent:"logic",      diff:"🟡",
      q: "Если все врачи — учёные, и некоторые учёные — художники, то...",
      hint: "Логика силлогизмов (Stanford-Binet Intelligence Test)",
      opts: ["Все врачи — художники","Некоторые врачи могут быть художниками","Ни один врач не художник","Нельзя сделать вывод"] },
    // MEMORY — Medium
    { id:"q5",  talent:"memory",     diff:"🟡",
      q: "Что вы ели вчера вечером? Какой тип памяти это тестирует?",
      hint: "Классификация памяти Тулвинга (University of Toronto)",
      opts: ["Процедурная (навыки)","Семантическая (факты)","Эпизодическая (личные события)","Кратковременная"] },
    // CREATIVITY — Medium
    { id:"q8",  talent:"creativity", diff:"🟡",
      q: "Какой этап наиболее важен при создании нового изобретения?",
      hint: "Stanford d.school Design Thinking методология",
      opts: ["Глубокое изучение проблем пользователей (эмпатия)","Немедленно создать прототип","Писать документацию","Составить финансовый план"] },
    // LEADERSHIP — Medium
    { id:"q11", talent:"leadership", diff:"🟡",
      q: "По Дэниелу Гоулману, какой навык важнее всего для лидера?",
      hint: "Goleman Emotional Intelligence Framework (Yale/Harvard)",
      opts: ["Высокий IQ","Эмоциональный интеллект (EQ)","Технические знания","Физическая сила"] },
    // LANGUAGES — Medium
    { id:"q13", talent:"languages",  diff:"🟡",
      q: "Слово «ephemeral» является синонимом к...",
      hint: "Cambridge Language Aptitude Test",
      opts: ["Вечный","Мимолётный / временный","Сильный","Глубокий"] },
    // MUSIC — Medium
    { id:"q15", talent:"music",      diff:"🟡",
      q: "Когда вы слушаете музыку, на что вы обращаете больше внимания?",
      hint: "Gordon Musical Aptitude Profile (Harvard Music Dept.)",
      opts: ["Только словам","Ритму, темпу и структуре мелодии","Внешнему виду музыкантов","Практически не слушаю"] },
    // LOGIC — Hard
    { id:"q3",  talent:"logic",      diff:"🔴",
      q: "Какой угол между стрелками часов ровно в 3:00?",
      hint: "MIT Cognitive Assessment Battery",
      opts: ["60°","90°","120°","75°"] },
    // MEMORY — Hard
    { id:"q6",  talent:"memory",     diff:"🔴",
      q: "Назовите эти цифры в обратном порядке: 7-3-9-1-5",
      hint: "Wechsler Intelligence Scale — Digit Span Backward",
      opts: ["5-1-9-3-7","7-3-9-1-5","5-9-1-3-7","1-5-9-3-7"] },
    // CREATIVITY — Hard
    { id:"q9",  talent:"creativity", diff:"🔴",
      q: "Какой подход наиболее эффективен при творческом решении проблем?",
      hint: "MIT Media Lab Creativity Assessment",
      opts: ["SCAMPER: замени, объедини, адаптируй, измени, используй иначе, устрани, переставь","Копировать существующие решения","Следовать большинству","Первая пришедшая идея"] },
    // LEADERSHIP — Hard
    { id:"q12", talent:"leadership", diff:"🔴",
      q: "Чем трансформационный лидер отличается от транзакционного?",
      hint: "MIT Sloan Leadership Study (Bass, 1985)",
      opts: ["Работает через задачи и вознаграждения","Вдохновляет, развивает и показывает видение будущего","Устанавливает строгий контроль","Принимает все решения единолично"] },
    // LANGUAGES — Hard
    { id:"q14", talent:"languages",  diff:"🔴",
      q: "На скольких языках вы можете общаться и на каком уровне?",
      hint: "Oxford Language Assessment Framework (CEFR)",
      opts: ["1 (родной)","2 (родной + 1 иностранный, средний)","3 (минимум B1 в каждом)","4+ (минимум C1+ в одном)"] },
  ],
  uz: [
    { id:"q1",  talent:"logic",      diff:"🟢", q:"2, 4, 8, 16, __ — qaysi son ketma-ketlikni davom ettiradi?",                           hint:"Geometrik progressiya (Stanford-Binet)",                opts:["24","32","30","28"] },
    { id:"q4",  talent:"memory",     diff:"🟢", q:"Eslab qoling: OLMA, KITOB, DARYO, QUSH — uchinchi so'z?",                              hint:"Qisqa muddatli xotira (Wechsler Memory Scale)",          opts:["OLMA","KITOB","DARYO","QUSH"] },
    { id:"q7",  talent:"creativity", diff:"🟢", q:"G'isht uchun 50 ta ishlatish o'ylab topgan odam qanday tafakkurga ega?",               hint:"Torrans ijodiy tafakkur testi",                          opts:["Mantiqiy intellekt","Divergent tafakkur (ijodkorlik)","Musiqiy eshituv","Til qobiliyati"] },
    { id:"q10", talent:"leadership", diff:"🟢", q:"Guruh loyihasida kelishmovchilik chiqdi. Haqiqiy rahbar nima qiladi?",                  hint:"Harvard Leadership Assessment",                         opts:["Barcha fikrlarni tinglab kompromis izlayman","O'z fikrimni yuklayman","Muammoni e'tiborsiz qoldiraman","Boshqaga topshiraman"] },
    { id:"q2",  talent:"logic",      diff:"🟡", q:"Agar barcha shifokorlar olim bo'lsa va ba'zi olimlar rassom bo'lsa, u holda...",        hint:"Sillogizm mantiqi (Stanford-Binet Intelligence Test)",   opts:["Barcha shifokorlar rassom","Ba'zi shifokorlar rassom bo'lishi mumkin","Hech bir shifokor rassom emas","Aniq aytib bo'lmaydi"] },
    { id:"q5",  talent:"memory",     diff:"🟡", q:"Kecha kechqurun nima yedingiz? Bu qaysi xotira turini tekshiradi?",                    hint:"Tulving xotira tasnifi (Toronto universiteti)",          opts:["Protsedural (ko'nikmalar)","Semantik (faktlar)","Epizodik (shaxsiy voqealar)","Qisqa muddatli"] },
    { id:"q8",  talent:"creativity", diff:"🟡", q:"Yangi ixtiro yaratishda eng muhim bosqich qaysi?",                                      hint:"Stanford d.school Design Thinking metodologiyasi",       opts:["Foydalanuvchi muammolarini chuqur o'rganish (empathize)","Darhol prototip yaratish","Texnik hujjat yozish","Moliyaviy reja tuzish"] },
    { id:"q11", talent:"leadership", diff:"🟡", q:"Daniel Goleman bo'yicha liderlikdagi eng muhim ko'nikma qaysi?",                       hint:"Goleman Hissiy Intellekt Modeli (Yale/Harvard)",         opts:["Yuqori IQ","Hissiy intellekt (EQ)","Texnik bilimlar","Jismoniy kuch"] },
    { id:"q13", talent:"languages",  diff:"🟡", q:"\"Ephemeral\" so'zi qaysi ma'noga yaqin?",                                             hint:"Cambridge Language Aptitude Test",                       opts:["Abadiy","Vaqtinchalik / o'tkinchi","Kuchli","Chuqur"] },
    { id:"q15", talent:"music",      diff:"🟡", q:"Musiqa tinglayotganda nimaga ko'proq e'tibor berasiz?",                                hint:"Gordon Musical Aptitude Profile (Harvard Music Dept.)",  opts:["Faqat so'zlarga","Ritm, sur'at va melodiya tuzilishi","Musiqachilarning tashqi ko'rinishi","Deyarli e'tibor bermayman"] },
    { id:"q3",  talent:"logic",      diff:"🔴", q:"Soat 3:00 da soat millari orasidagi burchak necha gradus?",                            hint:"MIT Kognitiv Baholash Batareyasi",                       opts:["60°","90°","120°","75°"] },
    { id:"q6",  talent:"memory",     diff:"🔴", q:"Bu raqamlarni teskari tartibda ayting: 7-3-9-1-5",                                     hint:"Wechsler Intelligence Scale — Digit Span Backward",      opts:["5-1-9-3-7","7-3-9-1-5","5-9-1-3-7","1-5-9-3-7"] },
    { id:"q9",  talent:"creativity", diff:"🔴", q:"Ijodiy muammoni hal qilishda qaysi yondashuv eng samarali?",                           hint:"MIT Media Lab Ijodkorlik Baholash Testi",                opts:["SCAMPER: almashtir, birlashtir, moslashtir, o'zgartir, boshqa maqsadda ishlat, yo'q qil, qayta tartiblash","Mavjud yechimlarni ko'chirish","Ko'pchilik fikriga qo'shilish","Birinchi kelgan g'oyani ishlatish"] },
    { id:"q12", talent:"leadership", diff:"🔴", q:"Transformatsion rahbar transaksion rahbardan qanday farq qiladi?",                     hint:"MIT Sloan Leadership Study (Bass, 1985)",                opts:["Faqat vazifalar va mukofotlar bilan ishlaydi","Ilhom beradi, rivojlantiradi va kelajakni ko'rsatadi","Qattiq nazorat o'rnatadi","Barcha qarorlarni o'zi qabul qiladi"] },
    { id:"q14", talent:"languages",  diff:"🔴", q:"Nechta tilda muloqot qila olasiz va qaysi darajada?",                                  hint:"Oxford Language Assessment Framework (CEFR)",            opts:["1 ta (ona tili)","2 ta (ona tili + 1 chet til, o'rta daraja)","3 ta (har birida kamida B1)","4 va undan ko'p (kamida bittasida C1+)"] },
  ],
  en: [
    { id:"q1",  talent:"logic",      diff:"🟢", q:"2, 4, 8, 16, __ — which number continues the sequence?",                               hint:"Geometric progression (Stanford-Binet)",                 opts:["24","32","30","28"] },
    { id:"q4",  talent:"memory",     diff:"🟢", q:"Remember: APPLE, BOOK, RIVER, BIRD — what was the third word?",                        hint:"Short-term memory (Wechsler Memory Scale)",              opts:["APPLE","BOOK","RIVER","BIRD"] },
    { id:"q7",  talent:"creativity", diff:"🟢", q:"A person who finds 50 uses for a brick demonstrates high...",                          hint:"Torrance Tests of Creative Thinking",                    opts:["Logical intelligence","Divergent thinking (creativity)","Musical ability","Linguistic skill"] },
    { id:"q10", talent:"leadership", diff:"🟢", q:"A conflict arises in your group project. What should a true leader do?",               hint:"Harvard Leadership Assessment Framework",                opts:["Listen to all sides and find compromise","Impose my view — I'm the leader","Ignore the conflict","Delegate to someone else"] },
    { id:"q2",  talent:"logic",      diff:"🟡", q:"If all doctors are scientists, and some scientists are artists, then...",              hint:"Syllogistic logic (Stanford-Binet Intelligence Test)",    opts:["All doctors are artists","Some doctors might be artists","No doctor is an artist","Cannot be determined"] },
    { id:"q5",  talent:"memory",     diff:"🟡", q:"What did you eat last night? What type of memory does this test?",                     hint:"Tulving's memory classification (University of Toronto)",opts:["Procedural (skills)","Semantic (facts)","Episodic (personal events)","Short-term memory"] },
    { id:"q8",  talent:"creativity", diff:"🟡", q:"Which step is most critical when creating a new invention?",                          hint:"Stanford d.school Design Thinking methodology",          opts:["Deeply understanding user problems (empathize)","Immediately build a prototype","Write documentation","Create a financial plan"] },
    { id:"q11", talent:"leadership", diff:"🟡", q:"According to Daniel Goleman, which skill is most critical for leadership?",           hint:"Goleman Emotional Intelligence Framework (Yale/Harvard)", opts:["High IQ","Emotional Intelligence (EQ)","Technical expertise","Physical strength"] },
    { id:"q13", talent:"languages",  diff:"🟡", q:"The word 'ephemeral' is closest in meaning to...",                                    hint:"Cambridge Language Aptitude Test",                       opts:["Eternal","Fleeting / temporary","Powerful","Deep"] },
    { id:"q15", talent:"music",      diff:"🟡", q:"When listening to music, what do you naturally pay attention to?",                    hint:"Gordon Musical Aptitude Profile (Harvard Music Dept.)",  opts:["Only the lyrics","Rhythm, tempo and melodic structure","The musicians' appearance","I barely pay attention"] },
    { id:"q3",  talent:"logic",      diff:"🔴", q:"What is the exact angle between clock hands at 3:00?",                               hint:"MIT Cognitive Assessment Battery",                       opts:["60°","90°","120°","75°"] },
    { id:"q6",  talent:"memory",     diff:"🔴", q:"Repeat these digits in reverse order: 7-3-9-1-5",                                    hint:"Wechsler Intelligence Scale — Digit Span Backward",      opts:["5-1-9-3-7","7-3-9-1-5","5-9-1-3-7","1-5-9-3-7"] },
    { id:"q9",  talent:"creativity", diff:"🔴", q:"Which approach is most effective for creative problem solving?",                      hint:"MIT Media Lab Creativity Assessment",                    opts:["SCAMPER: Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse","Copy existing solutions","Follow majority opinion","Use the first idea that comes to mind"] },
    { id:"q12", talent:"leadership", diff:"🔴", q:"How does a transformational leader differ from a transactional one?",                 hint:"MIT Sloan Leadership Study (Bass, 1985)",                opts:["Focuses on tasks and rewards only","Inspires, develops people and shows a vision","Establishes strict control","Makes all decisions alone"] },
    { id:"q14", talent:"languages",  diff:"🔴", q:"How many languages can you communicate in and at what level?",                       hint:"Oxford Language Assessment Framework (CEFR)",            opts:["1 (native only)","2 (native + 1 foreign, intermediate)","3 (at least B1 in each)","4+ (at least C1+ in one)"] },
  ],
};

const DIFF_LABEL = {
  "🟢": { ru:"Лёгкий",  uz:"Oson",   en:"Easy"   },
  "🟡": { ru:"Средний", uz:"O'rta",  en:"Medium" },
  "🔴": { ru:"Сложный", uz:"Qiyin",  en:"Hard"   },
};

export default function QuizPage({ setPage, setResults, lang, dark }) {
  const questions = QUESTIONS[lang] || QUESTIONS.ru;
  const [qIdx, setQIdx]             = useState(0);
  const [selected, setSelected]     = useState(null);
  const [answers, setAnswers]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);
  const [showHint, setShowHint]     = useState(false);

  const progress = Math.round((qIdx / questions.length) * 100);
  const q = questions[qIdx];

  const handleNext = async () => {
    if (selected === null) return;
    const newAnswers = { ...answers, [q.id]: selected };
    setAnswers(newAnswers);
    setShowHint(false);

    if (qIdx < questions.length - 1) {
      setQIdx(qIdx + 1);
      setSelected(null);
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      let data;
      if (token) {
        const res = await quizAPI.submitAnswers(newAnswers, lang);
        data = res.data;
      } else {
        const res = await fetch("http://localhost:8001/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: newAnswers, lang }),
        });
        data = await res.json();
      }
      setResults(data);
      setPage("results");
    } catch {
      setError(t(lang, "quiz.errServer"));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitting) return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />
      <Loader message={t(lang, "quiz.analyzing")} />
    </div>
  );

  if (error) return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />
      <div style={{ textAlign:"center", marginTop:60, padding:"0 24px" }}>
        <p style={{ color:"#E64A19", fontWeight:700, marginBottom:24 }}>{error}</p>
        <button className="quiz-next" onClick={() => setError(null)}>{t(lang,"quiz.retry")}</button>
      </div>
    </div>
  );

  const diffLabel = DIFF_LABEL[q.diff]?.[lang] || "";

  return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />

      {/* Progress bar */}
      <div className="progress-bar-wrap" style={{ marginTop:16 }}>
        <div className="progress-bar-fill" style={{ width:`${progress}%` }} />
      </div>

      <div className="quiz-section">
        {/* Header row */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexWrap:"wrap", gap:8 }}>
          <p className="quiz-counter" style={{ margin:0 }}>
            {t(lang,"quiz.counter")} {qIdx+1} {t(lang,"quiz.of")} {questions.length}
          </p>
          <div style={{ display:"flex", gap:8, alignItems:"center" }}>
            {/* Difficulty badge */}
            <span style={{ fontSize:"0.75rem", fontWeight:800, background:"#F0F4FF", color:"#1565C0", padding:"3px 10px", borderRadius:99 }}>
              {q.diff} {diffLabel}
            </span>
            {/* Hint toggle */}
            <button
              onClick={() => setShowHint(!showHint)}
              style={{ fontSize:"0.75rem", fontWeight:800, background:"#FFF8E1", color:"#FF7043", border:"none", padding:"3px 10px", borderRadius:99, cursor:"pointer" }}
            >
              💡 {lang==="ru"?"Подсказка":lang==="uz"?"Maslahat":"Hint"}
            </button>
          </div>
        </div>

        {/* Research source hint */}
        {showHint && (
          <div style={{ background:"#E8F5E9", border:"1px solid #66BB6A", borderRadius:10, padding:"8px 14px", marginBottom:14, fontSize:"0.8rem", fontWeight:700, color:"#2E7D32" }}>
            📚 {q.hint}
          </div>
        )}

        <p className="quiz-q">{q.q}</p>

        <div className="quiz-options">
          {q.opts.map((opt, i) => (
            <button
              key={i}
              className={`quiz-option${selected===i?" selected":""}`}
              onClick={() => setSelected(i)}
            >
              <span style={{ fontSize:"0.8rem", fontWeight:900, color:"#90A4AE", marginRight:8 }}>
                {["A","B","C","D"][i]}.
              </span>
              {opt}
            </button>
          ))}
        </div>

        {/* Research framework badge */}
        <div style={{ textAlign:"center", marginBottom:12 }}>
          <span style={{ fontSize:"0.7rem", fontWeight:700, color:"#B0BEC5" }}>
            🎓 {lang==="ru"?"Основано на: Gardner's Multiple Intelligences (Harvard)":lang==="uz"?"Asoslanadi: Gardner's Multiple Intelligences (Harvard)":"Based on: Gardner's Multiple Intelligences (Harvard)"}
          </span>
        </div>

        <button
          className="quiz-next"
          onClick={handleNext}
          disabled={selected===null}
          style={{ opacity:selected===null?0.5:1 }}
        >
          {qIdx < questions.length-1 ? t(lang,"quiz.next") : t(lang,"quiz.finish")}
        </button>
      </div>
    </div>
  );
}
