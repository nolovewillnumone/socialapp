import { useState } from "react";
import Nav from "../components/Nav";
import Loader from "../components/Loader";
import { quizAPI } from "../api/client";
import { t } from "../i18n";

// Questions keyed by language — IDs must match ml/talent_analyzer.py
const QUESTIONS = {
  ru: [
    { id:"q1",  q:"2, 4, 8, 16, __ — какое число продолжает ряд?",                           opts:["24","32","30","28"] },
    { id:"q2",  q:"Если все кошки — животные, и некоторые животные летают, то...",            opts:["Все кошки летают","Некоторые кошки могут летать","Кошки не летают","Нельзя сказать точно"] },
    { id:"q3",  q:"Запомните числа: 7, 3, 9, 1, 5 — последнее число?",                       opts:["1","5","9","3"] },
    { id:"q4",  q:"Что вы ели вчера? Какой тип памяти это проверяет?",                        opts:["Кратковременная память","Долговременная память","Эпизодическая память","Процедурная память"] },
    { id:"q5",  q:"Что можно сделать со старой газетой?",                                      opts:["Прочитать","Выбросить","Много всего: кораблик, игра, арт","Сжечь"] },
    { id:"q6",  q:"Что самое важное для создания нового изобретения?",                         opts:["Деньги","Правила и порядок","Воображение и нестандартное мышление","Копировать других"] },
    { id:"q7",  q:"В групповом проекте вы обычно...",                                          opts:["Беру инициативу и распределяю задачи","Жду указаний","Предпочитаю работать один","Немного помогаю"] },
    { id:"q8",  q:"Если друг расстроен, вы...",                                                opts:["Не обращаю внимания","Сразу помогаю и слушаю","Говорю кому-то другому","Теряюсь"] },
    { id:"q9",  q:"На скольких языках вы можете говорить?",                                    opts:["Только 1","2 языка","3 языка","4 и более"] },
    { id:"q10", q:"Вы играете на музыкальном инструменте или любите петь?",                    opts:["Да, на профессиональном уровне","Да, как хобби","Иногда, но не часто","Нет, не интересует"] },
  ],
  uz: [
    { id:"q1",  q:"2, 4, 8, 16, __ — qaysi son davom ettiradi?",                              opts:["24","32","30","28"] },
    { id:"q2",  q:"Agar barcha mushuklar hayvon bo'lsa va ba'zi hayvonlar uchsa, u holda...", opts:["Barcha mushuklar ucha oladi","Ba'zi mushuklar ucha olishi mumkin","Mushuklar uchmaydigan hayvonlar","Aytib bo'lmaydi"] },
    { id:"q3",  q:"Bu raqamlarni eslab qoling: 7, 3, 9, 1, 5 — oxirgi raqam?",               opts:["1","5","9","3"] },
    { id:"q4",  q:"Kecha nima yedingiz? Bu qaysi xotira turini tekshiradi?",                   opts:["Qisqa muddatli xotira","Uzoq muddatli xotira","Epizodik xotira","Protsedural xotira"] },
    { id:"q5",  q:"Bir eski gazeta bilan nima qilish mumkin?",                                 opts:["O'qish","Axlatga tashlash","Ko'p narsalar: qog'oz qayiq, o'yin, art","Yoqish"] },
    { id:"q6",  q:"Yangi ixtiro qilish uchun eng muhim narsa nima?",                           opts:["Pul","Qoida va tartib","Tasavvur va yangicha fikrlash","Boshqalarni nusxalash"] },
    { id:"q7",  q:"Guruh loyihasida siz odatda nima qilasiz?",                                 opts:["Yetakchilik qilaman va vazifalarni taqsimlaman","Buyruq kutaman","Yolg'iz ishlashni afzal ko'raman","Ozgina yordam beraman"] },
    { id:"q8",  q:"Do'stingiz xafa bo'lsa, siz nima qilasiz?",                                opts:["E'tibor bermayman","Darhol yordam beraman va tinglayman","Boshqa birovga aytaman","Qo'rqib ketaman"] },
    { id:"q9",  q:"Nechta tilda gaplasha olasiz?",                                             opts:["Faqat 1 ta","2 ta","3 ta","4 va undan ko'p"] },
    { id:"q10", q:"Musiqa asbobini chalasizmi yoki qo'shiq aytirishni yoqtirasizmi?",          opts:["Ha, professional darajada","Ha, hobiy sifatida","Ba'zan, lekin ko'p emas","Yo'q, qiziqmayman"] },
  ],
  en: [
    { id:"q1",  q:"2, 4, 8, 16, __ — which number continues?",                                opts:["24","32","30","28"] },
    { id:"q2",  q:"If all cats are animals and some animals can fly, then...",                 opts:["All cats can fly","Some cats might fly","Cats definitely can't fly","Cannot be determined"] },
    { id:"q3",  q:"Remember these numbers: 7, 3, 9, 1, 5 — what was the last?",               opts:["1","5","9","3"] },
    { id:"q4",  q:"What did you eat yesterday? What type of memory does this test?",           opts:["Short-term memory","Long-term memory","Episodic memory","Procedural memory"] },
    { id:"q5",  q:"What can you do with an old newspaper?",                                    opts:["Read it","Throw it away","Many things: boat, game, art","Burn it"] },
    { id:"q6",  q:"What is most important for creating a new invention?",                      opts:["Money","Rules and order","Imagination and original thinking","Copying others"] },
    { id:"q7",  q:"In a group project, you usually...",                                        opts:["Take initiative and assign tasks","Wait for instructions","Prefer working alone","Just help a little"] },
    { id:"q8",  q:"If your friend is upset, you...",                                           opts:["Ignore it","Help immediately and listen","Tell someone else","Feel lost"] },
    { id:"q9",  q:"How many languages can you speak?",                                         opts:["Only 1","2 languages","3 languages","4 or more"] },
    { id:"q10", q:"Do you play an instrument or love to sing?",                                opts:["Yes, at a professional level","Yes, as a hobby","Sometimes, not much","No, not interested"] },
  ],
};

