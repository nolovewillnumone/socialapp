import { useState, useEffect } from "react";
import Nav from "../components/Nav";
import RadarChart from "../components/RadarChart";
import Loader from "../components/Loader";
import { quizAPI } from "../api/client";
import { t } from "../i18n";
import { FeedbackForm } from "../components/FeedbackSection";

const DEMO_SCORES = { logic:85, creativity:60, memory:90, leadership:45, languages:70, music:50, sport:30, nature:40, social:55 };
const DEMO_CAREERS = {
  ru:[{ name:"Программист", icon:"💻", match_percent:82 },{ name:"Врач", icon:"🩺", match_percent:74 },{ name:"Учёный", icon:"🔬", match_percent:68 },{ name:"Психолог", icon:"🧠", match_percent:61 },{ name:"Учитель", icon:"📚", match_percent:58 }],
  uz:[{ name:"Dasturchi", icon:"💻", match_percent:82 },{ name:"Shifokor", icon:"🩺", match_percent:74 },{ name:"Olim", icon:"🔬", match_percent:68 },{ name:"Psixolog", icon:"🧠", match_percent:61 },{ name:"O'qituvchi", icon:"📚", match_percent:58 }],
  en:[{ name:"Programmer", icon:"💻", match_percent:82 },{ name:"Doctor", icon:"🩺", match_percent:74 },{ name:"Scientist", icon:"🔬", match_percent:68 },{ name:"Psychologist", icon:"🧠", match_percent:61 },{ name:"Teacher", icon:"📚", match_percent:58 }],
};
const DEMO_STRENGTHS = {
  ru:["Отличная память и внимание","Сильное логическое мышление","Аналитическое мышление"],
  uz:["A'lo xotira va diqqat","Kuchli mantiqiy tafakkur","Tahliliy tafakkur"],
  en:["Excellent memory and attention","Strong logical thinking","Analytical thinking"],
};
const DEMO = { scores: DEMO_SCORES, careers: [], strengths: [] };
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
  const scores    = data.scores   || DEMO_SCORES;
  const careers   = (data.careers?.length > 0 ? data.careers : DEMO_CAREERS[lang] || DEMO_CAREERS.en);
  const strengths = (data.strengths?.length > 0 ? data.strengths : DEMO_STRENGTHS[lang] || DEMO_STRENGTHS.en);

  // Ensure minimum 5% for all talents so radar chart looks good
  const adjustedScores = Object.fromEntries(
    Object.entries(scores).map(([k, v]) => [k, Math.max(5, Math.round(v))])
  );
  const TALENT_LABELS = {
    logic:      {ru:"Логика",      uz:"Mantiq",      en:"Logic"},
    creativity: {ru:"Творчество",  uz:"Ijodkorlik",  en:"Creativity"},
    memory:     {ru:"Память",      uz:"Xotira",      en:"Memory"},
    leadership: {ru:"Лидерство",   uz:"Liderlik",    en:"Leadership"},
    languages:  {ru:"Языки",       uz:"Tillar",      en:"Languages"},
    music:      {ru:"Музыка",      uz:"Musiqa",      en:"Music"},
    sport:      {ru:"Спорт",       uz:"Sport",       en:"Sport"},
    nature:     {ru:"Природа",     uz:"Tabiat",      en:"Nature"},
    social:     {ru:"Общение",     uz:"Muloqot",     en:"Social"},
  };
  const radarData = Object.entries(adjustedScores).map(([key, value]) => ({
    label: TALENT_LABELS[key]?.[lang] || TALENT_LABELS[key]?.en || key,
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
                      <li key={i} style={{ color: dark?"#E3F2FD":"#04342C", background: dark?"rgba(93,202,165,0.08)":"#fff", borderColor: dark?"#2A4070":"#E1F5EE", animation:`listItemIn 0.35s ease ${i*0.08}s both` }}>
                        <span style={{ color:"#0F6E56", fontWeight:900, fontSize:"1rem", flexShrink:0 }}>✔</span>
                        <span style={{ fontWeight:700, color: dark?"#E3F2FD":"#04342C" }}>{s}</span>
                      </li>
                    ))
                  : <li style={{ color: dark?"#E3F2FD":"#04342C", background: dark?"rgba(93,202,165,0.08)":"#fff" }}>
                      <span style={{ color:"#0F6E56", fontWeight:900, flexShrink:0 }}>✔</span>
                      <span style={{ fontWeight:700 }}>{t(lang,"results.allround")}</span>
                    </li>
                }
              </ul>
            </div>
            <div>
              <p className="strengths-title" style={{ color: dark?"#9FE1CB":"#0F6E56" }}>{t(lang,"results.careers")}</p>
              <ul className="prof-list">
                {careers.slice(0,5).map((c,i) => (
                  <li key={i} style={{ color: dark?"#E3F2FD":"#1A237E", background: dark?"rgba(93,202,165,0.08)":"#fff", borderColor: dark?"#2A4070":"#E1F5EE", animation:`listItemIn 0.35s ease ${i*0.06}s both` }}>
                    <span style={{ fontSize:"1.2rem", flexShrink:0 }}>{c.icon}</span>
                    <span style={{ fontWeight:800, flex:1, color: dark?"#E3F2FD":"#04342C" }}>{c.name}</span>
                    {c.match_percent != null && (
                      <span style={{ color:"#fff", fontWeight:900, background:"linear-gradient(135deg,#0F6E56,#1D9E75)", padding:"2px 10px", borderRadius:99, fontSize:"0.82rem", flexShrink:0, boxShadow:"0 2px 8px rgba(15,110,86,0.3)" }}>
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

            {/* Inline feedback after results */}
            <div style={{ marginTop:20, paddingTop:16, borderTop:`1px solid ${dark?"#2A4070":"#E1F5EE"}` }}>
              <p style={{ fontSize:"0.82rem", fontWeight:800, color:dark?"#9FE1CB":"#0F6E56", marginBottom:12, textAlign:"center" }}>
                {lang==="ru"?"Помогли ли результаты?":lang==="uz"?"Natijalar foydali bo'ldimi?":"Were the results helpful?"}
              </p>
              <FeedbackForm lang={lang} dark={dark} career={careers?.[0]?.name || ""} />
            </div>
          </div>
        </div>
      </div>
      </div>
    
  );
}
