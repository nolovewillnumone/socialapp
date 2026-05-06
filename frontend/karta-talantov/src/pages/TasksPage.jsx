import { useState, useEffect, useRef } from "react";
import Nav from "../components/Nav";

const TASK_CSS = `
  @keyframes shake    { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-8px)} 75%{transform:translateX(8px)} }
  @keyframes cardPop  { from{opacity:0;transform:scale(0.88) translateY(24px) rotateX(6deg)} to{opacity:1;transform:scale(1) translateY(0) rotateX(0)} }
  @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
  @keyframes pulse    { 0%,100%{box-shadow:0 0 0 0 rgba(15,110,86,0.4)} 70%{box-shadow:0 0 0 12px rgba(15,110,86,0)} }
  @keyframes shimmer  { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes listIn   { from{opacity:0;transform:translateX(-20px)} to{opacity:1;transform:translateX(0)} }
  @keyframes scoreIn  { from{opacity:0;transform:scale(0.5) rotate(-10deg)} to{opacity:1;transform:scale(1) rotate(0)} }
  @keyframes glow     { 0%,100%{opacity:0.6} 50%{opacity:1} }
  @keyframes slideDown{ from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin     { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

  .game-opt {
    position:relative; overflow:hidden;
    transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1) !important;
  }
  .game-opt::before {
    content:''; position:absolute; inset:0;
    background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);
    transform:translateX(-100%); transition:transform 0.4s ease;
  }
  .game-opt:hover { transform:translateX(10px) !important; border-color:#5DCAA5 !important; background:linear-gradient(135deg,#E1F5EE,#F1FFF8) !important; box-shadow:0 8px 24px rgba(15,110,86,0.16) !important; }
  .game-opt:hover::before { transform:translateX(100%); }
  .game-opt:active { transform:scale(0.97) !important; }

  .emoji-btn { transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1) !important; }
  .emoji-btn:hover { transform:scale(1.3) rotate(10deg) !important; box-shadow:0 8px 24px rgba(15,110,86,0.25) !important; border-color:#5DCAA5 !important; }
  .emoji-btn:active { transform:scale(0.9) !important; }

  .fin-btn {
    background:linear-gradient(90deg,#0F6E56,#1D9E75,#5DCAA5,#1D9E75,#0F6E56) !important;
    background-size:300% 100% !important;
    animation:shimmer 3s linear infinite !important;
    transition:all 0.25s cubic-bezier(0.34,1.56,0.64,1) !important;
  }
  .fin-btn:hover { transform:translateY(-4px) scale(1.04) !important; box-shadow:0 14px 36px rgba(15,110,86,0.5) !important; }
  .fin-btn:active { transform:scale(0.97) !important; }

  .city-chip { transition:all 0.22s cubic-bezier(0.34,1.56,0.64,1) !important; }
  .city-chip:hover { transform:translateY(-4px) scale(1.08) !important; box-shadow:0 8px 20px rgba(15,110,86,0.25) !important; background:linear-gradient(135deg,#5DCAA5,#E1F5EE) !important; color:#fff !important; }

  .search-btn { transition:all 0.22s cubic-bezier(0.34,1.56,0.64,1) !important; }
  .search-btn:hover { transform:translateY(-3px) scale(1.04) !important; box-shadow:0 10px 28px rgba(15,110,86,0.45) !important; }

  .gps-btn { transition:all 0.22s cubic-bezier(0.34,1.56,0.64,1) !important; }
  .gps-btn:hover { transform:translateY(-3px) scale(1.02) !important; box-shadow:0 12px 32px rgba(239,159,39,0.5) !important; }

  .map-card { transition:all 0.22s cubic-bezier(0.34,1.56,0.64,1) !important; }
  .map-card:hover { transform:translateX(8px) scale(1.01) !important; box-shadow:0 10px 28px rgba(15,110,86,0.14) !important; border-color:#5DCAA5 !important; }

  .map-open-btn { transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1) !important; }
  .map-open-btn:hover { background:linear-gradient(135deg,#0F6E56,#5DCAA5) !important; color:#fff !important; transform:scale(1.06) !important; box-shadow:0 4px 16px rgba(15,110,86,0.4) !important; }

  .change-btn { transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1) !important; }
  .change-btn:hover { transform:scale(1.08) translateY(-1px) !important; box-shadow:0 6px 16px rgba(239,159,39,0.3) !important; }

  .task-card-inner { transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1); }
  .task-card-inner:hover { transform:translateY(-10px) scale(1.04) !important; }

  .close-btn { transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1) !important; }
  .close-btn:hover { transform:scale(1.1) rotate(90deg) !important; background:#EF5350 !important; color:#fff !important; }
`;
import Loader from "../components/Loader";
import { t } from "../i18n";

