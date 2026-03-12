import { useState, useEffect } from "react";
import Nav from "../components/Nav";
import { quizAPI } from "../api/client";

export default function QuizPage({ setPage, setResults }) {
  const [questions, setQuestions] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState({});   // { q1: 0, q2: 2, ... }
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // ── Load questions from ML service (via backend proxy) ──────────────────────
  useEffect(() => {
    quizAPI.getQuestions()
      .then((res) => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Не удалось загрузить вопросы. Убедитесь, что бэкенд запущен.");
        setLoading(false);
      });
  }, []);

  const progress = questions.length
    ? Math.round((qIdx / questions.length) * 100)
    : 0;

  const currentQ = questions[qIdx];

  const handleSelect = (optIdx) => setSelected(optIdx);

  const handleNext = async () => {
    if (selected === null) return;

    const newAnswers = { ...answers, [currentQ.id]: selected };
    setAnswers(newAnswers);

    // More questions left → go to next
    if (qIdx < questions.length - 1) {
      setQIdx(qIdx + 1);
      setSelected(null);
      return;
    }

    // Last question → submit to backend → ML analyzes
    setSubmitting(true);
    try {
      const res = await quizAPI.submitAnswers(newAnswers, "ru");
      setResults(res.data);   // pass results up to App
      setPage("results");
    } catch (err) {
      const msg = err.response?.data?.detail || "Ошибка при отправке ответов.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render states ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="page-wrap">
        <Nav page="quiz" setPage={setPage} />
        <div style={{ textAlign: "center", marginTop: 80, fontSize: "1.2rem" }}>
          ⏳ Загружаем вопросы...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-wrap">
        <Nav page="quiz" setPage={setPage} />
        <div style={{ textAlign: "center", marginTop: 80, color: "red", fontSize: "1rem" }}>
          ❌ {error}
          <br /><br />
          <button className="quiz-next" onClick={() => setPage("home")}>← На главную</button>
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
        <p className="quiz-counter">
          Вопрос {qIdx + 1} из {questions.length}
        </p>

        <p className="quiz-q">{currentQ.question.ru}</p>

        <div className="quiz-options">
          {currentQ.options.ru.map((opt, i) => (
            <button
              key={i}
              className={`quiz-option${selected === i ? " selected" : ""}`}
              onClick={() => handleSelect(i)}
            >
              {opt}
            </button>
          ))}
        </div>

        <button
          className="quiz-next"
          onClick={handleNext}
          disabled={selected === null || submitting}
          style={{ opacity: selected === null || submitting ? 0.5 : 1 }}
        >
          {submitting
            ? "⏳ Анализируем..."
            : qIdx < questions.length - 1
            ? "Следующий вопрос →"
            : "Получить результат 🎉"}
        </button>
      </div>
    </div>
  );
}
