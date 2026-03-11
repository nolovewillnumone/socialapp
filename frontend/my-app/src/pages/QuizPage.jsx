import { useState } from "react";
import Nav from "../components/Nav";

const QUESTIONS = [
  {
    q: "Тебе дают головоломку из 500 деталей. Что ты делаешь?",
    opts: [
      "Сразу начинаю собирать!",
      "Сначала изучаю картинку на коробке",
      "Прошу кого-то помочь",
      "Откладываю и займусь чем-то другим",
    ],
  },
  {
    q: "Какое занятие тебе нравится больше всего?",
    opts: [
      "Рисовать и создавать поделки",
      "Играть в шахматы или логические игры",
      "Читать книги",
      "Общаться с друзьями",
    ],
  },
  {
    q: "Ты видишь новый танец в видео. Как быстро ты его запомнишь?",
    opts: [
      "Запомню с первого просмотра!",
      "Нужно раза 3 посмотреть",
      "Буду повторять долго",
      "Лучше попрошу объяснить",
    ],
  },
  {
    q: "Что тебе легче всего?",
    opts: [
      "Решать математические задачи",
      "Сочинять истории",
      "Запоминать числа и даты",
      "Убеждать других в своей правоте",
    ],
  },
];

export default function QuizPage({ setPage }) {
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);

  const progress = Math.round((qIdx / QUESTIONS.length) * 100);
  const q = QUESTIONS[qIdx];

  const handleNext = () => {
    if (selected === null) return;
    if (qIdx < QUESTIONS.length - 1) {
      setQIdx(qIdx + 1);
      setSelected(null);
    } else {
      setPage("results");
    }
  };

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