export default function QuizPage({ setPage, setResults, lang, dark }) {
  const questions = QUESTIONS[lang] || QUESTIONS.ru;
  const [qIdx, setQIdx]             = useState(0);
  const [selected, setSelected]     = useState(null);
  const [answers, setAnswers]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);

  const progress = Math.round((qIdx / questions.length) * 100);
  const q = questions[qIdx];

  const handleNext = async () => {
    if (selected === null) return;
    const newAnswers = { ...answers, [q.id]: selected };
    setAnswers(newAnswers);

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
        <div style={{ fontSize:"2rem", marginBottom:12 }}>❌</div>
        <p style={{ color:"#E64A19", fontWeight:700, marginBottom:24 }}>{error}</p>
        <button className="quiz-next" onClick={() => setError(null)}>{t(lang, "quiz.retry")}</button>
      </div>
    </div>
  );

  return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} lang={lang} dark={dark} />
      <div className="progress-bar-wrap" style={{ marginTop:16 }}>
        <div className="progress-bar-fill" style={{ width:`${progress}%` }} />
      </div>
      <div className="quiz-section">
        <p className="quiz-counter">{t(lang,"quiz.counter")} {qIdx+1} {t(lang,"quiz.of")} {questions.length}</p>
        <p className="quiz-q">{q.q}</p>
        <div className="quiz-options">
          {q.opts.map((opt, i) => (
            <button key={i} className={`quiz-option${selected===i?" selected":""}`} onClick={() => setSelected(i)}>
              {opt}
            </button>
          ))}
        </div>
        <button className="quiz-next" onClick={handleNext} disabled={selected===null} style={{ opacity:selected===null?0.5:1 }}>
          {qIdx < questions.length-1 ? t(lang,"quiz.next") : t(lang,"quiz.finish")}
        </button>
      </div>
    </div>
  );
}
