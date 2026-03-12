import Nav from "../components/Nav";
import RadarChart from "../components/RadarChart";

const TALENT_LABELS = {
  logic:      { ru: "Логика",      emoji: "🧠" },
  creativity: { ru: "Творчество",  emoji: "🎨" },
  memory:     { ru: "Память",      emoji: "🃏" },
  leadership: { ru: "Лидерство",   emoji: "👑" },
  languages:  { ru: "Языки",       emoji: "🗣" },
  music:      { ru: "Музыка",      emoji: "🎵" },
};

const COLORS = ["#42A5F5", "#26C6DA", "#66BB6A", "#7E57C2", "#FF7043", "#FFD740"];

export default function ResultsPage({ setPage, results }) {
  // If results come from ML backend, use them. Otherwise show fallback demo data.
  const hasRealResults = results && results.scores;

  const radarData = hasRealResults
    ? Object.entries(results.scores).map(([key, value]) => ({
        label: TALENT_LABELS[key]?.ru || key,
        value: Math.round(value),
      }))
    : [
        { label: "Логика",     value: 85 },
        { label: "Память",     value: 90 },
        { label: "Языки",      value: 70 },
        { label: "Лидерство",  value: 45 },
        { label: "Творчество", value: 60 },
        { label: "Музыка",     value: 50 },
      ];

  const strengths = hasRealResults
    ? results.strengths
    : ["Отличная память", "Сильная логика", "Аналитическое мышление"];

  const careers = hasRealResults
    ? results.careers
    : [
        { name: "Программист", icon: "💻", match_percent: 82 },
        { name: "Инженер",     icon: "⚙️", match_percent: 74 },
        { name: "Учёный",      icon: "🔬", match_percent: 68 },
      ];

  // Overall progress = average of all talent scores
  const avgScore = hasRealResults
    ? Math.round(
        Object.values(results.scores).reduce((a, b) => a + b, 0) /
          Object.values(results.scores).length
      )
    : 60;

  return (
    <div className="page-wrap">
      <Nav page="results" setPage={setPage} />

      <div className="map-section">
        <div className="map-banner">
          <span className="map-banner-title">ТВОЯ КАРТА ТАЛАНТОВ</span>
          <span className="map-banner-stars">⭐ ⭐ ⭐</span>
        </div>

        <div className="map-progress-row">
          <span className="map-progress-label">Прогресс: {avgScore}%</span>
          <div className="map-progress-bar">
            <div className="map-progress-fill" style={{ width: `${avgScore}%` }} />
          </div>
        </div>

        <div className="map-content">
          {/* Radar chart */}
          <div className="radar-wrap">
            <RadarChart data={radarData} />
            <div className="radar-labels">
              {radarData.map((d, i) => (
                <span key={d.label} className="radar-label" style={{ color: COLORS[i % COLORS.length] }}>
                  ● {d.label} {d.value}%
                </span>
              ))}
            </div>
          </div>

          {/* Strengths + careers */}
          <div className="strengths-box">
            <div>
              <p className="strengths-title">Твои сильные стороны:</p>
              <ul className="strengths-list">
                {strengths.map((s, i) => (
                  <li key={i}><span className="check">✔</span> {s}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="strengths-title">Профессии для тебя:</p>
              <ul className="prof-list">
                {careers.map((c, i) => (
                  <li key={i}>
                    <span className="check">{c.icon}</span>{" "}
                    {c.name}
                    {c.match_percent && (
                      <span style={{ color: "#1565C0", fontWeight: 700, marginLeft: 6 }}>
                        {c.match_percent}%
                      </span>
                    )}
                  </li>
                ))}
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