// ── Game 1: Logic ─────────────────────────────────────────────────────────────
function LogicGame({ onFinish, lang }) {
  const PUZZLES = [
    { seq: [2, 4, 8, 16],   answer: 32, opts: [24, 32, 30, 28] },
    { seq: [3, 6, 9, 12],   answer: 15, opts: [13, 16, 15, 18] },
    { seq: [1, 4, 9, 16],   answer: 25, opts: [20, 25, 22, 30] },
  ];
  const [idx, setIdx]           = useState(0);
  const [selected, setSelected] = useState(null);
  const [correct, setCorrect]   = useState(0);
  const [done, setDone]         = useState(false);
  const p = PUZZLES[idx];

  const pick = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
    const isRight = opt === p.answer;
    if (isRight) setCorrect((c) => c + 1);
    setTimeout(() => {
      if (idx < PUZZLES.length - 1) { setIdx(idx + 1); setSelected(null); }
      else setDone(true);
    }, 900);
  };

  if (done) return <GameResult score={Math.round(((correct + (selected === p.answer ? 1 : 0)) / PUZZLES.length) * 100)} talent="logic" onFinish={onFinish} lang={lang} />;

  return (
    <div style={G.wrap}>
      <div style={G.badge}>🧠 {idx + 1}/{PUZZLES.length}</div>
      <p style={G.question}>{p.seq.join(" → ")} → <span style={{ color: "#EF9F27", fontWeight: 900 }}>?</span></p>
      <div style={G.opts}>
        {p.opts.map((opt) => (
          <button key={opt} className="game-opt" style={{ ...G.opt, ...(selected === opt ? (opt === p.answer ? G.optRight : G.optWrong) : {}) }} onClick={() => pick(opt)}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Game 2: Memory ────────────────────────────────────────────────────────────
function MemoryGame({ onFinish, lang }) {
  const SEQ = [["🐶","🌟","🍎"], ["🚀","🎵","🌈","🦁"], ["🎨","💎","🌊","🔥","🌙"]];
  const POOL = ["🐶","🌟","🍎","🚀","🎵","🌈","🦁","🎨","💎","🌊","🔥","🌙"];
  const [round, setRound]     = useState(0);
  const [phase, setPhase]     = useState("show");
  const [showIdx, setShowIdx] = useState(0);
  const [userSeq, setUserSeq] = useState([]);
  const [correct, setCorrect] = useState(0);
  const [done, setDone]       = useState(false);
  const seq = SEQ[round];

  useEffect(() => {
    if (phase !== "show") return;
    if (showIdx < seq.length) {
      const t = setTimeout(() => setShowIdx(showIdx + 1), 700);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setPhase("input"); setShowIdx(0); }, 600);
    return () => clearTimeout(t);
  }, [phase, showIdx, seq]);

  const pick = (e) => {
    const next = [...userSeq, e];
    setUserSeq(next);
    if (next.length === seq.length) {
      if (next.every((x, i) => x === seq[i])) setCorrect((c) => c + 1);
      setTimeout(() => {
        if (round < SEQ.length - 1) { setRound(round + 1); setPhase("show"); setUserSeq([]); setShowIdx(0); }
        else setDone(true);
      }, 600);
    }
  };

  if (done) return <GameResult score={Math.round((correct / SEQ.length) * 100)} talent="memory" onFinish={onFinish} lang={lang} />;

  return (
    <div style={G.wrap}>
      <div style={G.badge}>🃏 {round + 1}/{SEQ.length}</div>
      {phase === "show" ? (
        <>
          <p style={G.question}>{lang === "ru" ? "Запомни!" : lang === "uz" ? "Eslab qol!" : "Remember!"}</p>
          <div style={{ display:"flex", gap:14, justifyContent:"center", minHeight:60, alignItems:"center" }}>
            {seq.slice(0, showIdx).map((e, i) => <span key={i} style={{ fontSize:"2.2rem" }}>{e}</span>)}
          </div>
        </>
      ) : (
        <>
          <p style={G.question}>
            {lang === "ru" ? "Повтори порядок:" : lang === "uz" ? "Tartibni takrorla:" : "Repeat the order:"}
            {" "}{userSeq.map((e, i) => <span key={i}>{e}</span>)}
          </p>
          <div style={{ display:"flex", flexWrap:"wrap", gap:10, justifyContent:"center", maxWidth:300 }}>
            {POOL.slice(0, 9).map((e) => (
              <button key={e} className="emoji-btn" style={G.emojiBtn} onClick={() => pick(e)}>{e}</button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

// ── Game 3: Creativity ────────────────────────────────────────────────────────
function CreativityGame({ onFinish, lang }) {
  const [ideas, setIdeas] = useState("");
  const [timer, setTimer] = useState(30);
  const [done, setDone]   = useState(false);
  const ref = useRef();

  useEffect(() => {
    ref.current = setInterval(() => {
      setTimer((t) => { if (t <= 1) { clearInterval(ref.current); setDone(true); return 0; } return t - 1; });
    }, 1000);
    return () => clearInterval(ref.current);
  }, []);

  if (done) {
    const count = ideas.split("\n").filter((l) => l.trim()).length;
    return <GameResult score={Math.min(100, count * 14)} talent="creativity" onFinish={onFinish} lang={lang} />;
  }

  const pct = (timer / 30) * 100;
  const barC = timer > 15 ? "#66BB6A" : timer > 8 ? "#FFD740" : "#EF9F27";
  const prompt = lang === "ru" ? "применений для старой газеты" : lang === "uz" ? "eski gazeta uchun foydalanishlar" : "uses for an old newspaper";

  return (
    <div style={G.wrap}>
      <div style={G.badge}>🎨 {lang === "ru" ? "Творчество" : lang === "uz" ? "Ijodkorlik" : "Creativity"}</div>
      <p style={G.question}>{lang === "ru" ? "Придумай как можно больше" : lang === "uz" ? "Imkon qadar ko'proq toping:" : "Think of as many"} <b>{prompt}</b>!</p>
      <div style={{ width:"100%", height:8, background:"#E1F5EE", borderRadius:99, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:barC, borderRadius:99, transition:"width 1s linear, background 0.5s" }} />
      </div>
      <p style={{ fontWeight:800, color:barC }}>{timer}s</p>
      <textarea style={G.textarea} placeholder={lang === "ru" ? "Каждая идея на новой строке..." : lang === "uz" ? "Har bir g'oya yangi qatorda..." : "One idea per line..."}
        value={ideas} onChange={(e) => setIdeas(e.target.value)} autoFocus />
      <p style={{ fontSize:"0.8rem", color:"#90A4AE" }}>
        {lang === "ru" ? "Идей:" : lang === "uz" ? "G'oyalar:" : "Ideas:"} <b style={{ color:"#0F6E56" }}>{ideas.split("\n").filter((l)=>l.trim()).length}</b>
      </p>
    </div>
  );
}

// ── Game 4: Leadership ────────────────────────────────────────────────────────
function LeadershipGame({ onFinish, lang }) {
  const Q = [
    {
      ru: "Твоя команда застряла. Что делаешь?",
      uz: "Jamoang qolib ketdi. Nima qilasan?",
      en: "Your team is stuck. What do you do?",
      opts: [
        { ru:"Беру инициативу и предлагаю план", uz:"Tashabbusni olaman va reja taklif qilaman", en:"Take initiative and propose a plan", s:100 },
        { ru:"Жду пока кто-то решит",             uz:"Kimdir hal qilishini kutaman",              en:"Wait for someone else to solve it",   s:20  },
        { ru:"Делаю всё сам",                     uz:"Hamma narsani o'zim qilaman",              en:"Do everything myself",                s:50  },
        { ru:"Прошу учителя сразу",               uz:"Darhol o'qituvchidan so'rayman",           en:"Ask the teacher immediately",          s:40  },
      ],
    },
    {
      ru: "Друг расстроен. Ты...",
      uz: "Do'sting xafa. Sen...",
      en: "Your friend is upset. You...",
      opts: [
        { ru:"Спрашиваю и помогаю", uz:"So'rayman va yordam beraman", en:"Ask and help them",       s:100 },
        { ru:"Делаю вид что не замечаю", uz:"Sezmaganday qilaman",    en:"Pretend not to notice",   s:0   },
        { ru:"Говорю другим друзьям",    uz:"Boshqa do'stlarga aytaman", en:"Tell other friends",   s:30  },
        { ru:"Пытаюсь рассмешить",       uz:"Kuldirmoqchi bo'laman",  en:"Try to make them laugh",  s:70  },
      ],
    },
    {
      ru: "В споре ты обычно...",
      uz: "Munozarada odatda...",
      en: "In a disagreement you usually...",
      opts: [
        { ru:"Ищу компромисс",         uz:"Kelishuv izlayman",      en:"Look for compromise",       s:100 },
        { ru:"Настаиваю на своём",     uz:"O'z fikrimda qolaman",   en:"Insist on my view",         s:30  },
        { ru:"Избегаю споров",         uz:"Tortishmalardan qochaman", en:"Avoid arguments",          s:40  },
        { ru:"Поддерживаю большинство", uz:"Ko'pchilikni qo'llayman", en:"Support the majority",    s:60  },
      ],
    },
  ];

  const [idx, setIdx]     = useState(0);
  const [total, setTotal] = useState(0);
  const [picked, setPicked] = useState(null);
  const [done, setDone]   = useState(false);
  const q = Q[idx];

  const pick = (opt) => {
    if (picked !== null) return;
    setPicked(opt);
    setTimeout(() => {
      const nt = total + opt.s;
      if (idx < Q.length - 1) { setIdx(idx + 1); setPicked(null); setTotal(nt); }
      else { setDone(true); setTotal(Math.round(nt / Q.length)); }
    }, 800);
  };

  if (done) return <GameResult score={total} talent="leadership" onFinish={onFinish} lang={lang} />;

  return (
    <div style={G.wrap}>
      <div style={G.badge}>👑 {idx+1}/{Q.length}</div>
      <p style={G.question}>{q[lang] || q.ru}</p>
      <div style={G.opts}>
        {q.opts.map((opt, i) => (
          <button key={i} style={{ ...G.opt, ...(picked===opt ? { background:"#E1F5EE", borderColor:"#0F6E56", color:"#0F6E56" } : {}) }}
            onClick={() => pick(opt)}>
            {opt[lang] || opt.ru}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Game Result ───────────────────────────────────────────────────────────────
function GameResult({ score, talent, onFinish, lang }) {
  const emoji = score >= 80 ? "🏆" : score >= 50 ? "⭐" : "💪";
  const color = score >= 80 ? "#66BB6A" : score >= 50 ? "#FFD740" : "#EF9F27";
  const msg   = { ru: score>=80?"Отлично!":score>=50?"Хорошо!":"Тренируйся!", uz: score>=80?"Ajoyib!":score>=50?"Yaxshi!":"Mashq qil!", en: score>=80?"Excellent!":score>=50?"Good job!":"Keep practicing!" };
  const btnLabel = { ru:"Сохранить →", uz:"Saqlash →", en:"Save →" };
  return (
    <div style={{ ...G.wrap, textAlign:"center" }}>
      <div style={{ fontSize:"3.5rem", animation:"float 2s ease-in-out infinite" }}>{emoji}</div>
      <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2.2rem", color }}>{score}%</div>
      <div style={{ fontWeight:800, color:"#546E7A", marginBottom:16 }}>{msg[lang]||msg.ru}</div>
      <button className="fin-btn" style={G.finBtn} onClick={() => onFinish(talent, score)}>{btnLabel[lang]||btnLabel.ru}</button>
    </div>
  );
}

// ── Shared game styles ────────────────────────────────────────────────────────
const G = {
  wrap:     { display:"flex", flexDirection:"column", alignItems:"center", gap:14, padding:"8px 0", minHeight:260 },
  badge:    { background:"linear-gradient(135deg,#E1F5EE,#9FE1CB)", color:"#0F6E56", fontWeight:800, fontSize:"0.85rem", padding:"6px 16px", borderRadius:99, boxShadow:"0 2px 8px rgba(15,110,86,0.12)", letterSpacing:"0.04em" },
  question: { fontFamily:"'Fredoka One',cursive", fontSize:"1.2rem", color:"#0F6E56", textAlign:"center", lineHeight:1.4, padding:"0 8px" },
  opts:     { display:"flex", flexDirection:"column", gap:10, width:"100%" },
  opt:      { padding:"13px 18px", border:"2px solid #E1F5EE", borderRadius:16, background:"#F8FBFF", fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:"0.92rem", color:"#37474F", cursor:"pointer", textAlign:"left", transition:"all 0.22s cubic-bezier(0.34,1.56,0.64,1)", boxShadow:"0 2px 8px rgba(15,110,86,0.04)", position:"relative", overflow:"hidden" },
  optRight: { background:"linear-gradient(135deg,#E8F5E9,#F1F8E9)", borderColor:"#66BB6A", color:"#2E7D32", boxShadow:"0 4px 16px rgba(102,187,106,0.25)", transform:"translateX(6px)" },
  optWrong: { background:"linear-gradient(135deg,#FFEBEE,#FAEEDA)", borderColor:"#EF5350", color:"#C62828", boxShadow:"0 4px 16px rgba(239,83,80,0.2)", animation:"shake 0.4s ease" },
  emojiBtn: { fontSize:"1.8rem", border:"2px solid #E1F5EE", borderRadius:14, background:"linear-gradient(135deg,#F8FBFF,#E1F5EE)", cursor:"pointer", padding:"10px", transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)", boxShadow:"0 2px 8px rgba(15,110,86,0.06)" },
  textarea: { width:"100%", minHeight:120, padding:"14px 16px", border:"2px solid #E1F5EE", borderRadius:16, fontFamily:"'Nunito',sans-serif", fontSize:"0.92rem", fontWeight:600, resize:"none", outline:"none", color:"#37474F", boxShadow:"inset 0 2px 8px rgba(15,110,86,0.04)", transition:"border-color 0.2s" },
  finBtn:   { padding:"14px 36px", background:"linear-gradient(135deg,#0F6E56,#5DCAA5)", color:"#fff", border:"none", borderRadius:50, fontFamily:"'Fredoka One',cursive", fontSize:"1.1rem", cursor:"pointer", boxShadow:"0 8px 24px rgba(15,110,86,0.35)", transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)", letterSpacing:"0.03em" },
};

// ── Nearby Establishments ─────────────────────────────────────────────────────
// Course types to search for in any city
const COURSE_TYPES = [
  { key:"coding",    emoji:"💻", query:"coding school children",    ru:"Программирование", uz:"Dasturlash",    en:"Coding"     },
  { key:"robotics",  emoji:"🤖", query:"robotics kids club",        ru:"Робототехника",    uz:"Robototexnika", en:"Robotics"   },
  { key:"chess",     emoji:"🏆", query:"chess school",              ru:"Шахматы",          uz:"Shaxmat",       en:"Chess"      },
  { key:"music",     emoji:"🎵", query:"music school children",     ru:"Музыкальная школа",uz:"Musiqa maktabi",en:"Music"      },
  { key:"art",       emoji:"🎨", query:"art school children",       ru:"Школа рисования",  uz:"Rasm maktabi",  en:"Art school" },
  { key:"math",      emoji:"🔢", query:"math olympiad center kids", ru:"Олимпиадная математика", uz:"Matematika olimpiadasi", en:"Math olympiad"},
];

function EstablishmentsMap({ lang }) {
  const [step, setStep]     = useState("pick");   // pick | gps | done
  const [city, setCity]     = useState("");
  const [input, setInput]   = useState("");
  const [gpsErr, setGpsErr] = useState(false);

  const L = {
    title:      { ru:"Курсы рядом с тобой",       uz:"Yaqingingizdagi kurslar",     en:"Courses near you"           },
    subtitle:   { ru:"Введи свой город или используй GPS", uz:"Shahar kiriting yoki GPS ishlating", en:"Enter your city or use GPS" },
    placeholder:{ ru:"Например: Ташкент, Самарканд...", uz:"Masalan: Toshkent, Samarqand...", en:"e.g. Tashkent, Samarkand..." },
    searchBtn:  { ru:"Найти курсы",               uz:"Kurslarni topish",             en:"Find courses"               },
    gpsBtn:     { ru:"Использовать GPS",          uz:"GPS ishlatish",                en:"Use GPS"                    },
    gpsErr:     { ru:"GPS недоступен. Введи город вручную.", uz:"GPS ishlamadi. Shaharni qo'lda kiriting.", en:"GPS unavailable. Enter city manually." },
    searching:  { ru:"Ищем курсы в",             uz:"Kurslar qidirilmoqda:",         en:"Searching courses in"       },
    open:       { ru:"Открыть карту ↗",          uz:"Xaritani ochish ↗",            en:"Open map ↗"                 },
    change:     { ru:"Изменить город",            uz:"Shaharni ozgartirish",          en:"Change city"                },
    results:    { ru:"курсов найдено в",          uz:"ta kurs topildi:",              en:"courses found in"           },
  };

  const useGPS = () => {
    setStep("gps");
    setGpsErr(false);
    if (!navigator.geolocation) { setGpsErr(true); setStep("pick"); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        // Reverse geocode using nominatim (free, no key needed)
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`)
          .then((r) => r.json())
          .then((d) => {
            const detected = d.address?.city || d.address?.town || d.address?.village || d.address?.county || "Tashkent";
            setCity(detected);
            setStep("done");
          })
          .catch(() => { setCity("Tashkent"); setStep("done"); });
      },
      () => { setGpsErr(true); setStep("pick"); },
      { timeout: 6000 }
    );
  };

  const searchCity = () => {
    if (!input.trim()) return;
    setCity(input.trim());
    setStep("done");
  };

  return (
    <div style={M.wrap}>
      {/* Header */}
      <div style={M.header}>
        <span style={{ fontSize:"1.4rem" }}>🗺️</span>
        <span style={M.title}>{L.title[lang]}</span>
        {step === "done" && (
          <button onClick={() => { setStep("pick"); setInput(""); setCity(""); }} className="change-btn" style={M.changeBtn}>
            {L.change[lang]}
          </button>
        )}
      </div>

      {/* Step 1: Pick location */}
      {(step === "pick" || step === "gps") && (
        <div style={M.pickWrap}>
          <p style={M.subtitle}>{L.subtitle[lang]}</p>

          {gpsErr && (
            <div style={M.errBox}>{L.gpsErr[lang]}</div>
          )}

          {/* City input */}
          <div style={M.inputRow}>
            <input
              style={M.input}
              placeholder={L.placeholder[lang]}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && searchCity()}
            />
            <button className="search-btn" style={M.searchBtn} onClick={searchCity}>
              {L.searchBtn[lang]}
            </button>
          </div>

          {/* Quick city buttons */}
          <div style={M.quickCities}>
            {["Toshkent", "Samarqand", "Buxoro", "Namangan", "Andijon"].map((c) => (
              <button key={c} className="city-chip" style={M.cityChip}
                onClick={() => { setCity(c); setStep("done"); }}>
                {c}
              </button>
            ))}
          </div>

          <div style={M.divider}><span style={M.dividerText}>{lang==="ru"?"или":lang==="uz"?"yoki":"or"}</span></div>

          {/* GPS button */}
          <button className="gps-btn" style={M.gpsBtn} onClick={useGPS} disabled={step === "gps"}>
            {step === "gps"
              ? (lang==="ru"?"Определяем...":lang==="uz"?"Aniqlanmoqda...":"Detecting...")
              : L.gpsBtn[lang]}
          </button>
        </div>
      )}

      {/* Step 2: Show results */}
      {step === "done" && city && (
        <div>
          <p style={M.cityLabel}>
            <span style={{ color:"#EF9F27", fontWeight:900 }}>📍 {city}</span>
            {" — "}{COURSE_TYPES.length} {L.results[lang]} {city}
          </p>
          <div style={M.list}>
            {COURSE_TYPES.map((c, i) => {
              const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(c.query + " " + city)}`;
              return (
                <div key={c.key} style={{ ...M.card, animationDelay:`${i * 0.07}s`, animation:"listItemIn 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>
                  <div style={M.left}>
                    <span style={{ fontSize:"1.8rem" }}>{c.emoji}</span>
                    <div>
                      <div style={M.name}>{c[lang] || c.en}</div>
                      <div style={M.type}>{c.query} · {city}</div>
                    </div>
                  </div>
                  <a href={mapsUrl} target="_blank" rel="noreferrer" className="map-open-btn" style={M.openBtn}>
                    {L.open[lang]}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const M = {
  wrap:        { background:"linear-gradient(135deg,#F8FBFF,#F1EFE8)", borderRadius:24, padding:"24px", border:"1.5px solid #E1F5EE", marginTop:24, boxShadow:"0 4px 20px rgba(15,110,86,0.06)" },
  header:      { display:"flex", alignItems:"center", gap:10, marginBottom:18, flexWrap:"wrap" },
  title:       { fontFamily:"'Fredoka One',cursive", fontSize:"1.15rem", color:"#0F6E56", flex:1 },
  changeBtn:   { border:"none", background:"linear-gradient(135deg,#FAEEDA,#FAEEDA)", color:"#993C1D", borderRadius:99, padding:"6px 14px", fontWeight:800, cursor:"pointer", fontSize:"0.78rem", fontFamily:"'Nunito',sans-serif", boxShadow:"0 2px 8px rgba(230,74,19,0.15)", transition:"all 0.2s" },
  pickWrap:    { display:"flex", flexDirection:"column", gap:14 },
  subtitle:    { fontSize:"0.88rem", fontWeight:700, color:"#78909C", textAlign:"center" },
  errBox:      { background:"#FFEBEE", border:"1.5px solid #EF5350", borderRadius:12, padding:"10px 16px", color:"#C62828", fontSize:"0.85rem", fontWeight:700 },
  inputRow:    { display:"flex", gap:8 },
  input:       { flex:1, padding:"12px 16px", border:"2px solid #E1F5EE", borderRadius:14, fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:"0.92rem", outline:"none", color:"#04342C", transition:"border-color 0.2s, box-shadow 0.2s", boxShadow:"0 2px 8px rgba(15,110,86,0.04)" },
  searchBtn:   { padding:"12px 20px", background:"linear-gradient(135deg,#0F6E56,#5DCAA5)", color:"#fff", border:"none", borderRadius:14, fontFamily:"'Fredoka One',cursive", fontSize:"0.95rem", cursor:"pointer", whiteSpace:"nowrap", boxShadow:"0 4px 14px rgba(15,110,86,0.3)", transition:"all 0.22s cubic-bezier(0.34,1.56,0.64,1)" },
  quickCities: { display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center" },
  cityChip:    { border:"1.5px solid #9FE1CB", background:"linear-gradient(135deg,#E1F5EE,#E1F5EE)", color:"#0F6E56", borderRadius:99, padding:"7px 16px", fontWeight:800, fontSize:"0.82rem", cursor:"pointer", fontFamily:"'Nunito',sans-serif", transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)", boxShadow:"0 2px 8px rgba(15,110,86,0.08)" },
  divider:     { display:"flex", alignItems:"center", gap:8 },
  dividerText: { fontSize:"0.8rem", color:"#B0BEC5", fontWeight:700, padding:"0 8px", background:"#F8FBFF" },
  gpsBtn:      { width:"100%", padding:"14px", background:"linear-gradient(135deg,#EF9F27,#FAC775)", color:"#fff", border:"none", borderRadius:14, fontFamily:"'Fredoka One',cursive", fontSize:"1rem", cursor:"pointer", boxShadow:"0 6px 20px rgba(239,159,39,0.35)", transition:"all 0.22s cubic-bezier(0.34,1.56,0.64,1)" },
  cityLabel:   { fontSize:"0.88rem", fontWeight:700, color:"#546E7A", marginBottom:12, textAlign:"center" },
  list:        { display:"flex", flexDirection:"column", gap:10 },
  card:        { background:"#fff", borderRadius:16, padding:"14px 18px", display:"flex", justifyContent:"space-between", alignItems:"center", border:"1.5px solid #E1F5EE", transition:"all 0.22s cubic-bezier(0.34,1.56,0.64,1)", boxShadow:"0 2px 10px rgba(15,110,86,0.05)" },
  left:        { display:"flex", alignItems:"center", gap:12 },
  name:        { fontWeight:800, color:"#04342C", fontSize:"0.9rem" },
  type:        { fontSize:"0.74rem", color:"#90A4AE", fontWeight:600, marginTop:2 },
  openBtn:     { fontSize:"0.78rem", fontWeight:800, color:"#0F6E56", textDecoration:"none", background:"linear-gradient(135deg,#E1F5EE,#E1F5EE)", padding:"7px 14px", borderRadius:99, whiteSpace:"nowrap", boxShadow:"0 2px 8px rgba(15,110,86,0.12)", transition:"all 0.2s" },
};

// ── MAIN ──────────────────────────────────────────────────────────────────────
const TASK_DEFS = [
  { id:"logic",      color:"#0F6E56", emoji:"🧠", Game: LogicGame      },
  { id:"creativity", color:"#EF9F27", emoji:"🎨", Game: CreativityGame  },
  { id:"memory",     color:"#EF5350", emoji:"🃏", Game: MemoryGame      },
  { id:"leadership", color:"#1D9E75", emoji:"👑", Game: LeadershipGame  },
];
const LABELS = {
  logic:      { ru:"Логика",     uz:"Mantiq",     en:"Logic"       },
  creativity: { ru:"Творчество", uz:"Ijodkorlik", en:"Creativity"  },
  memory:     { ru:"Память",     uz:"Xotira",     en:"Memory"      },
  leadership: { ru:"Лидерство",  uz:"Liderlik",   en:"Leadership"  },
};
const DESCS = {
  logic:      { ru:"Числовые последовательности", uz:"Raqamlar ketma-ketligi",   en:"Number sequences"    },
  creativity: { ru:"Придумай применения",          uz:"Qo'llanishlarni top",      en:"Brainstorm uses"     },
  memory:     { ru:"Запомни эмодзи",              uz:"Emojilarni esla",           en:"Remember emojis"     },
  leadership: { ru:"Ситуационные выборы",          uz:"Vaziyat tanlovi",           en:"Situational choices" },
};

export default function TasksPage({ setPage, lang, dark }) {
  const [activeGame, setActiveGame] = useState(null);
  const [scores, setScores]         = useState({});
  const [saving, setSaving]         = useState(false);

  const handleFinish = async (talent, score) => {
    const newScores = { ...scores, [talent]: score };
    setScores(newScores);
    setActiveGame(null);

    if (Object.keys(newScores).length === 4) {
      setSaving(true);
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await fetch("https://karta-talantov-backend.onrender.com/results/tasks", {
            method:"POST",
            headers:{ "Content-Type":"application/json", Authorization:`Bearer ${token}` },
            body:JSON.stringify({ task_scores: newScores, lang }),
          });
        }
      } catch { /* show results locally anyway */ }
      finally { setSaving(false); }
    }
  };

  if (saving) return (
    <div className="page-wrap">
      <Nav page="tasks" setPage={setPage} lang={lang} dark={dark} />
      <Loader message={lang==="uz"?"Natijalar saqlanmoqda...":lang==="en"?"Saving results...":"Сохраняем результаты..."} />
    </div>
  );

  const progress = (Object.keys(scores).length / 4) * 100;
  const ActiveGame = activeGame ? TASK_DEFS.find((t) => t.id === activeGame)?.Game : null;

  return (
    <div className="page-wrap">
      <style>{TASK_CSS}</style>
      <Nav page="tasks" setPage={setPage} lang={lang} dark={dark} />
      <div className="progress-bar-wrap" style={{ marginTop:16 }}>
        <div className="progress-bar-fill" style={{ width:`${progress}%` }} />
      </div>

      <div className="task-section">
        <div style={{ textAlign:"center", marginBottom:24 }}>
          <div style={{ fontSize:"2.4rem", marginBottom:8, animation:"float 3s ease-in-out infinite" }}>🎮</div>
          <h2 className="task-title" style={{ marginBottom:6 }}>{t(lang,"tasks.title")}</h2>
          <p style={{ fontSize:"0.85rem", fontWeight:700, color:"#5DCAA5", margin:0 }}>
            {lang==="ru"?"Сыграй в 4 мини-игры и узнай свой уровень!":lang==="uz"?"4 ta mini-o'yin o'ynang va darajangizni biling!":"Play 4 mini-games and discover your level!"}
          </p>
        </div>

        {/* Active game panel */}
        {activeGame && ActiveGame && (
          <div style={{ background:"rgba(255,255,255,0.92)", backdropFilter:"blur(16px)", borderRadius:28, padding:"28px 24px", boxShadow:"0 24px 64px rgba(15,110,86,0.18), inset 0 1px 0 rgba(255,255,255,0.8)", border:`2px solid ${TASK_DEFS.find(t=>t.id===activeGame)?.color}33`, marginBottom:24, animation:"cardPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both", transformStyle:"preserve-3d" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:18 }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <span style={{ fontSize:"1.6rem", animation:"float 2.5s ease-in-out infinite" }}>{TASK_DEFS.find(t=>t.id===activeGame)?.emoji}</span>
                <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.15rem", color:"#0F6E56" }}>
                  {LABELS[activeGame]?.[lang]}
                </span>
              </div>
              <button className="close-btn" onClick={() => setActiveGame(null)} style={{ border:"none", background:"#FAEEDA", color:"#993C1D", borderRadius:99, padding:"6px 14px", fontWeight:800, cursor:"pointer", fontSize:"0.82rem", fontFamily:"'Nunito',sans-serif" }}>
                ✕ {lang==="ru"?"Закрыть":lang==="uz"?"Yopish":"Close"}
              </button>
            </div>
            <ActiveGame onFinish={handleFinish} lang={lang} />
          </div>
        )}

        {/* Task grid */}
        <div className="task-grid">
          {TASK_DEFS.map((task) => {
            const done  = scores[task.id] !== undefined;
            const score = scores[task.id];
            return (
              <div key={task.id} className="task-card"
                onClick={() => !done && setActiveGame(task.id)}
                style={{ opacity:done?0.92:1, cursor:done?"default":"pointer", transform:"translateY(0)", transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)", animation:`cardPop 0.5s cubic-bezier(0.34,1.56,0.64,1) ${TASK_DEFS.indexOf(task)*0.08}s both`, boxShadow: done ? `0 4px 16px ${task.color}22` : "0 4px 16px rgba(15,110,86,0.08)" }}
                onMouseEnter={e => { if(!done){ e.currentTarget.style.transform="translateY(-12px) scale(1.04)"; e.currentTarget.style.boxShadow=`0 20px 48px ${task.color}44`; } else { e.currentTarget.style.transform="translateY(-4px)"; }}}
                onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow=done?`0 4px 16px ${task.color}22`:"0 4px 16px rgba(15,110,86,0.08)"; }}
                onMouseDown={e => { e.currentTarget.style.transform="scale(0.96)"; }}
                onMouseUp={e => { e.currentTarget.style.transform=done?"translateY(-4px)":"translateY(-12px) scale(1.04)"; }}
              >
                <div className="task-card-header" style={{ background: done ? "linear-gradient(135deg,#78909C,#90A4AE)" : `linear-gradient(135deg,${task.color},${task.color}bb)`, letterSpacing:"0.06em", fontSize:"0.82rem", backgroundSize: done?"100%":"200%", animation: done?"none":"shimmer 3s linear infinite" }}>
                  <span style={{ fontSize:"1.15rem", filter: done?"none":"drop-shadow(0 0 6px rgba(255,255,255,0.5))" }}>{done?"✅":"⭐"}</span>
                  {LABELS[task.id]?.[lang]?.toUpperCase()}
                </div>
                <div className="task-card-body" style={{ background: done ? `${task.color}08` : "#fff" }}>
                  <div className="task-card-emoji" style={{ filter: done?"grayscale(0)":"none" }}>{task.emoji}</div>
                  {done
                    ? <div style={{ fontWeight:900, color:task.color, fontSize:"1.8rem", fontFamily:"'Fredoka One',cursive", animation:"scoreIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both", textShadow:`0 4px 16px ${task.color}44` }}>{score}%</div>
                    : <div className="task-card-desc" style={{ lineHeight:1.4 }}>{DESCS[task.id]?.[lang]}</div>
                  }
                  {!done && <div style={{ marginTop:10, fontSize:"0.75rem", fontWeight:800, color:"#fff", background:`linear-gradient(135deg,${task.color},${task.color}bb)`, padding:"5px 14px", borderRadius:99, display:"inline-block", boxShadow:`0 4px 12px ${task.color}44`, animation:"pulse 2s ease-in-out infinite", letterSpacing:"0.04em" }}>
                    {lang==="ru"?"▶ Играть":lang==="uz"?"▶ O'ynash":"▶ Play"}
                  </div>}
                </div>
              </div>
            );
          })}
        </div>

        {/* All done */}
        {Object.keys(scores).length === 4 && (
          <div style={{ background:"linear-gradient(135deg,#0F6E56,#1D9E75,#EF9F27)", backgroundSize:"200% 200%", animation:"shimmer 4s linear infinite, cardPop 0.6s cubic-bezier(0.34,1.56,0.64,1) both", borderRadius:24, padding:"32px 24px", marginTop:24, textAlign:"center", boxShadow:"0 16px 48px rgba(15,110,86,0.35)" }}>
            <div style={{ fontSize:"3rem", marginBottom:10, animation:"float 2s ease-in-out infinite, scoreIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}>🏆</div>
            <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.4rem", color:"#fff", marginBottom:8, textShadow:"0 2px 12px rgba(0,0,0,0.2)" }}>
              {lang==="ru"?"Все задания выполнены!":lang==="uz"?"Barcha vazifalar bajarildi!":"All tasks completed!"}
            </div>
            <div style={{ fontSize:"0.88rem", color:"rgba(255,255,255,0.8)", fontWeight:700, marginBottom:20 }}>
              {lang==="ru"?"Посмотри свою карту талантов!":lang==="uz"?"Iste'dod xaritangizni ko'ring!":"Check out your talent map!"}
            </div>
            <button onClick={() => setPage("results")} style={{ background:"rgba(255,255,255,0.95)", color:"#0F6E56", border:"none", borderRadius:50, padding:"13px 32px", fontFamily:"'Fredoka One',cursive", fontSize:"1.05rem", cursor:"pointer", boxShadow:"0 8px 24px rgba(0,0,0,0.2)", transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px) scale(1.04)"; e.currentTarget.style.boxShadow="0 14px 36px rgba(0,0,0,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.2)"; }}>
              {lang==="ru"?"Посмотреть карту талантов →":lang==="uz"?"Iste'dod xaritasini ko'rish →":"See talent map →"}
            </button>
          </div>
        )}

        {/* Nearby courses */}
        <EstablishmentsMap lang={lang} />
      </div>
    </div>
  );
}
