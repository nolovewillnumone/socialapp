import Nav from "../components/Nav";

export default function DevelopPage({ setPage }) {
  return (
    <div className="page-wrap">
      <Nav page="develop" setPage={setPage} />

      <div className="develop-section">
        <div className="develop-banner">
          <div className="develop-banner-title">Развивай свои таланты!</div>
          <span style={{ color: "#fff", fontSize: "0.95rem", fontWeight: 700 }}>
            ⭐ Персональные рекомендации
          </span>
        </div>

        <div className="develop-content">
          <div className="develop-left">
            <div className="develop-card">
              <div className="develop-card-title">Тебе подойдёт программирование:</div>
              <ul>
                <li><span className="check">✔</span> Пройди курс по кодингу</li>
                <li><span className="check">✔</span> Собери робота</li>
                <li><span className="check">✔</span> Попробуй создать свою игру</li>
              </ul>
            </div>

            <div className="develop-card">
              <div className="develop-card-title">Профессии рядом с тобой:</div>
              <ul>
                <li>
                  <span style={{ color: "#FF7043", fontSize: "1.1rem" }}>✔</span>
                  Курс "Юный программист"
                </li>
                <li>
                  <span style={{ color: "#FF7043", fontSize: "1.1rem" }}>✔</span>
                  Секция робототехники
                </li>
                <li>
                  <span style={{ color: "#FF7043", fontSize: "1.1rem" }}>✔</span>
                  Шахматный кружок
                </li>
              </ul>
            </div>
          </div>

          <div className="develop-right">
            <div className="robot-box">
              🤖
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#1565C0", marginTop: 10 }}>
                Твой личный помощник в обучении!
              </div>
            </div>

            <div className="map-box">
              <div className="map-box-title">📍 Рядом с Tashkent:</div>
              <div className="map-pin-row">📌 ИТ-школа Tashkent</div>
              <div className="map-pin-row">📌 Robotics Hub</div>
              <div className="map-pin-row">📌 Chess Academy</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16, marginTop: 28, justifyContent: "center" }}>
          <button
            className="quiz-next"
            style={{ background: "#1565C0" }}
            onClick={() => setPage("home")}
          >
            ← На главную
          </button>
          <button className="quiz-next" onClick={() => setPage("tasks")}>
            Пройти игры 🎮
          </button>
        </div>
      </div>
    </div>
  );
}
