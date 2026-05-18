import { useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
import { animateCounter } from "../animations";
import { FeedbackSection } from "../components/FeedbackSection";
import { t } from "../i18n";

// ── Infinite slider ───────────────────────────────────────────────────────────
const SLIDER_ITEMS = [
  { emoji: "💻", name: "Coursera"     },
  { emoji: "🤖", name: "Robotics Hub" },
  { emoji: "🎓", name: "Khan Academy" },
  { emoji: "🏆", name: "Chess.com"    },
  { emoji: "🎨", name: "Skillshare"   },
  { emoji: "🔬", name: "NASA Kids"    },
  { emoji: "🎵", name: "Simply Piano" },
  { emoji: "📐", name: "Brilliant"    },
  { emoji: "🌍", name: "Duolingo"     },
  { emoji: "🚀", name: "SpaceX Edu"   },
  { emoji: "🐍", name: "Python.org"   },
  { emoji: "🎮", name: "Scratch"      },
];
const TRACK = [...SLIDER_ITEMS, ...SLIDER_ITEMS];

// ── Benefits ──────────────────────────────────────────────────────────────────
const BENEFITS = [
  {
    emoji: "🧠", accent: "#0F6E56",
    bg: "linear-gradient(135deg,#E1F5EE,#F0FFF8)",
    title: { ru:"Раскрой свой потенциал", uz:"Potentsialingizni oching", en:"Unlock your potential" },
    desc:  { ru:"Наш ML-движок анализирует 30 ответов по 9 измерениям таланта и строит твою персональную карту способностей.", uz:"ML mexanizmi 30 ta javobni 9 iste'dod o'lchovi bo'yicha tahlil qiladi.", en:"Our ML engine analyses 30 answers across 9 talent dimensions and builds your personal ability map." },
    stats: [
      { value:"9",    label:{ ru:"талантов",    uz:"iste'dod",    en:"talents"    } },
      { value:"30",   label:{ ru:"вопросов",    uz:"savollar",    en:"questions"  } },
      { value:"35+",  label:{ ru:"профессий",   uz:"kasblar",     en:"careers"    } },
    ],
    visual:"radar",
  },
  {
    emoji: "🎮", accent: "#EF9F27",
    bg: "linear-gradient(135deg,#FAEEDA,#FFF8EE)",
    title: { ru:"Учись играя",   uz:"O'ynab o'rgan",   en:"Learn by playing"  },
    desc:  { ru:"4 мини-игры на логику, память, творчество и лидерство. Каждый результат улучшает твою карту талантов.", uz:"4 mini-o'yin: mantiq, xotira, ijodkorlik va liderlik.", en:"4 mini-games covering logic, memory, creativity and leadership. Every result improves your talent map." },
    stats: [
      { value:"4",    label:{ ru:"мини-игры",   uz:"mini-o'yin",  en:"mini-games" } },
      { value:"7min", label:{ ru:"на всё",      uz:"hammasi",     en:"total"      } },
      { value:"100%", label:{ ru:"бесплатно",   uz:"bepul",       en:"free"       } },
    ],
    visual:"games",
  },
  {
    emoji: "🗺️", accent: "#1D9E75",
    bg: "linear-gradient(135deg,#E1F5EE,#E8F5E9)",
    title: { ru:"Найди курсы рядом",   uz:"Yaqin kurslarni top",   en:"Find courses near you"  },
    desc:  { ru:"Введи свой город или используй GPS — найдём кружки и школы рядом с тобой.", uz:"GPS yoki shahar nomi bilan yaqin to'garaklar va maktablar.", en:"Enter your city or use GPS to find real clubs and schools near you." },
    stats: [
      { value:"6",    label:{ ru:"типов",       uz:"tur",         en:"types"      } },
      { value:"GPS",  label:{ ru:"поиск",       uz:"qidirish",    en:"search"     } },
      { value:"Free", label:{ ru:"бесплатно",   uz:"bepul",       en:"free"       } },
    ],
    visual:"map",
  },
  {
    emoji: "🌍", accent: "#7E57C2",
    bg: "linear-gradient(135deg,#EDE7F6,#F3E5F5)",
    title: { ru:"Три языка — один результат", uz:"Uch til — bir natija", en:"Three languages — one result" },
    desc:  { ru:"Весь интерфейс, вопросы и результаты на русском, узбекском и английском. Один тап — смена языка.", uz:"Barcha interfeys, savollar va natijalar uch tilda. Bir bosish bilan til almashtirish.", en:"Full interface, questions and results in Russian, Uzbek and English. One tap to switch." },
    stats: [
      { value:"3",    label:{ ru:"языка",       uz:"til",         en:"languages"  } },
      { value:"1tap", label:{ ru:"смена",       uz:"almashtirish",en:"to switch"  } },
      { value:"100%", label:{ ru:"переведено",  uz:"tarjima",     en:"translated" } },
    ],
    visual:"lang",
  },
];

// ── IntersectionObserver hook ─────────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}

// ── Premium Visual accents ───────────────────────────────────────────────────
function Visual({ type, accent, dark }) {
  const box = {
    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
    background: dark ? "rgba(255,255,255,0.04)" : "#fff",
    borderRadius:24, border:`1.5px solid ${accent}22`,
    padding:24, width:"100%", maxWidth:340, margin:"0 auto",
    boxShadow:`0 8px 32px ${accent}15, 0 2px 8px rgba(0,0,0,0.06)`,
    backdropFilter:"blur(8px)",
  };

  if (type === "radar") {
    const n = 9;
    const R = 90, cx = 110, cy = 110;
    const vals = [0.88,0.72,0.80,0.65,0.90,0.55,0.60,0.75,0.82];
    const emojis = ["🧠","🎨","🃏","👑","🌍","🎵","🏃","🌿","🤝"];
    const dotColors = ["#0F6E56","#EF9F27","#7E57C2","#F9A825","#00838F","#2E7D32","#BF360C","#1B5E20","#4527A0"];
    const pt = (i,r) => {
      const a = i*2*Math.PI/n - Math.PI/2;
      return [cx+r*Math.cos(a), cy+r*Math.sin(a)];
    };
    const rings = [0.25,0.5,0.75,1.0];
    const dataPts = vals.map((v,i) => pt(i,R*v));
    return (
      <div style={{ ...box, padding:16 }}>
        <svg width="220" height="220" viewBox="0 0 220 220">
          <defs>
            <radialGradient id="rgFill" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={accent} stopOpacity="0.3"/>
              <stop offset="100%" stopColor={accent} stopOpacity="0.05"/>
            </radialGradient>
          </defs>
          {/* Grid rings */}
          {rings.map(r => (
            <polygon key={r}
              points={Array.from({length:n},(_,i)=>pt(i,R*r).join(",")).join(" ")}
              fill="none" stroke={accent} strokeWidth={r===1?"1.5":"1"} strokeOpacity={r===1?0.3:0.12}
              strokeDasharray={r===1?"none":"4 4"}/>
          ))}
          {/* Axis lines */}
          {Array.from({length:n},(_,i) => {
            const [x,y] = pt(i,R);
            return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke={accent} strokeWidth="1" strokeOpacity="0.15"/>;
          })}
          {/* Data polygon */}
          <polygon points={dataPts.map(p=>p.join(",")).join(" ")} fill="url(#rgFill)" stroke={accent} strokeWidth="2"/>
          {/* Glow dots */}
          {dataPts.map((p,i) => (
            <g key={i}>
              <circle cx={p[0]} cy={p[1]} r="8" fill={dotColors[i]} fillOpacity="0.25"/>
              <circle cx={p[0]} cy={p[1]} r="4" fill={dotColors[i]}/>
              <circle cx={p[0]} cy={p[1]} r="2" fill="#fff"/>
            </g>
          ))}
          {/* Emoji labels */}
          {emojis.map((em,i) => {
            const [x,y] = pt(i, R+20);
            return <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize="13">{em}</text>;
          })}
          {/* Center dot */}
          <circle cx={cx} cy={cy} r="4" fill={accent} fillOpacity="0.5"/>
        </svg>
      </div>
    );
  }

  if (type === "games") return (
    <div style={{ ...box, padding:20 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, width:"100%" }}>
        {[
          {e:"🧠",label:"Logic",   c:"#0F6E56"},
          {e:"🃏",label:"Memory",  c:"#7E57C2"},
          {e:"🎨",label:"Creative",c:"#EF9F27"},
          {e:"👑",label:"Leader",  c:"#F9A825"},
        ].map(({e,label,c},i) => (
          <div key={i} style={{ height:86, borderRadius:18, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:6, background:`linear-gradient(135deg,${c}18,${c}08)`, border:`1.5px solid ${c}33`, boxShadow:`0 4px 12px ${c}15`, transition:"all 0.2s", cursor:"default" }}>
            <span style={{ fontSize:"2rem" }}>{e}</span>
            <span style={{ fontSize:"0.72rem", fontWeight:800, color:c, letterSpacing:"0.05em" }}>{label.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (type === "map") return (
    <div style={{ ...box, gap:10, padding:20, alignItems:"stretch" }}>
      {[
        {em:"💻",name:"IT School",    dist:"0.9 km", c:"#0F6E56"},
        {em:"🤖",name:"Robotics Hub", dist:"1.2 km", c:"#EF9F27"},
        {em:"🏆",name:"Chess Academy",dist:"2.8 km", c:"#7E57C2"},
      ].map(({em,name,dist,c},i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderRadius:16, background:`linear-gradient(135deg,${c}10,${c}05)`, border:`1.5px solid ${c}33`, boxShadow:`0 2px 8px ${c}10` }}>
          <div style={{ width:38, height:38, borderRadius:12, background:`${c}18`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.3rem", flexShrink:0 }}>{em}</div>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:"0.88rem", fontWeight:900, color: dark?"#E1F5EE":"#04342C" }}>{name}</div>
            <div style={{ fontSize:"0.72rem", fontWeight:700, color:"#90A4AE" }}>Nearby course</div>
          </div>
          <div style={{ background:c, color:"#fff", borderRadius:99, padding:"3px 10px", fontSize:"0.72rem", fontWeight:900, flexShrink:0 }}>{dist}</div>
        </div>
      ))}
    </div>
  );

  if (type === "lang") return (
    <div style={{ ...box, gap:10, padding:20, alignItems:"stretch" }}>
      {[
        {f:"🇷🇺",n:"Карта Талантов",   l:"Русский", active:true,  c:"#0F6E56"},
        {f:"🇺🇿",n:"Iste'dod Xaritasi",l:"O'zbek",  active:false, c:"#1D9E75"},
        {f:"🇬🇧",n:"Talent Map",        l:"English", active:false, c:"#5DCAA5"},
      ].map(({f,n,l,active,c},i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"12px 16px", borderRadius:16, background:active?`linear-gradient(135deg,${c}20,${c}08)`:"transparent", border:`1.5px solid ${active?c:c+"33"}`, boxShadow:active?`0 4px 16px ${c}20`:"none", transition:"all 0.2s" }}>
          <span style={{ fontSize:"1.5rem" }}>{f}</span>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:"0.88rem", fontWeight:900, color:dark?"#E1F5EE":"#04342C" }}>{n}</div>
          </div>
          <div style={{ background:active?c:`${c}22`, color:active?"#fff":c, borderRadius:99, padding:"3px 10px", fontSize:"0.72rem", fontWeight:900 }}>{l}</div>
        </div>
      ))}
    </div>
  );
  return null;
}

function BenefitSection({ benefit, index, lang, dark }) {
  const [ref, visible] = useInView(0.15);
  return (
    <div ref={ref} style={{ padding:"64px 24px", borderBottom:"1px solid rgba(15,110,86,0.06)", background: dark ? "transparent" : benefit.bg, opacity: visible?1:0, transform: visible?"translateY(0)":"translateY(48px)", transition:"opacity 0.7s ease, transform 0.7s ease", transitionDelay:`${index*0.05}s` }}>
      <div className="benefit-inner" style={{ maxWidth:900, margin:"0 auto", display:"flex", alignItems:"center", gap:48, flexWrap:"wrap", flexDirection:"column" }}>
        <div className="benefit-text" style={{ width:"100%" }}>
          <div style={{ fontSize:"1.6rem", marginBottom:10 }}>{benefit.emoji}</div>
          <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2rem", lineHeight:1.2, marginBottom:12, color: dark?"#E1F5EE":"#04342C" }}>{benefit.title[lang]||benefit.title.en}</h2>
          <p style={{ fontSize:"0.98rem", fontWeight:600, lineHeight:1.7, marginBottom:20, color: dark?"#B0BEC5":"#546E7A" }}>{benefit.desc[lang]||benefit.desc.en}</p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {benefit.stats.map((stat,i) => (
              <div key={i} style={{ borderRadius:14, padding:"12px 18px", display:"flex", flexDirection:"column", gap:4, background: dark?"#1A2A3A":"#fff", border:`1.5px solid ${benefit.accent}33`, boxShadow:"0 2px 8px rgba(0,0,0,0.05)", opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(20px)", transition:`opacity 0.5s ease ${0.3+i*0.1}s, transform 0.5s ease ${0.3+i*0.1}s`, flex:1, minWidth:80 }}>
                <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.6rem", color:benefit.accent }}>{stat.value}</span>
                <span style={{ fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", color: dark?"#9FE1CB":"#78909C" }}>{stat.label[lang]||stat.label.en}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="benefit-visual" style={{ opacity:visible?1:0, transform:visible?"scale(1)":"scale(0.88)", transition:"opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s", width:"100%", display:"flex", justifyContent:"center", padding:"0 16px" }}>
          <Visual type={benefit.visual} accent={benefit.accent} />
        </div>
      </div>
    </div>
  );
}

// ── Auto chat messages (left panel - unchanged) ──────────────────────────────
const CHAT_MESSAGES = [
  { role:"ai",   delay:0,    text:{ ru:"Привет! Я анализирую твои ответы...", uz:"Salom! Men javoblaringizni tahlil qilaman...", en:"Hi! I'm analysing your answers..." } },
  { role:"user", delay:1200, text:{ ru:"Какой у меня главный талант?", uz:"Mening asosiy iste'dodim nima?", en:"What is my main talent?" } },
  { role:"ai",   delay:2600, text:{ ru:"Твой топ-талант — Логика (92%). Ты отлично решаешь задачи и думаешь системно.", uz:"Sizning asosiy iste'dodingiz — Mantiq (92%). Muammolarni yaxshi hal qilasiz.", en:"Your top talent is Logic (92%). You solve problems and think systematically." } },
  { role:"user", delay:4200, text:{ ru:"Какую карьеру выбрать?", uz:"Qanday kasb tanlash kerak?", en:"What career should I choose?" } },
  { role:"ai",   delay:5500, text:{ ru:"Рекомендую: Программист (89%), Инженер (81%), Учёный (76%) 🚀", uz:"Tavsiya: Dasturchi (89%), Muhandis (81%), Olim (76%) 🚀", en:"Recommended: Programmer (89%), Engineer (81%), Scientist (76%) 🚀" } },
];

// ── Two files for the code editor tabs ───────────────────────────────────────
const CODE_FILES = {
  "talent_analyzer.py": [
    { indent:0, tokens:[{ t:"keyword", v:"def " },{ t:"fn", v:"analyze_talent" },{ t:"plain", v:"(answers):" }] },
    { indent:1, tokens:[{ t:"comment", v:"# ML scoring engine" }] },
    { indent:1, tokens:[{ t:"plain", v:"scores = " },{ t:"fn", v:"compute_scores" },{ t:"plain", v:"(answers)" }] },
    { indent:1, tokens:[{ t:"keyword", v:"top " },{ t:"plain", v:"= " },{ t:"fn", v:"max" },{ t:"plain", v:"(scores, key=scores.get)" }] },
    { indent:1, tokens:[{ t:"keyword", v:"return " },{ t:"plain", v:"{" }] },
    { indent:2, tokens:[{ t:"str", v:'"top_talent"' },{ t:"plain", v:": top," }] },
    { indent:2, tokens:[{ t:"str", v:'"score"' },{ t:"plain", v:": scores[top]," }] },
    { indent:2, tokens:[{ t:"str", v:'"careers"' },{ t:"plain", v:": " },{ t:"fn", v:"match_careers" },{ t:"plain", v:"(scores)" }] },
    { indent:1, tokens:[{ t:"plain", v:"}" }] },
    { indent:0, tokens:[] },
    { indent:0, tokens:[{ t:"comment", v:"# Run analysis" }] },
    { indent:0, tokens:[{ t:"plain", v:"result = " },{ t:"fn", v:"analyze_talent" },{ t:"plain", v:"(user_answers)" }] },
    { indent:0, tokens:[{ t:"fn", v:"print" },{ t:"plain", v:'(result[' },{ t:"str", v:'"top_talent"' },{ t:"plain", v:"])" }] },
  ],
  "ml_service.py": [
    { indent:0, tokens:[{ t:"keyword", v:"from " },{ t:"plain", v:"fastapi " },{ t:"keyword", v:"import " },{ t:"fn", v:"FastAPI" }] },
    { indent:0, tokens:[{ t:"keyword", v:"import " },{ t:"plain", v:"numpy " },{ t:"keyword", v:"as " },{ t:"plain", v:"np" }] },
    { indent:0, tokens:[] },
    { indent:0, tokens:[{ t:"plain", v:"app = " },{ t:"fn", v:"FastAPI" },{ t:"plain", v:"(title=" },{ t:"str", v:'"Talent ML"' },{ t:"plain", v:")" }] },
    { indent:0, tokens:[] },
    { indent:0, tokens:[{ t:"plain", v:"TALENTS = [" },{ t:"str", v:'"logic"' },{ t:"plain", v:", " },{ t:"str", v:'"creativity"' },{ t:"plain", v:", " },{ t:"str", v:'"music"' },{ t:"plain", v:",...]" }] },
    { indent:0, tokens:[] },
    { indent:0, tokens:[{ t:"comment", v:"# Career matching with dot product" }] },
    { indent:0, tokens:[{ t:"keyword", v:"def " },{ t:"fn", v:"match_careers" },{ t:"plain", v:"(scores: dict):" }] },
    { indent:1, tokens:[{ t:"plain", v:"vec = np." },{ t:"fn", v:"array" },{ t:"plain", v:"(list(scores.values()))" }] },
    { indent:1, tokens:[{ t:"plain", v:"ranked = []" }] },
    { indent:1, tokens:[{ t:"keyword", v:"for " },{ t:"plain", v:"career " },{ t:"keyword", v:"in " },{ t:"plain", v:"CAREER_MAP:" }] },
    { indent:2, tokens:[{ t:"plain", v:"w = np." },{ t:"fn", v:"array" },{ t:"plain", v:"(career[" },{ t:"str", v:'"weights"' },{ t:"plain", v:"].values())" }] },
    { indent:2, tokens:[{ t:"plain", v:"ranked." },{ t:"fn", v:"append" },{ t:"plain", v:"(np." },{ t:"fn", v:"dot" },{ t:"plain", v:"(vec, w))" }] },
    { indent:1, tokens:[{ t:"keyword", v:"return " },{ t:"fn", v:"sorted" },{ t:"plain", v:"(ranked, reverse=" },{ t:"keyword", v:"True" },{ t:"plain", v:")" }] },
  ],
};


const TOKEN_COLORS = { keyword:"#EF9F27", fn:"#5DCAA5", str:"#66BB6A", comment:"#78909C", plain:"#E1F5EE" };

// ── Interactive code editor (right panel) ─────────────────────────────────────
function InteractiveCodeEditor({ visible, lang }) {
  const FILES = Object.keys(CODE_FILES);
  const [activeFile, setActiveFile] = useState(FILES[0]);
  const [userLines, setUserLines] = useState({ "talent_analyzer.py":[], "ml_service.py":[] });
  const [input, setInput] = useState("");
  const [shownLines, setShownLines] = useState(0);
  const [started, setStarted] = useState(false);
  const editorRef = useRef(null);

  // Auto-type existing code when visible
  useEffect(() => {
    if (!visible || started) return;
    setStarted(true);
    let line = 0;
    const iv = setInterval(() => {
      line++;
      setShownLines(line);
      if (line >= CODE_FILES[FILES[0]].length) clearInterval(iv);
    }, 110);
    return () => clearInterval(iv);
  }, [visible, started]);

  // Reset shown lines when switching tabs
  const switchFile = (f) => {
    setActiveFile(f);
    setShownLines(CODE_FILES[f].length); // show all instantly on switch
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!input.trim()) return;
      setUserLines(prev => ({
        ...prev,
        [activeFile]: [...(prev[activeFile]||[]), input],
      }));
      setInput("");
      setTimeout(() => {
        if (editorRef.current) editorRef.current.scrollTop = editorRef.current.scrollHeight;
      }, 50);
    }
  };

  const codeLines = CODE_FILES[activeFile] || [];
  const myLines   = userLines[activeFile] || [];
  const startNum  = 77;
  const linesToShow = activeFile === FILES[0] ? Math.min(shownLines, codeLines.length) : codeLines.length;

  return (
    <div style={{ flex:1, background:"#0D1117", display:"flex", flexDirection:"column", overflow:"hidden", fontFamily:"'Courier New',monospace", fontSize:"0.78rem" }}>

      {/* Tab bar */}
      <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.06)", background:"#161B22" }}>
        {FILES.map((f) => (
          <button key={f} onClick={() => switchFile(f)}
            style={{
              padding:"8px 16px", border:"none", cursor:"pointer",
              fontFamily:"'Courier New',monospace", fontSize:"0.73rem", fontWeight:700,
              background: f===activeFile ? "#0D1117" : "transparent",
              color: f===activeFile ? "#E1F5EE" : "#78909C",
              borderTop: f===activeFile ? "1px solid #5DCAA5" : "1px solid transparent",
              borderRight:"1px solid rgba(255,255,255,0.06)",
              display:"flex", alignItems:"center", gap:6,
              transition:"all 0.2s",
            }}>
            <span style={{ color: f===activeFile ? "#5DCAA5":"#78909C" }}>■</span> {f}
            {f===activeFile && <span style={{ color:"#78909C", fontSize:"0.65rem" }}>●</span>}
          </button>
        ))}
      </div>

      {/* Code area */}
      <div ref={editorRef} style={{ flex:1, overflowY:"auto", padding:"8px 0" }}>
        {/* Pre-existing code */}
        {codeLines.slice(0, linesToShow).map((line, i) => (
          <div key={`pre-${i}`} style={{ display:"flex", padding:"1px 16px", lineHeight:1.7, animation:"fadeIn 0.12s ease both" }}>
            <span style={{ color:"#30363D", fontWeight:700, fontSize:"0.7rem", minWidth:28, userSelect:"none", textAlign:"right", paddingRight:12 }}>{i+startNum}</span>
            <span style={{ paddingLeft: line.indent*16 }}>
              {line.tokens.map((tok,j) => (
                <span key={j} style={{ color:TOKEN_COLORS[tok.t]||"#E1F5EE" }}>{tok.v}</span>
              ))}
            </span>
          </div>
        ))}

        {/* Typing cursor if still animating */}
        {activeFile===FILES[0] && linesToShow < codeLines.length && started && (
          <div style={{ display:"flex", padding:"1px 16px", lineHeight:1.7 }}>
            <span style={{ color:"#30363D", minWidth:28, paddingRight:12, textAlign:"right", fontSize:"0.7rem" }}>{linesToShow+startNum}</span>
            <span style={{ display:"inline-block", width:8, height:14, background:"#5DCAA5", verticalAlign:"middle", animation:"pulse 0.8s ease-in-out infinite" }} />
          </div>
        )}

        {/* User-typed lines */}
        {myLines.map((line, i) => (
          <div key={`user-${i}`} style={{ display:"flex", padding:"1px 16px", lineHeight:1.7, animation:"fadeIn 0.15s ease both" }}>
            <span style={{ color:"#30363D", fontWeight:700, fontSize:"0.7rem", minWidth:28, userSelect:"none", textAlign:"right", paddingRight:12 }}>{codeLines.length+startNum+i}</span>
            <span style={{ color:"#E1F5EE" }}>{line}</span>
          </div>
        ))}

        {/* Active input line */}
        <div style={{ display:"flex", padding:"1px 16px", lineHeight:1.7, alignItems:"center" }}>
          <span style={{ color:"#30363D", fontWeight:700, fontSize:"0.7rem", minWidth:28, textAlign:"right", paddingRight:12, userSelect:"none" }}>
            {codeLines.length+startNum+myLines.length}
          </span>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={lang==="ru"?"# напиши код здесь...":lang==="uz"?"# bu yerga kod yozing...":"# type your code here..."}
            style={{ flex:1, background:"transparent", border:"none", outline:"none", color:"#E1F5EE", fontFamily:"'Courier New',monospace", fontSize:"0.78rem", caretColor:"#5DCAA5", padding:0 }}
          />
          <span style={{ width:7, height:13, background:"#5DCAA5", display:"inline-block", animation:"pulse 1s ease-in-out infinite", borderRadius:1, flexShrink:0 }} />
        </div>
      </div>

      {/* Status bar */}
      <div style={{ borderTop:"1px solid rgba(255,255,255,0.06)", padding:"3px 16px", background:"#0F6E56", display:"flex", gap:16, alignItems:"center" }}>
        <span style={{ fontSize:"0.68rem", fontWeight:700, color:"rgba(255,255,255,0.85)" }}>Python</span>
        <span style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.6)" }}>Ln {codeLines.length+myLines.length+startNum}</span>
        <span style={{ fontSize:"0.68rem", color:"rgba(255,255,255,0.6)" }}>UTF-8</span>
        <span style={{ marginLeft:"auto", fontSize:"0.68rem", color:"rgba(255,255,255,0.7)", fontWeight:700 }}>Karta Talantov ML</span>
      </div>
    </div>
  );
}

function AIDemoSection({ lang, dark }) {
  const [ref, visible] = useInView(0.1);
  const [shownMsgs, setShownMsgs] = useState([]);
  const [started, setStarted] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (!visible || started) return;
    setStarted(true);
    CHAT_MESSAGES.forEach((msg) => {
      setTimeout(() => {
        setShownMsgs((prev) => [...prev, msg]);
        setTimeout(() => {
          if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }, 50);
      }, msg.delay);
    });
  }, [visible, started]);

  const label = {
    ru: { title: "Умный AI-анализ в реальном времени", sub: "Наш ML видит закономерности, которые не видишь ты — попробуй написать код справа!" },
    uz: { title: "Real vaqtda aqlli AI tahlili",        sub: "ML siz ko'ra olmaydigan naqshlarni ko'radi — o'ng tomonda kod yozing!" },
    en: { title: "Smart AI analysis in real time",      sub: "Our ML sees patterns you might not notice — try writing code on the right!" },
  }[lang] || {};

  return (
    <div ref={ref} style={{ padding:"72px 24px", background: dark ? "#0F1923" : "#0D1117", overflow:"hidden" }}>
      <div style={{ textAlign:"center", marginBottom:48, opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(30px)", transition:"opacity 0.6s ease, transform 0.6s ease" }}>
        <div style={{ display:"inline-block", background:"rgba(93,202,165,0.15)", border:"1px solid rgba(93,202,165,0.3)", borderRadius:99, padding:"4px 16px", fontSize:"0.78rem", fontWeight:800, color:"#5DCAA5", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16 }}>
          AI-POWERED
        </div>
        <h2 className="ai-demo-title" style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2.2rem", color:"#E1F5EE", marginBottom:12 }}>{label.title}</h2>
        <p style={{ color:"#78909C", fontWeight:600, fontSize:"0.95rem" }}>{label.sub}</p>
      </div>

      {/* VS Code window */}
      <div className="ai-demo-window" style={{ maxWidth:900, margin:"0 auto", borderRadius:16, overflow:"hidden", boxShadow:"0 24px 80px rgba(0,0,0,0.5)", border:"1px solid rgba(255,255,255,0.08)", opacity:visible?1:0, transform:visible?"translateY(0) scale(1)":"translateY(40px) scale(0.97)", transition:"opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s" }}>

        {/* Window chrome */}
        <div style={{ background:"#161B22", padding:"12px 16px", display:"flex", alignItems:"center", gap:8, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width:12, height:12, borderRadius:"50%", background:"#FF5F57" }} />
          <div style={{ width:12, height:12, borderRadius:"50%", background:"#FFBD2E" }} />
          <div style={{ width:12, height:12, borderRadius:"50%", background:"#28CA41" }} />
          <div style={{ flex:1, textAlign:"center", fontSize:"0.72rem", color:"#78909C", fontWeight:700, fontFamily:"'Courier New',monospace" }}>
            karta-talantov — VSCode
          </div>
        </div>

        {/* Split pane */}
        <div style={{ display:"flex", height:360 }}>

          {/* LEFT: Auto-animated chat — unchanged */}
          <div className="ai-demo-chat" style={{ width:"42%", background:"#161B22", borderRight:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.06)", fontSize:"0.72rem", fontWeight:800, color:"#78909C", letterSpacing:"0.1em", textTransform:"uppercase" }}>
              KARTA TALANTOV: AI CHAT
            </div>
            <div ref={chatRef} style={{ flex:1, overflowY:"auto", padding:"14px", display:"flex", flexDirection:"column", gap:12, scrollBehavior:"smooth" }}>
              {shownMsgs.map((msg, i) => (
                <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", animation:"listItemIn 0.3s ease both" }}>
                  <div style={{ width:24, height:24, borderRadius:"50%", background: msg.role==="ai" ? "linear-gradient(135deg,#0F6E56,#5DCAA5)" : "#EF9F27", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.7rem", flexShrink:0 }}>
                    {msg.role==="ai" ? "🌟" : "👤"}
                  </div>
                  <div style={{ background: msg.role==="ai" ? "rgba(93,202,165,0.1)" : "rgba(239,159,39,0.1)", border:`1px solid ${msg.role==="ai" ? "rgba(93,202,165,0.2)" : "rgba(239,159,39,0.2)"}`, borderRadius: msg.role==="ai" ? "4px 12px 12px 12px" : "12px 4px 12px 12px", padding:"8px 12px", fontSize:"0.8rem", color:"#E1F5EE", fontWeight:600, lineHeight:1.5, maxWidth:"82%" }}>
                    {msg.text[lang] || msg.text.en}
                  </div>
                </div>
              ))}
              {shownMsgs.length < CHAT_MESSAGES.length && started && (
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <div style={{ width:24, height:24, borderRadius:"50%", background:"linear-gradient(135deg,#0F6E56,#5DCAA5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.7rem" }}>🌟</div>
                  <div style={{ display:"flex", gap:4, padding:"10px 14px", background:"rgba(93,202,165,0.1)", borderRadius:"4px 12px 12px 12px", border:"1px solid rgba(93,202,165,0.2)" }}>
                    {[0,1,2].map(d => <div key={d} style={{ width:6, height:6, borderRadius:"50%", background:"#5DCAA5", animation:`pulse 1.2s ease-in-out ${d*0.2}s infinite` }} />)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Interactive code editor with tabs */}
          <InteractiveCodeEditor visible={visible} lang={lang} />
        </div>
      </div>
    </div>
  );
}

// ── Star Mascot — body fixed, head tilts + eyes track cursor ────────────────
function StarMascot() {
  const wrapRef = useRef(null);
  const [tilt, setTilt]     = useState({ x: 0, y: 0 });
  const [eyeOff, setEyeOff] = useState({ x: 0, y: 0 });
  const [smile, setSmile]   = useState(false);

  useEffect(() => {
    const onMove = (e) => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const strength = Math.min(1, 180 / (dist + 1));
      setTilt({
        x: -(dy / (rect.height + 1)) * 18 * strength,
        y:  (dx / (rect.width  + 1)) * 22 * strength,
      });
      setEyeOff({
        x: Math.max(-3, Math.min(3, dx * 0.04)),
        y: Math.max(-2, Math.min(2, dy * 0.03)),
      });
      setSmile(dist < 200);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={wrapRef} style={{ position:"relative", width:160, height:180, flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>


      {/* Orbiting sparkles */}
      <div style={{ position:"absolute", top:"50%", left:"50%", width:0, height:0, zIndex:3 }}>
        <div style={{ position:"absolute", width:9, height:9, borderRadius:"50%", top:-4, left:-4, background:"#FFD740", boxShadow:"0 0 8px 2px #FFD740", animation:"orbitSpark  3.5s linear infinite" }} />
        <div style={{ position:"absolute", width:7, height:7, borderRadius:"50%", top:-3, left:-3, background:"#5DCAA5", boxShadow:"0 0 8px 2px #5DCAA5", animation:"orbitSpark2 3.5s linear infinite" }} />
        <div style={{ position:"absolute", width:5, height:5, borderRadius:"50%", top:-2, left:-2, background:"#EF9F27", boxShadow:"0 0 6px 2px #EF9F27", animation:"orbitSpark3 3.5s linear infinite" }} />
      </div>

      {/* Body floats up/down */}
      <div style={{ animation:"mascotFloat 3.2s ease-in-out infinite" }}>
        <svg width="130" height="130" viewBox="0 0 130 130"
          style={{ animation:"mascotGlow 3.2s ease-in-out infinite", display:"block" }}>
          <defs>
            <radialGradient id="bG" cx="40%" cy="35%" r="65%">
              <stop offset="0%"   stopColor="#7C4DFF" />
              <stop offset="60%"  stopColor="#5C35CC" />
              <stop offset="100%" stopColor="#3A1FA0" />
            </radialGradient>
            <radialGradient id="hG" cx="40%" cy="30%" r="65%">
              <stop offset="0%"   stopColor="#9C6FFF" />
              <stop offset="100%" stopColor="#5C35CC" />
            </radialGradient>
            <radialGradient id="vG" cx="40%" cy="30%" r="65%">
              <stop offset="0%"   stopColor="#80D8FF" />
              <stop offset="100%" stopColor="#0F6E56" />
            </radialGradient>
            <filter id="sG">
              <feGaussianBlur stdDeviation="3" result="b"/>
              <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>

          {/* BODY — never moves */}
          <path d="M65,15 L74,44 L105,44 L81,62 L90,91 L65,74 L40,91 L49,62 L25,44 L56,44 Z"
            fill="url(#bG)" filter="url(#sG)" />
          <path d="M65,25 L72,47 L95,47 L77,59 L84,81 L65,68 L46,81 L53,59 L35,47 L58,47 Z"
            fill="rgba(255,255,255,0.07)" />
          <circle cx="65" cy="17" r="3" fill="#FFD740" opacity="0.9" />
          <circle cx="25" cy="44" r="2" fill="#FFD740" opacity="0.7" />
          <circle cx="105" cy="44" r="2" fill="#FFD740" opacity="0.7" />
          <circle cx="40"  cy="91" r="2" fill="#FFD740" opacity="0.7" />
          <circle cx="90"  cy="91" r="2" fill="#FFD740" opacity="0.7" />

          {/* HEAD GROUP — pivot at face centre, tilts toward cursor */}
          <g style={{
            transformOrigin: "65px 67px",
            transform: `perspective(300px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: "transform 0.15s ease-out",
          }}>
            {/* Helmet */}
            <rect x="34" y="46" width="62" height="22" rx="11" fill="url(#hG)" />
            <rect x="36" y="48" width="24" height="18" rx="8"  fill="#0D1117" />
            <rect x="37" y="49" width="22" height="16" rx="7"  fill="url(#vG)" opacity="0.85" />
            <rect x="38" y="50" width="10" height="7"  rx="3"  fill="rgba(255,255,255,0.4)" />
            <rect x="70" y="48" width="24" height="18" rx="8"  fill="#0D1117" />
            <rect x="71" y="49" width="22" height="16" rx="7"  fill="url(#vG)" opacity="0.85" />
            <rect x="72" y="50" width="10" height="7"  rx="3"  fill="rgba(255,255,255,0.4)" />
            <rect x="60" y="53" width="10" height="8"  rx="4"  fill="url(#hG)" />

            {/* Left eye */}
            <rect x="45" y="72" width="10" height="10" rx="3" fill="#04342C"
              style={{ transformOrigin:"50px 77px", animation:"eyeBlink 4s ease-in-out infinite" }} />
            <rect x={47 + eyeOff.x} y={73 + eyeOff.y} width="6" height="6" rx="2" fill="#5DCAA5" />
            <rect x={48 + eyeOff.x} y={74 + eyeOff.y} width="2" height="2" rx="1" fill="rgba(255,255,255,0.85)" />

            {/* Right eye */}
            <rect x="75" y="72" width="10" height="10" rx="3" fill="#04342C"
              style={{ transformOrigin:"80px 77px", animation:"eyeBlink 4s ease-in-out 0.15s infinite" }} />
            <rect x={77 + eyeOff.x} y={73 + eyeOff.y} width="6" height="6" rx="2" fill="#5DCAA5" />
            <rect x={78 + eyeOff.x} y={74 + eyeOff.y} width="2" height="2" rx="1" fill="rgba(255,255,255,0.85)" />

            {/* Smile — wider when cursor is close */}
            <path d={smile ? "M48,87 Q65,98 82,87" : "M52,86 Q65,92 78,86"}
              stroke="#FFD740" strokeWidth="2.5" fill="none" strokeLinecap="round"
              style={{ transition:"d 0.3s ease" }} />

            {/* Blush */}
            <ellipse cx="43" cy="84" rx="7" ry="4" fill="rgba(239,159,39,0.35)" opacity={smile ? 0.8 : 0.35} />
            <ellipse cx="87" cy="84" rx="7" ry="4" fill="rgba(239,159,39,0.35)" opacity={smile ? 0.8 : 0.35} />
          </g>
        </svg>

        {/* Shadow */}
        <div style={{ width:70, height:14, borderRadius:"50%", background:"rgba(92,53,204,0.25)", margin:"-10px auto 0", animation:"shadowPulse 3.2s ease-in-out infinite", filter:"blur(6px)" }} />
      </div>
    </div>
  );
}


// ── Typewriter hook ───────────────────────────────────────────────────────────
function useTypewriter(texts, speed=60, pause=2200) {
  const [displayed, setDisplayed] = useState("");
  const [textIdx,   setTextIdx]   = useState(0);
  const [charIdx,   setCharIdx]   = useState(0);
  const [deleting,  setDeleting]  = useState(false);

  useEffect(() => {
    const current = texts[textIdx] || "";
    let delay = deleting ? speed/2 : speed;
    if (!deleting && charIdx === current.length) delay = pause;
    if (deleting && charIdx === 0) {
      setDeleting(false);
      setTextIdx(i => (i+1) % texts.length);
      return;
    }
    const t = setTimeout(() => {
      if (!deleting && charIdx < current.length) {
        setDisplayed(current.slice(0, charIdx+1));
        setCharIdx(c => c+1);
      } else if (!deleting && charIdx === current.length) {
        setDeleting(true);
      } else if (deleting) {
        setDisplayed(current.slice(0, charIdx-1));
        setCharIdx(c => c-1);
      }
    }, delay);
    return () => clearTimeout(t);
  }, [charIdx, deleting, textIdx, texts, speed, pause]);

  return displayed;
}

// ── Animated counter stat ─────────────────────────────────────────────────────
function AnimatedStat({ target, suffix="", label, color="#5DCAA5" }) {
  const [count,   setCount]   = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    let start = null;
    const duration = 1400;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(target * eased));
      if (p < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [started, target]);

  return (
    <div ref={ref} style={{ textAlign:"center" }}>
      <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"clamp(1.8rem,5vw,2.8rem)", color, lineHeight:1 }}>
        {count}{suffix}
      </div>
      <div style={{ fontSize:"0.72rem", fontWeight:800, color:"#484F58", textTransform:"uppercase", letterSpacing:"0.1em", marginTop:4 }}>
        {label}
      </div>
    </div>
  );
}

// ── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection({ lang, setPage }) {
  const TYPEWRITER = {
    ru: ["программиста 💻","дизайнера 🎨","врача 🩺","музыканта 🎵","учёного 🔬","биолога 🌿","лидера 👑","спортсмена 🏆"],
    uz: ["dasturchi 💻","dizayner 🎨","shifokor 🩺","musiqachi 🎵","olim 🔬","biolog 🌿","lider 👑","sportchi 🏆"],
    en: ["Programmer 💻","Designer 🎨","Doctor 🩺","Musician 🎵","Scientist 🔬","Biologist 🌿","Leader 👑","Athlete 🏆"],
  };
  const STATS = {
    ru: [{t:30,s:"",l:"Вопросов"},{t:9,s:"",l:"Талантов"},{t:35,s:"+",l:"Профессий"},{t:3,s:"",l:"Языка"}],
    uz: [{t:30,s:"",l:"Savol"},{t:9,s:"",l:"Iste'dod"},{t:35,s:"+",l:"Kasb"},{t:3,s:"",l:"Til"}],
    en: [{t:30,s:"",l:"Questions"},{t:9,s:"",l:"Talents"},{t:35,s:"+",l:"Careers"},{t:3,s:"",l:"Languages"}],
  };
  const COLORS = ["#5DCAA5","#EF9F27","#7E57C2","#E64A19"];
  const PREFIX = { ru:"Найди своего", uz:"O'z ichingdagi", en:"Discover the" };
  const AVATARS = ["👧","👦","🧒","👩","🧑"];

  const typed  = useTypewriter(TYPEWRITER[lang] || TYPEWRITER.en);
  const stats  = STATS[lang] || STATS.en;
  const prefix = PREFIX[lang] || PREFIX.en;

  return (
    <div className="home-hero" style={{
      minHeight:"100vh",
      background:"linear-gradient(180deg,#0D1117 0%,#0D1117 70%,#161B22 100%)",
      display:"flex", flexDirection:"column", alignItems:"center",
      justifyContent:"center", textAlign:"center",
      padding:"120px 24px 100px",
      position:"relative", overflow:"hidden",
    }}>

      {/* Glows */}
      <div style={{ position:"absolute", top:"35%", left:"50%", transform:"translate(-50%,-50%)", width:500, height:500, borderRadius:"50%", background:"radial-gradient(circle,rgba(92,53,204,0.15) 0%,transparent 70%)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", top:"35%", left:"50%", transform:"translate(-50%,-50%)", width:700, height:700, borderRadius:"50%", background:"radial-gradient(circle,rgba(15,110,86,0.08) 0%,transparent 70%)", pointerEvents:"none" }}/>

      {/* Mascot */}
<<<<<<< HEAD
      <div style={{ animation:"heroFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s both", marginBottom:28 }}>
        <StarMascot />
      </div>

      {/* Badge */}
      <div style={{ display:"inline-flex", alignItems:"center", gap:8, background:"rgba(93,202,165,0.1)", border:"1px solid rgba(93,202,165,0.25)", borderRadius:99, padding:"6px 18px", fontSize:"0.78rem", fontWeight:800, color:"#5DCAA5", letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:28, animation:"heroFadeUp 0.7s ease 0.1s both" }}>
        <span style={{ width:7, height:7, borderRadius:"50%", background:"#5DCAA5", animation:"pulse 2s ease infinite", display:"inline-block" }}/>
        {lang==="ru"?"Бесплатно · Научно · 3 языка":lang==="uz"?"Bepul · Ilmiy · 3 tilda":"Free · Science-backed · 3 languages"}
      </div>
=======
      <div style={{ animation:"heroFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.05s both", marginBottom:20 }}>
        <StarMascot />
      </div>

      {/* Typewriter headline */}
      <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"clamp(2rem,6vw,3.6rem)", color:"#E1F5EE", lineHeight:1.2, maxWidth:700, margin:"0 auto 0", animation:"heroFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.15s both" }}>
        {prefix}{" "}
        <span style={{ color:"#5DCAA5", borderRight:"3px solid #5DCAA5", paddingRight:4, animation:"blinkCaret 0.8s step-end infinite" }}>
          {typed}
        </span>
      </h1>

      {/* Subtitle */}
      <p style={{ fontSize:"1rem", fontWeight:600, color:"#8B949E", maxWidth:460, margin:"20px auto 32px", lineHeight:1.7, animation:"heroFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.25s both" }}>
        {lang==="ru"?"Пройди тест, узнай 9 талантов и получи рекомендации по 35+ профессиям — бесплатно"
        :lang==="uz"?"Test o'ting, 9 iste'dodingizni biling va 35+ kasb bo'yicha tavsiya oling — bepul"
        :"Take the quiz, discover 9 talents and get recommendations for 35+ careers — free"}
      </p>
>>>>>>> ba89ccb2ee6e9d2ba19e60a153bbe67ad70cbbba

      {/* CTAs */}
      <div className="home-hero-btns" style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", animation:"heroFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.35s both" }}>
        <button onClick={() => setPage("quiz")}
          style={{ padding:"15px 36px", background:"linear-gradient(135deg,#0F6E56,#1D9E75)", color:"#fff", border:"none", borderRadius:50, fontFamily:"'Fredoka One',cursive", fontSize:"1.1rem", cursor:"pointer", boxShadow:"0 6px 24px rgba(15,110,86,0.5)", transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
          onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-3px) scale(1.03)";e.currentTarget.style.boxShadow="0 12px 36px rgba(15,110,86,0.65)";}}
          onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 6px 24px rgba(15,110,86,0.5)";}}>
          {lang==="ru"?"Пройти тест бесплатно →":lang==="uz"?"Bepul test topshirish →":"Take the quiz free →"}
        </button>
        <button onClick={() => setPage("tasks")}
          style={{ padding:"15px 32px", background:"transparent", color:"#E1F5EE", border:"1.5px solid rgba(255,255,255,0.18)", borderRadius:50, fontFamily:"'Fredoka One',cursive", fontSize:"1.05rem", cursor:"pointer", transition:"all 0.2s", backdropFilter:"blur(8px)" }}
          onMouseEnter={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.45)";e.currentTarget.style.background="rgba(255,255,255,0.05)";}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor="rgba(255,255,255,0.18)";e.currentTarget.style.background="transparent";}}>
          {lang==="ru"?"Мини-игры 🎮":lang==="uz"?"Mini-o'yinlar 🎮":"Mini-games 🎮"}
        </button>
      </div>

      {/* Social proof */}
      <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:24, animation:"socialFadeIn 0.7s ease 0.55s both" }}>
        <div style={{ display:"flex" }}>
          {AVATARS.map((a,i) => (
            <div key={i} style={{ width:30, height:30, borderRadius:"50%", background:"linear-gradient(135deg,#0F6E56,#5DCAA5)", border:"2px solid #0D1117", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.85rem", marginLeft:i>0?-8:0, animation:`floatAvatar ${2+i*0.3}s ease-in-out infinite` }}>
              {a}
            </div>
          ))}
        </div>
        <span style={{ fontSize:"0.82rem", fontWeight:700, color:"#8B949E" }}>
          <span style={{ color:"#5DCAA5", fontWeight:900 }}>+247</span>{" "}
          {lang==="ru"?"учеников на этой неделе":lang==="uz"?"o'quvchi shu hafta":"students this week"}
        </span>
      </div>



      {/* Scroll indicator — absolute at bottom, clear of content */}
      <div style={{ position:"absolute", bottom:24, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:4, animation:"heroFadeUp 0.7s ease 0.9s both", pointerEvents:"none" }}>
        <span style={{ fontSize:"0.62rem", fontWeight:800, color:"rgba(255,255,255,0.2)", letterSpacing:"0.15em", textTransform:"uppercase" }}>
          {lang==="ru"?"листай":lang==="uz"?"suring":"scroll"}
        </span>
        <div style={{ width:20, height:32, border:"1.5px solid rgba(255,255,255,0.1)", borderRadius:99, display:"flex", justifyContent:"center", paddingTop:5 }}>
          <div style={{ width:3, height:6, background:"rgba(255,255,255,0.25)", borderRadius:99, animation:"scrollBounce 1.6s ease-in-out infinite" }}/>
        </div>
      </div>
    </div>
  );
}


<<<<<<< HEAD

// ── Typewriter Banner (shown after chat demo) ─────────────────────────────────
function TypewriterBanner({ lang, dark }) {
  const TEXTS = {
    ru: ["Программиста 💻","Дизайнера 🎨","Врача 🩺","Музыканта 🎵","Учёного 🔬","Биолога 🌿","Лидера 👑","Спортсмена 🏆"],
    uz: ["Dasturchi 💻","Dizayner 🎨","Shifokor 🩺","Musiqachi 🎵","Olim 🔬","Biolog 🌿","Lider 👑","Sportchi 🏆"],
    en: ["Programmer 💻","Designer 🎨","Doctor 🩺","Musician 🎵","Scientist 🔬","Biologist 🌿","Leader 👑","Athlete 🏆"],
  };
  const PREFIX = { ru:"Открой в себе", uz:"O'z ichingdagi", en:"Discover the" };
  const SUB = {
    ru:"Пройди тест, узнай 9 талантов и получи рекомендации по 35+ профессиям — бесплатно",
    uz:"Test o'ting, 9 iste'dodingizni biling va 35+ kasb bo'yicha tavsiya oling — bepul",
    en:"Take the quiz, discover 9 talents and get recommendations for 35+ careers — free",
  };

  const typed  = useTypewriter(TEXTS[lang] || TEXTS.en);
  const [ref, visible] = useInView(0.2);

  return (
    <div ref={ref} style={{
      padding:"80px 24px 72px",
      background: dark
        ? "linear-gradient(180deg,#060E09,#0A1F15)"
        : "linear-gradient(180deg,#F1EFE8,#E1F5EE)",
      textAlign:"center",
    }}>
      {/* Typewriter headline */}
      <h2 style={{
        fontFamily:"'Fredoka One',cursive",
        fontSize:"clamp(2.4rem,7vw,4.5rem)",
        color: dark?"#E1F5EE":"#04342C",
        lineHeight:1.15,
        maxWidth:720,
        margin:"0 auto 20px",
        opacity: visible?1:0,
        transform: visible?"translateY(0)":"translateY(24px)",
        transition:"opacity 0.7s ease, transform 0.7s ease",
      }}>
        {PREFIX[lang]||PREFIX.en}{" "}
        <span style={{
          color:"#1D9E75",
          borderBottom:`3px solid #1D9E75`,
          paddingBottom:2,
          display:"inline-block",
          minWidth:20,
          position:"relative",
        }}>
          {typed}
          <span style={{
            position:"absolute", right:-4, top:0, bottom:0,
            width:3, background:"#1D9E75",
            animation:"blinkCaret 0.8s step-end infinite",
          }}/>
        </span>
      </h2>

      {/* Subtitle */}
      <p style={{
        fontSize:"1.05rem",
        fontWeight:600,
        color: dark?"#7DB99A":"#546E7A",
        maxWidth:500,
        margin:"0 auto 36px",
        lineHeight:1.7,
        opacity: visible?1:0,
        transition:"opacity 0.7s ease 0.15s",
      }}>
        {SUB[lang]||SUB.en}
      </p>

      {/* Decorative divider */}
      <div style={{ display:"flex", alignItems:"center", gap:16, justifyContent:"center", marginTop:8 }}>
        {["🧠","🎨","🎵","👑","🌍","🏃","🌿","🤝","🃏"].map((e,i)=>(
          <span key={i} style={{
            fontSize:"1.4rem",
            opacity: visible ? 1 : 0,
            transform: visible?"scale(1)":"scale(0.5)",
            transition:`opacity 0.4s ease ${0.05*i}s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) ${0.05*i}s`,
          }}>{e}</span>
        ))}
      </div>
    </div>
  );
}

=======
>>>>>>> ba89ccb2ee6e9d2ba19e60a153bbe67ad70cbbba
// ── Stats Section ─────────────────────────────────────────────────────────────
function StatsSection({ lang, dark }) {
  const STATS = {
    ru: [
      { t:30, s:"",  l:"Вопросов",   icon:"📋", desc:"За 7 минут" },
      { t:9,  s:"",  l:"Талантов",   icon:"🧠", desc:"По Гарднеру" },
      { t:35, s:"+", l:"Профессий",  icon:"🚀", desc:"С процентом совпадения" },
      { t:3,  s:"",  l:"Языка",      icon:"🌍", desc:"RU · UZ · EN" },
    ],
    uz: [
      { t:30, s:"",  l:"Savol",       icon:"📋", desc:"7 daqiqada" },
      { t:9,  s:"",  l:"Iste'dod",   icon:"🧠", desc:"Gardner bo'yicha" },
      { t:35, s:"+", l:"Kasb",        icon:"🚀", desc:"Mos foiz bilan" },
      { t:3,  s:"",  l:"Til",         icon:"🌍", desc:"RU · UZ · EN" },
    ],
    en: [
      { t:30, s:"",  l:"Questions",  icon:"📋", desc:"In 7 minutes" },
      { t:9,  s:"",  l:"Talents",    icon:"🧠", desc:"Gardner's theory" },
      { t:35, s:"+", l:"Careers",    icon:"🚀", desc:"With match %" },
      { t:3,  s:"",  l:"Languages",  icon:"🌍", desc:"RU · UZ · EN" },
    ],
  };
  const COLORS = ["#5DCAA5","#EF9F27","#7E57C2","#E64A19"];
  const stats = STATS[lang] || STATS.en;

  const [ref, visible] = useInView(0.15);

  return (
    <div ref={ref} style={{
      padding:"80px 24px",
      background: dark
        ? "linear-gradient(135deg,#0A1F15,#060E09)"
        : "linear-gradient(135deg,#E1F5EE,#F1EFE8)",
    }}>
      {/* Section label */}
      <div style={{ textAlign:"center", marginBottom:48 }}>
        <div style={{ display:"inline-flex", alignItems:"center", gap:8, background: dark?"rgba(93,202,165,0.1)":"rgba(15,110,86,0.08)", border:"1px solid rgba(15,110,86,0.2)", borderRadius:99, padding:"5px 18px", fontSize:"0.72rem", fontWeight:800, color:"#0F6E56", letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:14, opacity:visible?1:0, transition:"opacity 0.6s ease" }}>
          ✦ {lang==="ru"?"Платформа в цифрах":lang==="uz"?"Platforma raqamlarda":"Platform in numbers"}
        </div>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"clamp(1.6rem,4vw,2.6rem)", color: dark?"#E1F5EE":"#04342C", margin:0, opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(20px)", transition:"opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s" }}>
          {lang==="ru"?"Всё что тебе нужно — в одном тесте"
          :lang==="uz"?"Sizga kerak bo'lgan hamma narsa — bir testda"
          :"Everything you need — in one quiz"}
        </h2>
      </div>

      {/* 4 stat cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:20, maxWidth:860, margin:"0 auto" }}>
        {stats.map((s, i) => (
          <div key={i}
            style={{
              background: dark?"rgba(255,255,255,0.03)":"#fff",
              border:`1.5px solid ${COLORS[i]}22`,
              borderRadius:24,
              padding:"32px 24px",
              textAlign:"center",
              boxShadow:`0 4px 24px ${COLORS[i]}10`,
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.95)",
              transition:`opacity 0.6s ease ${0.1+i*0.1}s, transform 0.6s cubic-bezier(0.34,1.56,0.64,1) ${0.1+i*0.1}s`,
            }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-6px) scale(1.02)";e.currentTarget.style.boxShadow=`0 16px 40px ${COLORS[i]}22`;}}
            onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0) scale(1)";e.currentTarget.style.boxShadow=`0 4px 24px ${COLORS[i]}10`;}}
          >
            <div style={{ fontSize:"2rem", marginBottom:12 }}>{s.icon}</div>
            <AnimatedStat target={s.t} suffix={s.s} label={s.l} color={COLORS[i]} />
            <p style={{ fontSize:"0.75rem", fontWeight:600, color: dark?"#607D8B":"#90A4AE", marginTop:8, letterSpacing:"0.02em" }}>
              {s.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function HomePage({ setPage, user, onLogout, lang, dark }) {
  return (
    <div className="page-wrap">
      <Nav page="home" setPage={setPage} lang={lang} dark={dark} user={user} onLogout={onLogout} />

      <style>{`
        @keyframes infiniteScroll { 0% { transform:translateX(0); } 100% { transform:translateX(-50%); } }
        @keyframes heroFadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scrollBounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(8px); } }
        @keyframes typewriter { from{width:0;opacity:0} to{width:100%;opacity:1} }
        @keyframes blinkCaret { 0%,100%{border-color:#5DCAA5} 50%{border-color:transparent} }
        @keyframes socialFadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes badgePop { from{opacity:0;transform:scale(0.8) translateY(8px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes floatAvatar { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-3px)} }
        @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.4;} }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes mascotFloat { 0%,100% { transform:translateY(0px); } 50% { transform:translateY(-14px); } }
        @keyframes mascotGlow { 0%,100% { filter:drop-shadow(0 0 16px rgba(255,215,0,0.7)) drop-shadow(0 0 36px rgba(92,53,204,0.5)); } 50% { filter:drop-shadow(0 0 28px rgba(255,215,0,1)) drop-shadow(0 0 56px rgba(92,53,204,0.8)); } }
        @keyframes shadowPulse { 0%,100% { transform:scaleX(1); opacity:0.3; } 50% { transform:scaleX(0.6); opacity:0.12; } }
        @keyframes orbitSpark  { from { transform:rotate(0deg)   translateX(62px) rotate(0deg);    } to { transform:rotate(360deg)  translateX(62px) rotate(-360deg);  } }
        @keyframes orbitSpark2 { from { transform:rotate(120deg) translateX(58px) rotate(-120deg); } to { transform:rotate(480deg)  translateX(58px) rotate(-480deg);  } }
        @keyframes orbitSpark3 { from { transform:rotate(240deg) translateX(54px) rotate(-240deg); } to { transform:rotate(600deg)  translateX(54px) rotate(-600deg);  } }
        @keyframes eyeBlink { 0%,88%,100% { transform:scaleY(1); } 93% { transform:scaleY(0.07); } }

        /* ── Mobile fixes for HomePage ── */
        @media (max-width: 768px) {
          .home-hero {
            padding: 48px 16px 40px !important;
          }
          .home-hero h1 {
            font-size: 1.9rem !important;
          }
          .home-hero p {
            font-size: 0.9rem !important;
          }
          .home-hero-btns {
            flex-direction: column !important;
            align-items: center !important;
            gap: 10px !important;
          }
          .home-hero-btns button {
            width: 100% !important;
            max-width: 300px !important;
            font-size: 1rem !important;
            padding: 13px 24px !important;
          }
          .ai-demo-code { display: none !important; }
          .ai-demo-chat { width: 100% !important; }
          .ai-demo-title { font-size: 1.4rem !important; }
          .ai-demo-window { height: 280px !important; }
          .benefit-inner {
            flex-direction: column !important;
            gap: 20px !important;
            padding: 0 !important;
          }
          .benefit-text { min-width: unset !important; }
          .benefit-visual { width: 100% !important; display: flex !important; justify-content: center !important; }
          .final-cta h2 { font-size: 1.5rem !important; }
        }

        @media (max-width: 480px) {
          .home-hero h1 { font-size: 1.6rem !important; }
          .ai-demo-title { font-size: 1.2rem !important; }
        }

        /* Visual box always centered and full-width */
        .benefit-visual > div {
          width: 100% !important;
          max-width: 320px !important;
          margin: 0 auto !important;
        }

        /* Benefit section padding */
        @media (max-width: 768px) {
          .benefit-inner {
            padding: 0 4px !important;
          }
        }
      `}</style>

      {/* ── UPGRADED HERO ── */}
      <HeroSection lang={lang} dark={dark} setPage={setPage} />

      {/* Logo slider */}
      <div style={{ padding:"28px 0 8px", overflow:"hidden", background: dark?"#0F1923":"#F1EFE8" }}>
        <p style={{ textAlign:"center", fontSize:"0.78rem", fontWeight:800, color: dark?"#484F58":"#B0BEC5", letterSpacing:"0.10em", textTransform:"uppercase", marginBottom:16 }}>
          {lang==="ru"?"Наши партнёры и платформы":lang==="uz"?"Bizning hamkorlar va platformalar":"Our partners & platforms"}
        </p>
        <div style={{ position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, bottom:0, left:0, width:80, zIndex:2, pointerEvents:"none", background: dark?"linear-gradient(to right,#0F1923,transparent)":"linear-gradient(to right,#F1EFE8,transparent)" }} />
          <div style={{ position:"absolute", top:0, bottom:0, right:0, width:80, zIndex:2, pointerEvents:"none", background: dark?"linear-gradient(to left,#0F1923,transparent)":"linear-gradient(to left,#F1EFE8,transparent)" }} />
          <div style={{ display:"flex", gap:16, width:"max-content", animation:"infiniteScroll 28s linear infinite", padding:"8px 0" }}>
            {TRACK.map((item, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, background: dark?"#1A2A3A":"#fff", borderRadius:16, padding:"12px 20px", border: dark?"1.5px solid #2A4070":"1.5px solid #E1F5EE", whiteSpace:"nowrap", userSelect:"none" }}>
                <span style={{ fontSize:"1.4rem" }}>{item.emoji}</span>
                <span style={{ fontSize:"0.88rem", fontWeight:800, color: dark?"#9FE1CB":"#04342C", fontFamily:"'Nunito',sans-serif" }}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Demo — GitHub Copilot style */}
      <AIDemoSection lang={lang} dark={dark} />

      {/* Typewriter headline + subtitle — appears after chat demo */}
      <TypewriterBanner lang={lang} dark={dark} />

      {/* Scroll benefit sections */}
      <div>
        {BENEFITS.map((benefit, i) => (
          <BenefitSection key={i} benefit={benefit} index={i} lang={lang} dark={dark} />
        ))}
      </div>

      {/* Steps */}
      <div className="steps">
        <div className="step"><div className="step-icon">🎮</div><div className="step-title">{t(lang,"home.step1")}</div><div className="step-desc">{t(lang,"home.step1desc")}</div></div>
        <div className="step-arrow">›</div>
        <div className="step"><div className="step-icon">📊</div><div className="step-title">{t(lang,"home.step2")}</div><div className="step-desc">{t(lang,"home.step2desc")}</div></div>
        <div className="step-arrow">›</div>
        <div className="step"><div className="step-icon">🚀</div><div className="step-title">{t(lang,"home.step3")}</div><div className="step-desc">{t(lang,"home.step3desc")}</div></div>
      </div>

      {/* Final CTA */}
      <div className="final-cta" style={{ textAlign:"center", padding:"60px 24px 80px", background: dark?"linear-gradient(135deg,#1A2A3A,#0F1923)":"linear-gradient(135deg,#E1F5EE,#FAEEDA)" }}>
        <div style={{ fontSize:"2.8rem", marginBottom:16 }}>🌟</div>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2rem", color: dark?"#E1F5EE":"#0F6E56", marginBottom:12 }}>
          {lang==="ru"?"Готов узнать свои таланты?":lang==="uz"?"Iste'dodingizni bilishga tayyormisiz?":"Ready to discover your talents?"}
        </h2>
        <p style={{ color: dark?"#9FE1CB":"#78909C", fontWeight:600, marginBottom:28 }}>
          {lang==="ru"?"Пройди тест за 5 минут!":lang==="uz"?"5 daqiqada testni o'ting!":"Take the 5-minute quiz!"}
        </p>
        <button className="hero-cta" onClick={() => setPage("quiz")}>{t(lang,"home.cta")} →</button>
      </div>
    </div>
  );
}