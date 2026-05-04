import { useState } from "react";
import ChatBot from "./components/ChatBot";
import globalStyles from "./styles";
import AuthPage    from "./pages/AuthPage";
import HomePage    from "./pages/HomePage";
import TasksPage   from "./pages/TasksPage";
import QuizPage    from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";
import DevelopPage from "./pages/DevelopPage";

export default function App() {
  const [page, setPage]       = useState("auth");
  const [results, setResults] = useState(null);

  const [lang, setLang] = useState(() => localStorage.getItem("lang") || "ru");
  const handleSetLang = (l) => { setLang(l); localStorage.setItem("lang", l); };

  const [dark, setDark] = useState(() => localStorage.getItem("dark") === "true");
  const toggleDark = () => setDark((d) => { localStorage.setItem("dark", String(!d)); return !d; });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPage("auth");
  };

  if (page === "auth" && user) setPage("home");

  const shared = { lang, dark };

  const renderPage = () => {
    switch (page) {
      case "auth":    return <AuthPage    setPage={setPage} setUser={setUser} {...shared} />;
      case "home":    return <HomePage    setPage={setPage} user={user} onLogout={handleLogout} {...shared} />;
      case "tasks":   return <TasksPage   setPage={setPage} {...shared} />;
      case "quiz":    return <QuizPage    setPage={setPage} setResults={setResults} {...shared} />;
      case "results": return <ResultsPage setPage={setPage} results={results} {...shared} />;
      case "develop": return <DevelopPage setPage={setPage} results={results} {...shared} />;
      default:        return <AuthPage    setPage={setPage} setUser={setUser} {...shared} />;
    }
  };

  return (
    <>
      <style>{globalStyles}</style>
      {dark && <style>{darkCSS}</style>}

      {/* Language + dark mode controls — fixed top-right, always visible */}
      <div style={{ ...S.bar, ...(dark ? S.barDark : {}) }}>
        {["ru", "uz", "en"].map((l) => (
          <button key={l} onClick={() => handleSetLang(l)}
            style={{ ...S.langBtn, ...(lang === l ? S.langActive : {}), ...(dark ? S.langDark : {}) }}>
            {l.toUpperCase()}
          </button>
        ))}
        <div style={S.divider} />
        <button onClick={toggleDark} style={S.darkBtn}>{dark ? "☀️" : "🌙"}</button>
      </div>

      {renderPage()}
      {page !== "auth" && <ChatBot lang={lang} dark={dark} results={results} />}
    </>
  );
}

const darkCSS = `
  body { background: #0F1923 !important; color: #E1F5EE !important; }
  .page-wrap  { background: #0F1923 !important; }
  .hero       { background: linear-gradient(135deg,#1A2A3A,#0F1923) !important; }
  .step       { background: #1A2A3A !important; border-color: #1E3A5F !important; }
  .quiz-section  { background: #1A2A3A !important; }
  .quiz-option   { background: #1E3050 !important; color: #E1F5EE !important; border-color: #2A4070 !important; }
  .quiz-option.selected { background: #0F6E56 !important; color: #fff !important; }
  .map-section   { background: #1A2A3A !important; }
  .strengths-box { background: #1E3050 !important; }
  .develop-card  { background: #1E3050 !important; border-color: #2A4070 !important; }
  .develop-section { background: #1A2A3A !important; }
  .task-card     { background: #1E3050 !important; }
  .task-card-body { background: #1A2A3A !important; }
  .map-box    { background: #1E3050 !important; border-color: #2A4070 !important; }
  .robot-box  { background: #1E3050 !important; border-color: #2A4070 !important; }
  .hero-title { color: #E1F5EE !important; }
  .step-title { color: #9FE1CB !important; }
  .step-desc  { color: #B0BEC5 !important; }
  .quiz-q     { color: #E1F5EE !important; }
  .quiz-counter { color: #9FE1CB !important; }
  .task-title { color: #E1F5EE !important; }
  .develop-card-title { color: #9FE1CB !important; }
  .map-box-title { color: #9FE1CB !important; }
  .map-pin-row   { color: #B0BEC5 !important; }
  .strengths-title { color: #9FE1CB !important; }
  .map-progress-label { color: #9FE1CB !important; }
  .radar-label { color: #E1F5EE !important; }
  li { color: #E1F5EE !important; }
`;

const S = {
  // Fully transparent frosted glass pill
  bar: {
    position:"fixed", bottom:18, left:"50%", transform:"translateX(-50%)", zIndex:9999,
    display:"flex", gap:4, alignItems:"center",
    background:"rgba(255,255,255,0.15)",
    backdropFilter:"blur(16px)",
    WebkitBackdropFilter:"blur(16px)",
    borderRadius:999,
    padding:"5px 8px",
    border:"1px solid rgba(255,255,255,0.35)",
    boxShadow:"0 4px 20px rgba(0,0,0,0.08)",
  },
  barDark: {
    background:"rgba(15,25,35,0.30)",
    border:"1px solid rgba(255,255,255,0.10)",
    boxShadow:"0 4px 20px rgba(0,0,0,0.30)",
  },
  langBtn: {
    border:"none",
    background:"transparent",
    fontFamily:"'Nunito',sans-serif",
    fontWeight:800, fontSize:"0.72rem",
    color:"rgba(80,80,120,0.75)",
    cursor:"pointer", borderRadius:999,
    padding:"4px 9px",
    transition:"all 0.18s",
    letterSpacing:"0.04em",
  },
  langActive: {
    background:"rgba(15,110,86,0.85)",
    color:"#fff",
    boxShadow:"0 2px 8px rgba(15,110,86,0.35)",
    backdropFilter:"blur(4px)",
  },
  langDark: { color:"rgba(200,220,255,0.70)" },
  // Divider between lang buttons and dark toggle
  divider: {
    width:1, height:18,
    background:"rgba(150,150,200,0.25)",
    margin:"0 2px",
  },
  darkBtn: {
    border:"1px solid rgba(150,150,200,0.25)",
    background:"rgba(255,255,255,0.18)",
    backdropFilter:"blur(4px)",
    fontSize:"0.95rem",
    cursor:"pointer", borderRadius:999,
    padding:"4px 8px",
    transition:"all 0.18s",
    lineHeight:1,
  },
};
