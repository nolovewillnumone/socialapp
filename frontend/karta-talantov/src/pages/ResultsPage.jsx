import { useState, useEffect } from "react";
import Nav from "../components/Nav";
import RadarChart from "../components/RadarChart";
import Loader from "../components/Loader";
import { quizAPI } from "../api/client";
import { t } from "../i18n";

const DEMO = {
  scores:   { logic:85, creativity:60, memory:90, leadership:45, languages:70, music:50 },
  careers:  [{ name:"Программист", icon:"💻", match_percent:82 },{ name:"Инженер", icon:"⚙️", match_percent:74 },{ name:"Учёный", icon:"🔬", match_percent:68 }],
  strengths:["Отличная память","Сильная логика","Аналитическое мышление"],
};
const COLORS = ["#5DCAA5","#26C6DA","#66BB6A","#7E57C2","#EF9F27","#FFD740"];

export default function ResultsPage({ setPage, results, lang, dark }) {
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(null);

  useEffect(() => {
    if (!results && localStorage.getItem("token")) {
      setLoading(true);
      quizAPI.latestResult()
        .then((res) => {
          const d = res.data;
          setFetched({ scores:{ logic:d.score_logic, creativity:d.score_creativity, memory:d.score_memory, leadership:d.score_leadership, languages:d.score_languages, music:d.score_music }, careers:[{ name:d.top_career, icon:"⭐", match_percent:null }], strengths:[] });
        })
        .catch(() => setFetched(null))
        .finally(() => setLoading(false));
    }
  }, [results]);

  if (loading) return (
    <div className="page-wrap">
      <Nav page="results" setPage={setPage} lang={lang} dark={dark} />
      <Loader message={t(lang, "results.loading")} />
    </div>
  );

  // No results and not logged in → redirect to quiz
  const isDemo = !results && !fetched;
  if (isDemo && !localStorage.getItem("token")) {
    return (
      <div className="page-wrap">
        <Nav page="results" setPage={setPage} lang={lang} dark={dark} />
        <div style={{ textAlign:"center", padding:"80px 24px" }}>
          <div style={{ fontSize:"3rem", marginBottom:16 }}>📊</div>
          <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.8rem", color: dark?"#E1F5EE":"#0F6E56", marginBottom:12 }}>
            {lang==="ru"?"Сначала пройди тест!":lang==="uz"?"Avval testni o'ting!":"Take the quiz first!"}
          </h2>
          <p style={{ color: dark?"#9FE1CB":"#78909C", fontWeight:600, marginBottom:28 }}>
            {lang==="ru"?"Чтобы увидеть свою карту талантов, нужно пройти тест.":lang==="uz"?"Iste'dod xaritangizni ko'rish uchun testni o'ting.":"You need to take the quiz to see your talent map."}
          </p>
          <button className="hero-cta" onClick={() => setPage("quiz")}>
            {lang==="ru"?"Начать тест →":lang==="uz"?"Testni boshlash →":"Start quiz →"}
          </button>
        </div>
      </div>
    );
  }

  const data      = results || fetched || DEMO;
  const scores    = data.scores   || DEMO.scores;
  const careers   = data.careers  || DEMO.careers;
  const strengths = data.strengths || DEMO.strengths;

  // Ensure minimum 5% for all talents so radar chart looks good
  const adjustedScores = Object.fromEntries(
    Object.entries(scores).map(([k, v]) => [k, Math.max(5, Math.round(v))])
  );
  const radarData = Object.entries(adjustedScores).map(([key, value]) => ({
    label: t(lang, `talent.${key}`),
    value,
  }));

  const avgScore = Math.round(Object.values(adjustedScores).reduce((a,b)=>a+b,0) / Object.values(adjustedScores).length);

  return (
    <div className="page-wrap">
      <Nav page="results" setPage={setPage} lang={lang} dark={dark} />
      <div className="map-section" style={{ margin:"24px auto", display:"block" }}>
        <div className="map-banner">
          <span className="map-banner-title">{t(lang,"results.title")}</span>
          <span className="map-banner-stars">⭐ ⭐ ⭐</span>
        </div>



        <div className="map-progress-row">
          <span className="map-progress-label">{t(lang,"results.progress")}: {avgScore}%</span>
          <div className="map-progress-bar">
            <div className="map-progress-fill" style={{ width:`${avgScore}%` }} />
          </div>
        </div>

        <div className="map-content" style={{ justifyContent:"center" }}>
          <div className="radar-wrap">
            <RadarChart data={radarData} />
            <div className="radar-labels">
              {radarData.map((d,i) => (
                <span key={d.label} className="radar-label" style={{ color:COLORS[i%COLORS.length] }}>
                  ● {d.label} {d.value}%
                </span>
              ))}
            </div>
          </div>

          <div className="strengths-box" style={{ background: dark?"#1A2A3A":"#F8FBFF", border: dark?"1.5px solid #2A4070":"1.5px solid #E1F5EE" }}>
            <div>
              <p className="strengths-title" style={{ color: dark?"#9FE1CB":"#0F6E56" }}>{t(lang,"results.strengths")}</p>
              <ul className="strengths-list">
                {strengths.length > 0
                  ? strengths.map((s,i) => (
                      <li key={i} style={{ color: dark?"#E1F5EE":"#37474F" }}>
                        <span className="check" style={{ color:"#0F6E56" }}>✔</span> {s}
                      </li>
                    ))
                  : <li style={{ color: dark?"#E1F5EE":"#37474F" }}>
                      <span className="check" style={{ color:"#0F6E56" }}>✔</span> {t(lang,"results.allround")}
                    </li>
                }
              </ul>
            </div>
            <div>
              <p className="strengths-title" style={{ color: dark?"#9FE1CB":"#0F6E56" }}>{t(lang,"results.careers")}</p>
              <ul className="prof-list">
                {careers.map((c,i) => (
                  <li key={i} style={{ color: dark?"#E1F5EE":"#37474F" }}>
                    <span style={{ fontSize:"1.1rem" }}>{c.icon}</span>
                    <span style={{ fontWeight:800 }}>{c.name}</span>
                    {c.match_percent != null && (
                      <span style={{ color:"#0F6E56", fontWeight:800, marginLeft:6, background:"#E1F5EE", padding:"1px 8px", borderRadius:99, fontSize:"0.82rem" }}>
                        {Math.round(c.match_percent)}%
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <button className="hero-cta" style={{ marginTop:8, fontSize:"1rem", padding:"13px 32px" }} onClick={() => setPage("develop")}>
              {t(lang,"results.develop")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
