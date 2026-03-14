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
const COLORS = ["#42A5F5","#26C6DA","#66BB6A","#7E57C2","#FF7043","#FFD740"];

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

  const data     = results || fetched || DEMO;
  const isDemo   = !results && !fetched;
  const scores   = data.scores   || DEMO.scores;
  const careers  = data.careers  || DEMO.careers;
  const strengths = data.strengths || DEMO.strengths;

  const radarData = Object.entries(scores).map(([key, value]) => ({
    label: t(lang, `talent.${key}`),
    value: Math.round(value),
  }));

  const avgScore = Math.round(Object.values(scores).reduce((a,b)=>a+b,0) / Object.values(scores).length);

  return (
    <div className="page-wrap">
      <Nav page="results" setPage={setPage} lang={lang} dark={dark} />
      <div className="map-section">
        <div className="map-banner">
          <span className="map-banner-title">{t(lang,"results.title")}</span>
          <span className="map-banner-stars">⭐ ⭐ ⭐</span>
        </div>

        {isDemo && (
          <div style={{ background:"#FFF8E1", border:"1.5px solid #FFB300", borderRadius:10, padding:"8px 16px", margin:"0 0 12px 0", color:"#E65100", fontSize:"0.85rem", fontWeight:700, textAlign:"center" }}>
            {t(lang,"results.demo")}
          </div>
        )}

        <div className="map-progress-row">
          <span className="map-progress-label">{t(lang,"results.progress")}: {avgScore}%</span>
          <div className="map-progress-bar">
            <div className="map-progress-fill" style={{ width:`${avgScore}%` }} />
          </div>
        </div>

        <div className="map-content">
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

          <div className="strengths-box">
            <div>
              <p className="strengths-title">{t(lang,"results.strengths")}</p>
              <ul className="strengths-list">
                {strengths.length > 0
                  ? strengths.map((s,i) => <li key={i}><span className="check">✔</span> {s}</li>)
                  : <li><span className="check">✔</span> {t(lang,"results.allround")}</li>
                }
              </ul>
            </div>
            <div>
              <p className="strengths-title">{t(lang,"results.careers")}</p>
              <ul className="prof-list">
                {careers.map((c,i) => (
                  <li key={i}>
                    <span className="check">{c.icon}</span> {c.name}
                    {c.match_percent != null && <span style={{ color:"#1565C0", fontWeight:700, marginLeft:6 }}>{Math.round(c.match_percent)}%</span>}
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
