import { useState } from "react";
import Nav from "../components/Nav";

const TASKS = [
  { color: "#1565C0", emoji: "🧠", label: "Логика",       desc: "Реши головоломку"  },
  { color: "#FF7043", emoji: "🎨", label: "Творчество",   desc: "Нарисуй картину"   },
  { color: "#EF5350", emoji: "🃏", label: "Память",       desc: "Запомни порядок"   },
  { color: "#1976D2", emoji: "💬", label: "Коммуникация", desc: "Ответь на вопросы" },
];

export default function TasksPage({ setPage }) {
  const [progress] = useState(45);

  return (
    <div className="page-wrap">
      <Nav page="tasks" setPage={setPage} />

      <div className="progress-bar-wrap" style={{ marginTop: 16 }}>
        <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="task-section">
        <h2 className="task-title">Выбери задание:</h2>
        <div className="task-grid">
          {TASKS.map((t) => (
            <div key={t.label} className="task-card" onClick={() => setPage("quiz")}>
              <div className="task-card-header" style={{ background: t.color }}>
                <span style={{ fontSize: "1.2rem" }}>⭐</span>
                {t.label.toUpperCase()}
              </div>
              <div className="task-card-body">
                <div className="task-card-emoji">{t.emoji}</div>
                <div className="task-card-desc">{t.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
