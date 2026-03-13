import { useState } from "react";
import Nav from "../components/Nav";
import Loader from "../components/Loader";
import { quizAPI } from "../api/client";

const QUESTIONS = [
  { id: "q1",  q: "2, 4, 8, 16, __ — какое число продолжает ряд?", opts: ["24", "32", "30", "28"] },
  { id: "q2",  q: "Если все кошки — животные, и некоторые животные летают, то...", opts: ["Все кошки летают", "Некоторые кошки могут летать", "Кошки не летают", "Нельзя сказать точно"] },
  { id: "q3",  q: "Запомните числа: 7, 3, 9, 1, 5 — последнее число?", opts: ["1", "5", "9", "3"] },
  { id: "q4",  q: "Что вы ели вчера? Какой тип памяти это проверяет?", opts: ["Кратковременная память", "Долговременная память", "Эпизодическая память", "Процедурная память"] },
  { id: "q5",  q: "Что можно сделать со старой газетой?", opts: ["Прочитать", "Выбросить", "Много всего: кораблик, игра, арт", "Сжечь"] },
  { id: "q6",  q: "Что самое важное для создания нового изобретения?", opts: ["Деньги", "Правила и порядок", "Воображение и нестандартное мышление", "Копировать других"] },
  { id: "q7",  q: "В групповом проекте вы обычно...", opts: ["Беру инициативу и распределяю задачи", "Жду указаний", "Предпочитаю работать один", "Немного помогаю"] },
  { id: "q8",  q: "Если друг расстроен, вы...", opts: ["Не обращаю внимания", "Сразу помогаю и слушаю", "Говорю кому-то другому", "Теряюсь"] },
  { id: "q9",  q: "На скольких языках вы можете говорить?", opts: ["Только 1", "2 языка", "3 языка", "4 и более"] },
  { id: "q10", q: "Вы играете на музыкальном инструменте или любите петь?", opts: ["Да, на профессиональном уровне", "Да, как хобби", "Иногда, но не часто", "Нет, не интересует"] },
];

export default function QuizPage({ setPage, setResults }) {
  const [qIdx, setQIdx]             = useState(0);
  const [selected, setSelected]     = useState(null);
  const [answers, setAnswers]       = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]           = useState(null);

  const progress = Math.round((qIdx / QUESTIONS.length) * 100);
  const q = QUESTIONS[qIdx];

  const handleNext = async () => {
    if (selected === null) return;

    const newAnswers = { ...answers, [q.id]: selected };
    setAnswers(newAnswers);

    if (qIdx < QUESTIONS.length - 1) {
      setQIdx(qIdx + 1);
      setSelected(null);
      return;
    }

    // Last question — submit to ML
    setSubmitting(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      let data;

      if (token) {
        const res = await quizAPI.submitAnswers(newAnswers, "ru");
        data = res.data;
      } else {
        const res = await fetch("http://localhost:8001/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers: newAnswers, lang: "ru" }),
        });
        data = await res.json();
      }

      setResults(data);
      setPage("results");
    } catch {
      setError("Сервер не отвечает. Убедись, что бэкенд запущен.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Full screen loading while ML is analyzing ──────────────────────────────
  if (submitting) {
    return (
      <div className="page-wrap">
        <Nav page="quiz" setPage={setPage} />
        <Loader message="Анализируем твои таланты... 🧠" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrap">
        <Nav page="quiz" setPage={setPage} />
        <div style={{ textAlign: "center", marginTop: 60, padding: "0 24px" }}>
          <div style={{ fontSize: "2rem", marginBottom: 12 }}>❌</div>
          <p style={{ color: "#E64A19", fontWeight: 700, marginBottom: 8 }}>{error}</p>
          <p style={{ color: "#90A4AE", fontSize: "0.85rem", marginBottom: 24 }}>
            Terminal 1: uvicorn backend.main:app --port 8000<br />
            Terminal 2: uvicorn ml.ml_service:app --port 8001
          </p>
          <button className="quiz-next" onClick={() => setError(null)}>Попробовать снова</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrap">
      <Nav page="quiz" setPage={setPage} />

      <div className="progress-bar-wrap" style={{ marginTop: 16 }}>
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="quiz-section">
        <p className="quiz-counter">Вопрос {qIdx + 1} из {QUESTIONS.length}</p>
        <p className="quiz-q">{q.q}</p>

        <div className="quiz-options">
          {q.opts.map((opt, i) => (
            <button
              key={i}
              className={`quiz-option${selected === i ? " selected" : ""}`}
              onClick={() => setSelected(i)}
            >
              {opt}
            </button>
          ))}
        </div>

        <button
          className="quiz-next"
          onClick={handleNext}
          disabled={selected === null}
          style={{ opacity: selected === null ? 0.5 : 1 }}
        >
          {qIdx < QUESTIONS.length - 1 ? "Следующий вопрос →" : "Получить результат 🎉"}
        </button>
      </div>
    </div>
  );
}
