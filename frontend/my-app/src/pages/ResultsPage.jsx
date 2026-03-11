import Nav from "../components/Nav";
import RadarChart from "../components/RadarChart";

const RADAR_DATA = [
  { label: "Логика",     value: 85 },
  { label: "Память",     value: 90 },
  { label: "Языки",      value: 70 },
  { label: "Лидерство",  value: 45 },
  { label: "Творчество", value: 60 },
];

const COLORS = ["#42A5F5", "#26C6DA", "#66BB6A", "#7E57C2", "#FF7043"];

export default function ResultsPage({ setPage }) {
  return (
    <div className="page-wrap">
      <Nav page="results" setPage={setPage} />

      <div className="map-section">
        <div className="map-banner">
          <span className="map-banner-title">ТВОЯ КАРТА ТАЛАНТОВ</span>
          <span className="map-banner-stars">⭐ ⭐ ⭐</span>
        </div>

        <div className="map-progress-row">
          <span className="map-progress-label">Прогресс: 60%</span>
          <div className="map-progress-bar">
            <div className="map-progress-fill" style={{ width: "60%" }} />
          </div>
        </div>

        <div className="map-content">
          <div className="radar-wrap">
            <RadarChart data={RADAR_DATA} />
            <div className="radar-labels">
              {RADAR_DATA.map((d, i) => (
                <span key={d.label} className="radar-label" style={{ color: COLORS[i] }}>
                  ● {d.label} {d.value}%
                </span>
              ))}
            </div>
          </div>

          <div className="strengths-box">
            <div>
              <p className="strengths-title">Твои сильные стороны:</p>
              <ul className="strengths-list">
                <li><span className="check">✔</span> Отличная память</li>
                <li><span className="check">✔</span> Сильная логика</li>
                <li><span className="check">✔</span> Аналитическое мышление</li>
              </ul>
            </div>
            <div>
              <p className="strengths-title">Профессии для тебя:</p>
              <ul className="prof-list">
                <li><span className="check">✔</span> Программист</li>
                <li><span className="check">✔</span> Инженер</li>
                <li><span className="check">✔</span> Шахматист</li>
              </ul>
            </div>
            <button
              className="hero-cta"
              style={{ marginTop: 8, fontSize: "1rem", padding: "13px 32px" }}
              onClick={() => setPage("develop")}
            >
              Развивать таланты →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
