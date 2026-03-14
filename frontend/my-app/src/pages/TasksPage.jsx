import { useState, useEffect, useRef } from "react";
import Nav from "../components/Nav";
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
      <p style={G.question}>{p.seq.join(" → ")} → <span style={{ color: "#FF7043", fontWeight: 900 }}>?</span></p>
      <div style={G.opts}>
        {p.opts.map((opt) => (
          <button key={opt} style={{ ...G.opt, ...(selected === opt ? (opt === p.answer ? G.optRight : G.optWrong) : {}) }} onClick={() => pick(opt)}>
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
              <button key={e} style={G.emojiBtn} onClick={() => pick(e)}>{e}</button>
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
  const barC = timer > 15 ? "#66BB6A" : timer > 8 ? "#FFD740" : "#FF7043";
  const prompt = lang === "ru" ? "применений для старой газеты" : lang === "uz" ? "eski gazeta uchun foydalanishlar" : "uses for an old newspaper";

  return (
    <div style={G.wrap}>
      <div style={G.badge}>🎨 {lang === "ru" ? "Творчество" : lang === "uz" ? "Ijodkorlik" : "Creativity"}</div>
      <p style={G.question}>{lang === "ru" ? "Придумай как можно больше" : lang === "uz" ? "Imkon qadar ko'proq toping:" : "Think of as many"} <b>{prompt}</b>!</p>
      <div style={{ width:"100%", height:8, background:"#E3F2FD", borderRadius:99, overflow:"hidden" }}>
        <div style={{ height:"100%", width:`${pct}%`, background:barC, borderRadius:99, transition:"width 1s linear, background 0.5s" }} />
      </div>
      <p style={{ fontWeight:800, color:barC }}>{timer}s</p>
      <textarea style={G.textarea} placeholder={lang === "ru" ? "Каждая идея на новой строке..." : lang === "uz" ? "Har bir g'oya yangi qatorda..." : "One idea per line..."}
        value={ideas} onChange={(e) => setIdeas(e.target.value)} autoFocus />
      <p style={{ fontSize:"0.8rem", color:"#90A4AE" }}>
        {lang === "ru" ? "Идей:" : lang === "uz" ? "G'oyalar:" : "Ideas:"} <b style={{ color:"#1565C0" }}>{ideas.split("\n").filter((l)=>l.trim()).length}</b>
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
          <button key={i} style={{ ...G.opt, ...(picked===opt ? { background:"#E3F2FD", borderColor:"#1565C0", color:"#1565C0" } : {}) }}
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
  const color = score >= 80 ? "#66BB6A" : score >= 50 ? "#FFD740" : "#FF7043";
  const msg   = { ru: score>=80?"Отлично!":score>=50?"Хорошо!":"Тренируйся!", uz: score>=80?"Ajoyib!":score>=50?"Yaxshi!":"Mashq qil!", en: score>=80?"Excellent!":score>=50?"Good job!":"Keep practicing!" };
  const btnLabel = { ru:"Сохранить →", uz:"Saqlash →", en:"Save →" };
  return (
    <div style={{ ...G.wrap, textAlign:"center" }}>
      <div style={{ fontSize:"3.5rem", animation:"float 2s ease-in-out infinite" }}>{emoji}</div>
      <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2.2rem", color }}>{score}%</div>
      <div style={{ fontWeight:800, color:"#546E7A", marginBottom:16 }}>{msg[lang]||msg.ru}</div>
      <button style={G.finBtn} onClick={() => onFinish(talent, score)}>{btnLabel[lang]||btnLabel.ru}</button>
    </div>
  );
}

// ── Shared game styles ────────────────────────────────────────────────────────
const G = {
  wrap:     { display:"flex", flexDirection:"column", alignItems:"center", gap:14, padding:"8px 0", minHeight:260 },
  badge:    { background:"#E3F2FD", color:"#1565C0", fontWeight:800, fontSize:"0.85rem", padding:"4px 14px", borderRadius:99 },
  question: { fontFamily:"'Fredoka One',cursive", fontSize:"1.15rem", color:"#1565C0", textAlign:"center", lineHeight:1.4 },
  opts:     { display:"flex", flexDirection:"column", gap:10, width:"100%" },
  opt:      { padding:"12px 16px", border:"2px solid #E3F2FD", borderRadius:14, background:"#F8FBFF", fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:"0.92rem", color:"#37474F", cursor:"pointer", textAlign:"left", transition:"all 0.2s" },
  optRight: { background:"#E8F5E9", borderColor:"#66BB6A", color:"#2E7D32" },
  optWrong: { background:"#FFEBEE", borderColor:"#EF5350", color:"#C62828" },
  emojiBtn: { fontSize:"1.6rem", border:"2px solid #E3F2FD", borderRadius:12, background:"#F8FBFF", cursor:"pointer", padding:"8px", transition:"transform 0.15s" },
  textarea: { width:"100%", minHeight:120, padding:"12px 14px", border:"2px solid #E3F2FD", borderRadius:14, fontFamily:"'Nunito',sans-serif", fontSize:"0.92rem", fontWeight:600, resize:"none", outline:"none", color:"#37474F" },
  finBtn:   { padding:"13px 32px", background:"linear-gradient(135deg,#1565C0,#1976D2)", color:"#fff", border:"none", borderRadius:"50px", fontFamily:"'Fredoka One',cursive", fontSize:"1.05rem", cursor:"pointer", boxShadow:"0 6px 20px rgba(21,101,192,0.3)" },
};

// ── Nearby Establishments ─────────────────────────────────────────────────────
function EstablishmentsMap({ lang }) {
  const [status, setStatus] = useState("idle");
  const PLACES = [
    { name:"IT School Uzbekistan",    type:{ru:"Программирование", uz:"Dasturlash",    en:"Coding"},    dist:"1.2 km", emoji:"💻" },
    { name:"Robotics Hub Tashkent",   type:{ru:"Робототехника",    uz:"Robototexnika", en:"Robotics"},  dist:"2.8 km", emoji:"🤖" },
    { name:"Chess Academy",           type:{ru:"Шахматы",          uz:"Shaxmat",       en:"Chess"},     dist:"0.9 km", emoji:"🏆" },
    { name:"Music School No.5",       type:{ru:"Музыка",           uz:"Musiqa",        en:"Music"},     dist:"1.5 km", emoji:"🎵" },
    { name:"Art Studio Palitra",      type:{ru:"Рисование",        uz:"Rasm",          en:"Art"},       dist:"3.1 km", emoji:"🎨" },
    { name:"Math Olympiad Center",    type:{ru:"Математика",       uz:"Matematika",    en:"Math"},      dist:"2.2 km", emoji:"🔢" },
  ];

  const L = {
    btn:     { ru:"📍 Найти рядом", uz:"📍 Yaqinimni top", en:"📍 Find near me" },
    title:   { ru:"Курсы рядом с вами", uz:"Sizga yaqin kurslar", en:"Courses near you" },
    loading: { ru:"Определяем местоположение...", uz:"Joylashuv aniqlanmoqda...", en:"Finding your location..." },
    open:    { ru:"На карте ↗", uz:"Xaritada ↗", en:"View map ↗" },
    dist:    { ru:"от вас", uz:"uzoqlikda", en:"away" },
  };

  const find = () => {
    setStatus("loading");
    setTimeout(() => setStatus("done"), 1200); // simulate geolocation
  };

  return (
    <div style={M.wrap}>
      <div style={M.header}>
        <span style={{ fontSize:"1.4rem" }}>🗺️</span>
        <span style={M.title}>{status === "done" ? L.title[lang] : (lang==="ru"?"Найди курсы рядом":lang==="uz"?"Yaqin kurslarni top":"Find nearby courses")}</span>
      </div>

      {status === "idle" && (
        <button style={M.btn} onClick={find}>{L.btn[lang]||L.btn.ru}</button>
      )}

      {status === "loading" && (
        <div style={{ padding:"20px 0", textAlign:"center", color:"#90A4AE", fontWeight:700 }}>
          ⏳ {L.loading[lang]||L.loading.ru}
        </div>
      )}

      {status === "done" && (
        <div style={M.list}>
          {PLACES.map((p, i) => (
            <div key={i} style={{ ...M.card, animationDelay:`${i*0.07}s`, animation:"listItemIn 0.4s cubic-bezier(0.22,1,0.36,1) both" }}>
              <div style={M.left}>
                <span style={{ fontSize:"1.7rem" }}>{p.emoji}</span>
                <div>
                  <div style={M.name}>{p.name}</div>
                  <div style={M.type}>{p.type[lang]||p.type.ru}</div>
                </div>
              </div>
              <div style={M.right}>
                <span style={M.dist}>{p.dist} {L.dist[lang]||L.dist.ru}</span>
                <a href={`https://www.google.com/maps/search/${encodeURIComponent(p.name+" Tashkent")}`}
                  target="_blank" rel="noreferrer" style={M.openBtn}>
                  {L.open[lang]||L.open.ru}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const M = {
  wrap:    { background:"#F8FBFF", borderRadius:20, padding:"20px 20px", border:"1.5px solid #E3F2FD", marginTop:24 },
  header:  { display:"flex", alignItems:"center", gap:10, marginBottom:16 },
  title:   { fontFamily:"'Fredoka One',cursive", fontSize:"1.1rem", color:"#1565C0" },
  btn:     { width:"100%", padding:"13px", background:"linear-gradient(135deg,#1565C0,#1976D2)", color:"#fff", border:"none", borderRadius:14, fontFamily:"'Fredoka One',cursive", fontSize:"1rem", cursor:"pointer", boxShadow:"0 4px 16px rgba(21,101,192,0.25)" },
  list:    { display:"flex", flexDirection:"column", gap:10 },
  card:    { background:"#fff", borderRadius:14, padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", border:"1.5px solid #E3F2FD", transition:"transform 0.2s, box-shadow 0.2s" },
  left:    { display:"flex", alignItems:"center", gap:12 },
  name:    { fontWeight:800, color:"#1A237E", fontSize:"0.88rem" },
  type:    { fontSize:"0.76rem", color:"#90A4AE", fontWeight:600, marginTop:2 },
  right:   { display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4 },
  dist:    { fontSize:"0.78rem", fontWeight:800, color:"#FF7043" },
  openBtn: { fontSize:"0.74rem", fontWeight:800, color:"#1565C0", textDecoration:"none", background:"#E3F2FD", padding:"3px 10px", borderRadius:99 },
};

// ── MAIN ──────────────────────────────────────────────────────────────────────
const TASK_DEFS = [
  { id:"logic",      color:"#1565C0", emoji:"🧠", Game: LogicGame      },
  { id:"creativity", color:"#FF7043", emoji:"🎨", Game: CreativityGame  },
  { id:"memory",     color:"#EF5350", emoji:"🃏", Game: MemoryGame      },
  { id:"leadership", color:"#1976D2", emoji:"👑", Game: LeadershipGame  },
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
          await fetch("http://localhost:8000/results/tasks", {
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
      <Nav page="tasks" setPage={setPage} lang={lang} dark={dark} />
      <div className="progress-bar-wrap" style={{ marginTop:16 }}>
        <div className="progress-bar-fill" style={{ width:`${progress}%` }} />
      </div>

      <div className="task-section">
        <h2 className="task-title">{t(lang,"tasks.title")}</h2>

        {/* Active game panel */}
        {activeGame && ActiveGame && (
          <div style={{ background:"#fff", borderRadius:24, padding:"28px 24px", boxShadow:"0 8px 40px rgba(21,101,192,0.12)", border:"1.5px solid #E3F2FD", marginBottom:24, animation:"cardPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.1rem", color:"#1565C0" }}>
                {LABELS[activeGame]?.[lang]}
              </span>
              <button onClick={() => setActiveGame(null)} style={{ border:"none", background:"#FFF3E0", color:"#E64A19", borderRadius:99, padding:"4px 12px", fontWeight:800, cursor:"pointer", fontSize:"0.82rem" }}>
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
                style={{ opacity:done?0.85:1, cursor:done?"default":"pointer" }}
              >
                <div className="task-card-header" style={{ background:done?"#78909C":task.color }}>
                  <span style={{ fontSize:"1.1rem" }}>{done?"✅":"⭐"}</span>
                  {LABELS[task.id]?.[lang]?.toUpperCase()}
                </div>
                <div className="task-card-body">
                  <div className="task-card-emoji">{task.emoji}</div>
                  {done
                    ? <div style={{ fontWeight:900, color:task.color, fontSize:"1.4rem" }}>{score}%</div>
                    : <div className="task-card-desc">{DESCS[task.id]?.[lang]}</div>
                  }
                </div>
              </div>
            );
          })}
        </div>

        {/* All done */}
        {Object.keys(scores).length === 4 && (
          <div style={{ background:"linear-gradient(135deg,#E3F2FD,#FFF8E1)", borderRadius:20, padding:"24px", marginTop:24, textAlign:"center", border:"1.5px solid #BBDEFB", animation:"cardPop 0.5s both" }}>
            <div style={{ fontSize:"2.5rem", marginBottom:8 }}>🎉</div>
            <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.2rem", color:"#1565C0", marginBottom:16 }}>
              {lang==="ru"?"Все задания выполнены!":lang==="uz"?"Barcha vazifalar bajarildi!":"All tasks completed!"}
            </div>
            <button className="hero-cta" onClick={() => setPage("results")}>
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