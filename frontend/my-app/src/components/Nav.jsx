export default function Nav({ page, setPage }) {
  return (
    <nav className="nav">
      <div className="nav-logo" onClick={() => setPage("home")}>
        <span>🚀</span> КАРТА ТАЛАНТОВ
      </div>
      <div className="nav-links">
        <button className="nav-link" onClick={() => setPage("quiz")}>Тест Талантов</button>
        <button className="nav-link" onClick={() => setPage("tasks")}>Игры</button>
        <button className="nav-link">О проекте</button>
        <button className="nav-btn" onClick={() => setPage(page === "home" ? "quiz" : "results")}>
          Войти
        </button>
      </div>
    </nav>
  );
}
