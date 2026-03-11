import Nav from "../components/Nav";

export default function HomePage({ setPage }) {
  return (
    <div className="page-wrap">
      <Nav page="home" setPage={setPage} />

      {/* Hero */}
      <div className="hero">
        <div className="hero-text">
          <h1 className="hero-title">Узнай свои<br />таланты!</h1>
          <button className="hero-cta" onClick={() => setPage("quiz")}>
            Начать тест
          </button>
        </div>
        <div className="hero-icons">
          <div className="hero-icon">💡</div>
          <div className="hero-icon">🚀</div>
          <div className="hero-icon">📚</div>
        </div>
      </div>

      {/* Steps */}
      <div className="steps">
        <div className="step">
          <div className="step-icon">🎮</div>
          <div className="step-title">Играй</div>
          <div className="step-desc">Проходи весёлые мини-игры</div>
        </div>
        <div className="step-arrow">›</div>
        <div className="step">
          <div className="step-icon">📊</div>
          <div className="step-title">Получай результат</div>
          <div className="step-desc">Узнай свои сильные стороны</div>
        </div>
        <div className="step-arrow">›</div>
        <div className="step">
          <div className="step-icon">🚀</div>
          <div className="step-title">Развивайся</div>
          <div className="step-desc">Найди подходящее занятие</div>
        </div>
      </div>
    </div>
  );
}
