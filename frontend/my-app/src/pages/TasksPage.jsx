import { useState } from "react";
import Nav from "../components/Nav";
import { t } from "../i18n";

export default function TasksPage({ setPage, lang, dark }) {
  const [progress] = useState(45);

  const TASKS = [
    { color:"#1565C0", emoji:"🧠", label:t(lang,"tasks.logic"),      desc:t(lang,"tasks.desc1") },
    { color:"#FF7043", emoji:"🎨", label:t(lang,"tasks.creativity"),  desc:t(lang,"tasks.desc2") },
    { color:"#EF5350", emoji:"🃏", label:t(lang,"tasks.memory"),      desc:t(lang,"tasks.desc3") },
    { color:"#1976D2", emoji:"💬", label:t(lang,"tasks.comm"),        desc:t(lang,"tasks.desc4") },
  ];

  return (
    <div className="page-wrap">
      <Nav page="tasks" setPage={setPage} lang={lang} dark={dark} />
      <div className="progress-bar-wrap" style={{ marginTop:16 }}>
        <div className="progress-bar-fill" style={{ width:`${progress}%` }} />
      </div>
      <div className="task-section">
        <h2 className="task-title">{t(lang,"tasks.title")}</h2>
        <div className="task-grid">
          {TASKS.map((task) => (
            <div key={task.label} className="task-card" onClick={() => setPage("quiz")}>
              <div className="task-card-header" style={{ background:task.color }}>
                <span style={{ fontSize:"1.2rem" }}>⭐</span>
                {task.label.toUpperCase()}
              </div>
              <div className="task-card-body">
                <div className="task-card-emoji">{task.emoji}</div>
                <div className="task-card-desc">{task.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
