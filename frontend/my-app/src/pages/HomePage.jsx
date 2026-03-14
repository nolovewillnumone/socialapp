import { useEffect, useRef, useState } from "react";
import Nav from "../components/Nav";
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
    emoji: "🧠", accent: "#1565C0",
    bg: "linear-gradient(135deg, #E3F2FD 0%, #EEF6FF 100%)",
    title: { ru: "Раскрой свой потенциал", uz: "Potentsialingizni oching", en: "Unlock your potential" },
    desc:  { ru: "Наш ML-движок анализирует ответы по 6 измерениям таланта и строит персональную карту способностей.", uz: "ML mexanizmi javoblaringizni 6 iste'dod o'lchovi bo'yicha tahlil qiladi.", en: "Our ML engine analyses your answers across 6 talent dimensions and builds a personal ability map." },
    stats: [
      { value: "6",    label: { ru: "измерений",      uz: "o'lchovlar",    en: "dimensions"    } },
      { value: "10",   label: { ru: "вопросов",       uz: "savollar",      en: "questions"     } },
      { value: "8",    label: { ru: "карьер",         uz: "kasblar",       en: "careers"       } },
    ],
    visual: "radar",
  },
  {
    emoji: "🎮", accent: "#FF7043",
    bg: "linear-gradient(135deg, #FFF8E1 0%, #FFF3E0 100%)",
    title: { ru: "Учись играя",            uz: "O'ynab o'rgan",            en: "Learn by playing"         },
    desc:  { ru: "4 мини-игры на логику, память, творчество и лидерство. Каждый результат вливается в карту талантов.", uz: "4 mini-o'yin: mantiq, xotira, ijodkorlik va liderlik.", en: "4 mini-games covering logic, memory, creativity and leadership." },
    stats: [
      { value: "4",    label: { ru: "мини-игры",      uz: "mini-o'yinlar", en: "mini-games"    } },
      { value: "30s",  label: { ru: "на задание",     uz: "vazifa uchun",  en: "per challenge" } },
      { value: "100%", label: { ru: "весело",         uz: "qiziqarli",     en: "fun"           } },
    ],
    visual: "games",
  },
  {
    emoji: "🗺️", accent: "#66BB6A",
    bg: "linear-gradient(135deg, #E8F5E9 0%, #F1F8E9 100%)",
    title: { ru: "Найди курсы рядом",      uz: "Yaqin kurslarni top",      en: "Find courses near you"    },
    desc:  { ru: "Введи свой город или используй GPS — покажем секции и школы рядом на Google Maps.", uz: "GPS yoki shahar nomi bilan yaqin kurslar.", en: "Enter your city or use GPS to find real clubs and schools near you." },
    stats: [
      { value: "6",    label: { ru: "типов курсов",   uz: "kurs turlari",  en: "course types"  } },
      { value: "GPS",  label: { ru: "определение",    uz: "aniqlash",      en: "detection"     } },
      { value: "Free", label: { ru: "бесплатно",      uz: "bepul",         en: "free"          } },
    ],
    visual: "map",
  },
  {
    emoji: "🌍", accent: "#7E57C2",
    bg: "linear-gradient(135deg, #EDE7F6 0%, #F3E5F5 100%)",
    title: { ru: "Три языка — один результат", uz: "Uch til — bir natija", en: "Three languages — one result" },
    desc:  { ru: "Весь интерфейс, вопросы и результаты на русском, узбекском и английском. Переключайся в одно касание.", uz: "Barcha interfeys, savollar va natijalar uch tilda.", en: "Full interface, questions and results in Russian, Uzbek and English." },
    stats: [
      { value: "3",    label: { ru: "языка",          uz: "til",           en: "languages"     } },
      { value: "1s",   label: { ru: "смена",          uz: "almashtirish",  en: "to switch"     } },
      { value: "100%", label: { ru: "переведено",     uz: "tarjima",       en: "translated"    } },
    ],
    visual: "lang",
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

// ── Visual accents ────────────────────────────────────────────────────────────
function Visual({ type, accent }) {
  if (type === "radar") return (
    <div style={V.box}>
      <svg width="120" height="120" viewBox="0 0 120 120">
        {[0.3,0.6,1].map((l) => (
          <polygon key={l} points={[0,1,2,3,4,5].map((i) => { const a=(Math.PI*2*i)/6-Math.PI/2; return `${60+48*l*Math.cos(a)},${60+48*l*Math.sin(a)}`; }).join(" ")} fill="none" stroke={accent+"44"} strokeWidth="1.5" />
        ))}
        <polygon points={[0.9,0.7,0.85,0.6,0.95,0.75].map((v,i)=>{ const a=(Math.PI*2*i)/6-Math.PI/2; return `${60+48*v*Math.cos(a)},${60+48*v*Math.sin(a)}`; }).join(" ")} fill={accent+"22"} stroke={accent} strokeWidth="2" />
        {["Logic","Mem","Lang","Lead","Music","Art"].map((l,i)=>{ const a=(Math.PI*2*i)/6-Math.PI/2; return <text key={l} x={60+58*Math.cos(a)} y={60+58*Math.sin(a)} textAnchor="middle" dominantBaseline="middle" fontSize="7" fontWeight="800" fill={accent}>{l}</text>; })}
      </svg>
    </div>
  );
  if (type === "games") return (
    <div style={{ ...V.box, flexWrap:"wrap", gap:10, padding:20 }}>
      {["🧠","🃏","🎨","👑"].map((e,i) => <div key={i} style={{ width:60, height:60, borderRadius:16, display:"flex", alignItems:"center", justifyContent:"center", background:accent+"18", border:`1.5px solid ${accent}44`, fontSize:"1.6rem" }}>{e}</div>)}
    </div>
  );
  if (type === "map") return (
    <div style={{ ...V.box, gap:8, padding:20, alignItems:"stretch" }}>
      {["💻 IT School","🤖 Robotics Hub","🏆 Chess Academy"].map((p,i) => (
        <div key={i} style={{ display:"flex", justifyContent:"space-between", padding:"8px 12px", borderRadius:10, background:accent+"12", border:`1px solid ${accent}33` }}>
          <span style={{ fontSize:"0.82rem", fontWeight:800, color:"#1A237E" }}>{p}</span>
          <span style={{ fontSize:"0.75rem", fontWeight:700, color:accent }}>{["0.9km","1.2km","2.8km"][i]}</span>
        </div>
      ))}
    </div>
  );
  if (type === "lang") return (
    <div style={{ ...V.box, gap:10, padding:20, alignItems:"stretch" }}>
      {[["🇷🇺","Карта Талантов","Русский"],["🇺🇿","Iste'dod Xaritasi","O'zbek"],["🇬🇧","Talent Map","English"]].map(([f,n,l],i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 12px", borderRadius:10, background:i===0?accent+"18":"transparent", border:`1.5px solid ${i===0?accent:accent+"33"}` }}>
          <span style={{ fontSize:"1.1rem" }}>{f}</span>
          <span style={{ fontSize:"0.82rem", fontWeight:800, color:"#1A237E" }}>{n}</span>
          <span style={{ fontSize:"0.72rem", fontWeight:700, color:accent, marginLeft:"auto" }}>{l}</span>
        </div>
      ))}
    </div>
  );
  return null;
}
const V = { box: { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", background:"#fff", borderRadius:20, border:"1.5px solid #E3F2FD", padding:16, minHeight:160, minWidth:180, boxShadow:"0 4px 20px rgba(0,0,0,0.06)" } };

function BenefitSection({ benefit, index, lang, dark }) {
  const [ref, visible] = useInView(0.15);
  const isEven = index % 2 === 0;
  return (
    <div ref={ref} style={{ padding:"64px 24px", borderBottom:"1px solid rgba(21,101,192,0.06)", background: dark ? "transparent" : benefit.bg, opacity: visible?1:0, transform: visible?"translateY(0)":"translateY(48px)", transition:"opacity 0.7s ease, transform 0.7s ease", transitionDelay:`${index*0.05}s` }}>
      <div style={{ maxWidth:900, margin:"0 auto", display:"flex", alignItems:"center", gap:48, flexWrap:"wrap", flexDirection: isEven?"row":"row-reverse" }}>
        <div style={{ flex:1, minWidth:260 }}>
          <div style={{ fontSize:"1.8rem", marginBottom:12 }}>{benefit.emoji}</div>
          <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2rem", lineHeight:1.2, marginBottom:14, color: dark?"#E3F2FD":"#1A237E" }}>{benefit.title[lang]||benefit.title.en}</h2>
          <p style={{ fontSize:"0.98rem", fontWeight:600, lineHeight:1.7, marginBottom:24, color: dark?"#B0BEC5":"#546E7A" }}>{benefit.desc[lang]||benefit.desc.en}</p>
          <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
            {benefit.stats.map((stat,i) => (
              <div key={i} style={{ borderRadius:14, padding:"12px 18px", display:"flex", flexDirection:"column", gap:4, background: dark?"#1A2A3A":"#fff", border:`1.5px solid ${benefit.accent}33`, boxShadow:"0 2px 8px rgba(0,0,0,0.05)", opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(20px)", transition:`opacity 0.5s ease ${0.3+i*0.1}s, transform 0.5s ease ${0.3+i*0.1}s` }}>
                <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.6rem", color:benefit.accent }}>{stat.value}</span>
                <span style={{ fontSize:"0.76rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em", color: dark?"#90CAF9":"#78909C" }}>{stat.label[lang]||stat.label.en}</span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ opacity:visible?1:0, transform:visible?"scale(1)":"scale(0.88)", transition:"opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s" }}>
          <Visual type={benefit.visual} accent={benefit.accent} />
        </div>
      </div>
    </div>
  );
}

// ── AI Demo Section (GitHub Copilot style) ────────────────────────────────────
const CHAT_MESSAGES = [
  { role: "ai",   delay: 0,    text: { ru: "Привет! Я анализирую твои ответы...", uz: "Salom! Men javoblaringizni tahlil qilaman...", en: "Hi! I'm analysing your answers..." } },
  { role: "user", delay: 1200, text: { ru: "Какой у меня главный талант?", uz: "Mening asosiy iste'dodim nima?", en: "What is my main talent?" } },
  { role: "ai",   delay: 2600, text: { ru: "Твой топ-талант — Логика (92%). Ты отлично решаешь задачи и думаешь системно.", uz: "Sizning asosiy iste'dodingiz — Mantiq (92%). Muammolarni yaxshi hal qilasiz.", en: "Your top talent is Logic (92%). You solve problems and think systematically." } },
  { role: "user", delay: 4200, text: { ru: "Какую карьеру выбрать?", uz: "Qanday kasb tanlash kerak?", en: "What career should I choose?" } },
  { role: "ai",   delay: 5500, text: { ru: "Рекомендую: Программист (89%), Инженер (81%), Учёный (76%) 🚀", uz: "Tavsiya: Dasturchi (89%), Muhandis (81%), Olim (76%) 🚀", en: "Recommended: Programmer (89%), Engineer (81%), Scientist (76%) 🚀" } },
];

const CODE_LINES = [
  { indent: 0, tokens: [{ t:"keyword", v:"def " }, { t:"fn",      v:"analyze_talent"  }, { t:"plain",   v:"(answers):"   }] },
  { indent: 1, tokens: [{ t:"comment", v:"# ML scoring engine"                                                            }] },
  { indent: 1, tokens: [{ t:"plain",   v:"scores = "           }, { t:"fn",      v:"compute_scores" }, { t:"plain", v:"(answers)" }] },
  { indent: 1, tokens: [{ t:"keyword", v:"top "                }, { t:"plain",   v:"= "             }, { t:"fn",    v:"max"       }, { t:"plain", v:"(scores, key=scores.get)" }] },
  { indent: 1, tokens: [{ t:"keyword", v:"return " }, { t:"plain", v:"{" }] },
  { indent: 2, tokens: [{ t:"str",     v:'"top_talent"'        }, { t:"plain",   v:": top,"         }] },
  { indent: 2, tokens: [{ t:"str",     v:'"score"'             }, { t:"plain",   v:": scores[top]," }] },
  { indent: 2, tokens: [{ t:"str",     v:'"careers"'           }, { t:"plain",   v:": "             }, { t:"fn", v:"match_careers" }, { t:"plain", v:"(scores)" }] },
  { indent: 1, tokens: [{ t:"plain",   v:"}"                                                                              }] },
  { indent: 0, tokens: []                                                                                                    },
  { indent: 0, tokens: [{ t:"comment", v:"# Run analysis"                                                                 }] },
  { indent: 0, tokens: [{ t:"plain",   v:"result = "           }, { t:"fn",      v:"analyze_talent" }, { t:"plain", v:"(user_answers)" }] },
  { indent: 0, tokens: [{ t:"fn",      v:"print"               }, { t:"plain",   v:"(result["        }, { t:"str",   v:'"top_talent"'  }, { t:"plain", v:"])" }] },
];

const TOKEN_COLORS = { keyword:"#FF7043", fn:"#42A5F5", str:"#66BB6A", comment:"#78909C", plain:"#E3F2FD" };

function AIDemoSection({ lang, dark }) {
  const [ref, visible] = useInView(0.1);
  const [shownMsgs, setShownMsgs] = useState([]);
  const [shownLines, setShownLines] = useState(0);
  const [started, setStarted] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => {
    if (!visible || started) return;
    setStarted(true);

    // Animate code lines
    let line = 0;
    const lineInterval = setInterval(() => {
      line++;
      setShownLines(line);
      if (line >= CODE_LINES.length) clearInterval(lineInterval);
    }, 120);

    // Animate chat messages
    CHAT_MESSAGES.forEach((msg) => {
      setTimeout(() => {
        setShownMsgs((prev) => [...prev, msg]);
        setTimeout(() => {
          if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }, 50);
      }, msg.delay);
    });

    return () => clearInterval(lineInterval);
  }, [visible, started]);

  const label = {
    ru: { title: "Умный AI-анализ в реальном времени", sub: "Наш ML видит закономерности, которые не видишь ты" },
    uz: { title: "Real vaqtda aqlli AI tahlili",        sub: "ML ko'ra olmaydigan naqshlarni ko'radi"           },
    en: { title: "Smart AI analysis in real time",      sub: "Our ML sees patterns you might not notice"        },
  }[lang] || {};

  return (
    <div ref={ref} style={{ padding:"72px 24px", background: dark ? "#0F1923" : "#0D1117", overflow:"hidden" }}>
      {/* Section header */}
      <div style={{ textAlign:"center", marginBottom:48, opacity:visible?1:0, transform:visible?"translateY(0)":"translateY(30px)", transition:"opacity 0.6s ease, transform 0.6s ease" }}>
        <div style={{ display:"inline-block", background:"rgba(66,165,245,0.15)", border:"1px solid rgba(66,165,245,0.3)", borderRadius:99, padding:"4px 16px", fontSize:"0.78rem", fontWeight:800, color:"#42A5F5", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:16 }}>
          AI-POWERED
        </div>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2.2rem", color:"#E3F2FD", marginBottom:12 }}>{label.title}</h2>
        <p style={{ color:"#78909C", fontWeight:600, fontSize:"0.95rem" }}>{label.sub}</p>
      </div>

      {/* Demo window */}
      <div style={{ maxWidth:900, margin:"0 auto", borderRadius:16, overflow:"hidden", boxShadow:"0 24px 80px rgba(0,0,0,0.5)", border:"1px solid rgba(255,255,255,0.08)", opacity:visible?1:0, transform:visible?"translateY(0) scale(1)":"translateY(40px) scale(0.97)", transition:"opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s" }}>

        {/* Window chrome */}
        <div style={{ background:"#161B22", padding:"12px 16px", display:"flex", alignItems:"center", gap:8, borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ width:12, height:12, borderRadius:"50%", background:"#FF5F57" }} />
          <div style={{ width:12, height:12, borderRadius:"50%", background:"#FFBD2E" }} />
          <div style={{ width:12, height:12, borderRadius:"50%", background:"#28CA41" }} />
          <div style={{ flex:1, display:"flex", justifyContent:"center", gap:16 }}>
            {["talent_analyzer.py", "ml_service.py"].map((f, i) => (
              <div key={f} style={{ background: i===0 ? "#0D1117" : "transparent", border: i===0 ? "1px solid rgba(255,255,255,0.1)" : "none", borderRadius:"6px 6px 0 0", padding:"4px 12px", fontSize:"0.75rem", fontWeight:700, color: i===0 ? "#E3F2FD" : "#78909C", display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ color:"#42A5F5" }}>■</span> {f}
              </div>
            ))}
          </div>
        </div>

        {/* Split pane */}
        <div style={{ display:"flex", height:340 }}>

          {/* LEFT: Chat panel */}
          <div style={{ width:"42%", background:"#161B22", borderRight:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column" }}>
            <div style={{ padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.06)", fontSize:"0.72rem", fontWeight:800, color:"#78909C", letterSpacing:"0.1em", textTransform:"uppercase" }}>
              KARTA TALANTOV: AI CHAT
            </div>
            <div ref={chatRef} style={{ flex:1, overflowY:"auto", padding:"14px", display:"flex", flexDirection:"column", gap:12, scrollBehavior:"smooth" }}>
              {shownMsgs.map((msg, i) => (
                <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", animation:"listItemIn 0.3s ease both" }}>
                  <div style={{ width:24, height:24, borderRadius:"50%", background: msg.role==="ai" ? "linear-gradient(135deg,#1565C0,#42A5F5)" : "#FF7043", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.7rem", flexShrink:0 }}>
                    {msg.role === "ai" ? "🌟" : "👤"}
                  </div>
                  <div style={{ background: msg.role==="ai" ? "rgba(66,165,245,0.1)" : "rgba(255,112,67,0.1)", border:`1px solid ${msg.role==="ai" ? "rgba(66,165,245,0.2)" : "rgba(255,112,67,0.2)"}`, borderRadius: msg.role==="ai" ? "4px 12px 12px 12px" : "12px 4px 12px 12px", padding:"8px 12px", fontSize:"0.8rem", color:"#E3F2FD", fontWeight:600, lineHeight:1.5, maxWidth:"82%" }}>
                    {msg.text[lang] || msg.text.en}
                  </div>
                </div>
              ))}
              {shownMsgs.length < CHAT_MESSAGES.length && started && (
                <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                  <div style={{ width:24, height:24, borderRadius:"50%", background:"linear-gradient(135deg,#1565C0,#42A5F5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.7rem" }}>🌟</div>
                  <div style={{ display:"flex", gap:4, padding:"10px 14px", background:"rgba(66,165,245,0.1)", borderRadius:"4px 12px 12px 12px", border:"1px solid rgba(66,165,245,0.2)" }}>
                    {[0,1,2].map((d) => <div key={d} style={{ width:6, height:6, borderRadius:"50%", background:"#42A5F5", animation:`pulse 1.2s ease-in-out ${d*0.2}s infinite` }} />)}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Code editor */}
          <div style={{ flex:1, background:"#0D1117", overflow:"hidden", fontFamily:"'Courier New', monospace", fontSize:"0.78rem" }}>
            <div style={{ padding:"10px 14px", borderBottom:"1px solid rgba(255,255,255,0.06)", display:"flex", gap:16 }}>
              {["76","77","78"].map((n) => <span key={n} style={{ fontSize:"0.72rem", color:"#30363D", fontWeight:700 }}>{n}</span>)}
            </div>
            <div style={{ padding:"8px 0", overflowY:"auto", height:"calc(100% - 40px)" }}>
              {CODE_LINES.slice(0, shownLines).map((line, i) => (
                <div key={i} style={{ display:"flex", padding:"1px 16px", lineHeight:1.7, animation:"fadeIn 0.15s ease both" }}>
                  <span style={{ color:"#30363D", fontWeight:700, fontSize:"0.7rem", minWidth:28, userSelect:"none" }}>{i + 77}</span>
                  <span style={{ paddingLeft: line.indent * 16 }}>
                    {line.tokens.map((tok, j) => (
                      <span key={j} style={{ color: TOKEN_COLORS[tok.t] || "#E3F2FD" }}>{tok.v}</span>
                    ))}
                  </span>
                </div>
              ))}
              {shownLines < CODE_LINES.length && started && (
                <div style={{ padding:"1px 16px", lineHeight:1.7 }}>
                  <span style={{ color:"#30363D", minWidth:28, display:"inline-block", fontSize:"0.7rem" }}>{shownLines + 77}</span>
                  <span style={{ display:"inline-block", width:8, height:14, background:"#42A5F5", verticalAlign:"middle", animation:"pulse 0.8s ease-in-out infinite" }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
      `}</style>
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
      <style>{`
        @keyframes mascotFloat {
          0%,100% { transform: translateY(0px);   }
          50%      { transform: translateY(-14px); }
        }
        @keyframes mascotGlow {
          0%,100% { filter: drop-shadow(0 0 16px rgba(255,215,0,0.7)) drop-shadow(0 0 36px rgba(92,53,204,0.5)); }
          50%      { filter: drop-shadow(0 0 28px rgba(255,215,0,1))   drop-shadow(0 0 56px rgba(92,53,204,0.8)); }
        }
        @keyframes shadowPulse {
          0%,100% { transform: scaleX(1);   opacity: 0.3;  }
          50%      { transform: scaleX(0.6); opacity: 0.12; }
        }
        @keyframes orbitSpark  { from { transform: rotate(0deg)   translateX(62px) rotate(0deg);    } to { transform: rotate(360deg)  translateX(62px) rotate(-360deg);  } }
        @keyframes orbitSpark2 { from { transform: rotate(120deg) translateX(58px) rotate(-120deg); } to { transform: rotate(480deg)  translateX(58px) rotate(-480deg);  } }
        @keyframes orbitSpark3 { from { transform: rotate(240deg) translateX(54px) rotate(-240deg); } to { transform: rotate(600deg)  translateX(54px) rotate(-600deg);  } }
        @keyframes eyeBlink {
          0%,88%,100% { transform: scaleY(1);    }
          93%          { transform: scaleY(0.07); }
        }
      `}</style>

      {/* Orbiting sparkles */}
      <div style={{ position:"absolute", top:"50%", left:"50%", width:0, height:0, zIndex:3 }}>
        <div style={{ position:"absolute", width:9, height:9, borderRadius:"50%", top:-4, left:-4, background:"#FFD740", boxShadow:"0 0 8px 2px #FFD740", animation:"orbitSpark  3.5s linear infinite" }} />
        <div style={{ position:"absolute", width:7, height:7, borderRadius:"50%", top:-3, left:-3, background:"#42A5F5", boxShadow:"0 0 8px 2px #42A5F5", animation:"orbitSpark2 3.5s linear infinite" }} />
        <div style={{ position:"absolute", width:5, height:5, borderRadius:"50%", top:-2, left:-2, background:"#FF7043", boxShadow:"0 0 6px 2px #FF7043", animation:"orbitSpark3 3.5s linear infinite" }} />
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
              <stop offset="100%" stopColor="#1565C0" />
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
            <rect x="45" y="72" width="10" height="10" rx="3" fill="#1A237E"
              style={{ transformOrigin:"50px 77px", animation:"eyeBlink 4s ease-in-out infinite" }} />
            <rect x={47 + eyeOff.x} y={73 + eyeOff.y} width="6" height="6" rx="2" fill="#42A5F5" />
            <rect x={48 + eyeOff.x} y={74 + eyeOff.y} width="2" height="2" rx="1" fill="rgba(255,255,255,0.85)" />

            {/* Right eye */}
            <rect x="75" y="72" width="10" height="10" rx="3" fill="#1A237E"
              style={{ transformOrigin:"80px 77px", animation:"eyeBlink 4s ease-in-out 0.15s infinite" }} />
            <rect x={77 + eyeOff.x} y={73 + eyeOff.y} width="6" height="6" rx="2" fill="#42A5F5" />
            <rect x={78 + eyeOff.x} y={74 + eyeOff.y} width="2" height="2" rx="1" fill="rgba(255,255,255,0.85)" />

            {/* Smile — wider when cursor is close */}
            <path d={smile ? "M48,87 Q65,98 82,87" : "M52,86 Q65,92 78,86"}
              stroke="#FFD740" strokeWidth="2.5" fill="none" strokeLinecap="round"
              style={{ transition:"d 0.3s ease" }} />

            {/* Blush */}
            <ellipse cx="43" cy="84" rx="7" ry="4" fill="rgba(255,112,67,0.35)" opacity={smile ? 0.8 : 0.35} />
            <ellipse cx="87" cy="84" rx="7" ry="4" fill="rgba(255,112,67,0.35)" opacity={smile ? 0.8 : 0.35} />
          </g>
        </svg>

        {/* Shadow */}
        <div style={{ width:70, height:14, borderRadius:"50%", background:"rgba(92,53,204,0.25)", margin:"-10px auto 0", animation:"shadowPulse 3.2s ease-in-out infinite", filter:"blur(6px)" }} />
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
        @keyframes scrollBounce { 0%,100% { transform:translateY(0); } 50% { transform:translateY(6px); } }
      `}</style>

      {/* ── GITHUB-STYLE CENTRED HERO — mascot + headline + CTA ── */}
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #0D1117 0%, #0D1117 70%, #161B22 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px 60px",
        position: "relative",
        overflow: "hidden",
      }}>

        {/* Subtle radial glow behind mascot */}
        <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translate(-50%,-50%)", width:400, height:400, borderRadius:"50%", background:"radial-gradient(circle, rgba(92,53,204,0.18) 0%, transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translate(-50%,-50%)", width:600, height:600, borderRadius:"50%", background:"radial-gradient(circle, rgba(21,101,192,0.10) 0%, transparent 70%)", pointerEvents:"none" }} />

        {/* Mascot — centred */}
        <div style={{ animation:"heroFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both", marginBottom:8, transform:"scale(1.3)" }}>
          <StarMascot />
        </div>

        {/* Headline */}
        <h1 style={{
          fontFamily:"'Fredoka One', cursive",
          fontSize: "clamp(2rem, 6vw, 3.6rem)",
          color: "#E3F2FD",
          lineHeight: 1.15,
          maxWidth: 640,
          margin: "0 auto 16px",
          animation: "heroFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.2s both",
        }}>
          {t(lang, "home.title")}
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: "1.05rem",
          fontWeight: 600,
          color: "#8B949E",
          maxWidth: 480,
          margin: "0 auto 36px",
          lineHeight: 1.6,
          animation: "heroFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.3s both",
        }}>
          {lang==="ru" ? "Пройди тест, узнай свои таланты и найди идеальную карьеру с помощью AI"
           : lang==="uz" ? "Test o'ting, iste'dodlaringizni biling va AI yordamida ideal karerangizni toping"
           : "Take the quiz, discover your talents and find your ideal career with AI"}
        </p>

        {/* CTA buttons */}
        <div style={{ display:"flex", gap:14, justifyContent:"center", flexWrap:"wrap", animation:"heroFadeUp 0.7s cubic-bezier(0.22,1,0.36,1) 0.4s both" }}>
          <button
            onClick={() => setPage("quiz")}
            style={{ padding:"14px 32px", background:"linear-gradient(135deg,#7C4DFF,#5C35CC)", color:"#fff", border:"none", borderRadius:50, fontFamily:"'Fredoka One',cursive", fontSize:"1.1rem", cursor:"pointer", boxShadow:"0 6px 24px rgba(92,53,204,0.45)", transition:"transform 0.2s, box-shadow 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px)"; e.currentTarget.style.boxShadow="0 12px 32px rgba(92,53,204,0.6)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform=""; e.currentTarget.style.boxShadow="0 6px 24px rgba(92,53,204,0.45)"; }}
          >
            {t(lang, "home.cta")} →
          </button>
          <button
            onClick={() => setPage("tasks")}
            style={{ padding:"14px 32px", background:"transparent", color:"#E3F2FD", border:"1.5px solid rgba(255,255,255,0.2)", borderRadius:50, fontFamily:"'Fredoka One',cursive", fontSize:"1.1rem", cursor:"pointer", transition:"all 0.2s", backdropFilter:"blur(8px)" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.5)"; e.currentTarget.style.background="rgba(255,255,255,0.05)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="rgba(255,255,255,0.2)"; e.currentTarget.style.background="transparent"; }}
          >
            {lang==="ru"?"Попробовать игры":lang==="uz"?"O'yinlarni sinash":"Try mini-games"}
          </button>
        </div>

        {/* Scroll indicator */}
        <div style={{ position:"absolute", bottom:32, left:"50%", transform:"translateX(-50%)", display:"flex", flexDirection:"column", alignItems:"center", gap:6, animation:"heroFadeUp 0.7s ease 0.8s both" }}>
          <span style={{ fontSize:"0.72rem", fontWeight:700, color:"#484F58", letterSpacing:"0.1em", textTransform:"uppercase" }}>
            {lang==="ru"?"Листай вниз":lang==="uz"?"Pastga suring":"Scroll down"}
          </span>
          <div style={{ width:24, height:38, border:"2px solid rgba(255,255,255,0.15)", borderRadius:99, display:"flex", justifyContent:"center", paddingTop:6 }}>
            <div style={{ width:4, height:8, background:"rgba(255,255,255,0.4)", borderRadius:99, animation:"scrollBounce 1.6s ease-in-out infinite" }} />
          </div>
        </div>
      </div>

      {/* Logo slider */}
      <div style={{ padding:"28px 0 8px", overflow:"hidden", background: dark?"#0F1923":"#F0F7FF" }}>
        <p style={{ textAlign:"center", fontSize:"0.78rem", fontWeight:800, color: dark?"#484F58":"#B0BEC5", letterSpacing:"0.10em", textTransform:"uppercase", marginBottom:16 }}>
          {lang==="ru"?"Наши партнёры и платформы":lang==="uz"?"Bizning hamkorlar va platformalar":"Our partners & platforms"}
        </p>
        <div style={{ position:"relative", overflow:"hidden" }}>
          <div style={{ position:"absolute", top:0, bottom:0, left:0, width:80, zIndex:2, pointerEvents:"none", background: dark?"linear-gradient(to right,#0F1923,transparent)":"linear-gradient(to right,#F0F7FF,transparent)" }} />
          <div style={{ position:"absolute", top:0, bottom:0, right:0, width:80, zIndex:2, pointerEvents:"none", background: dark?"linear-gradient(to left,#0F1923,transparent)":"linear-gradient(to left,#F0F7FF,transparent)" }} />
          <div style={{ display:"flex", gap:16, width:"max-content", animation:"infiniteScroll 28s linear infinite", padding:"8px 0" }}>
            {TRACK.map((item, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", gap:10, background: dark?"#1A2A3A":"#fff", borderRadius:16, padding:"12px 20px", border: dark?"1.5px solid #2A4070":"1.5px solid #E3F2FD", whiteSpace:"nowrap", userSelect:"none" }}>
                <span style={{ fontSize:"1.4rem" }}>{item.emoji}</span>
                <span style={{ fontSize:"0.88rem", fontWeight:800, color: dark?"#90CAF9":"#1A237E", fontFamily:"'Nunito',sans-serif" }}>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Demo — GitHub Copilot style */}
      <AIDemoSection lang={lang} dark={dark} />

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
      <div style={{ textAlign:"center", padding:"60px 24px 80px", background: dark?"linear-gradient(135deg,#1A2A3A,#0F1923)":"linear-gradient(135deg,#E3F2FD,#FFF8E1)" }}>
        <div style={{ fontSize:"2.8rem", marginBottom:16 }}>🌟</div>
        <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2rem", color: dark?"#E3F2FD":"#1565C0", marginBottom:12 }}>
          {lang==="ru"?"Готов узнать свои таланты?":lang==="uz"?"Iste'dodingizni bilishga tayyormisiz?":"Ready to discover your talents?"}
        </h2>
        <p style={{ color: dark?"#90CAF9":"#78909C", fontWeight:600, marginBottom:28 }}>
          {lang==="ru"?"Пройди тест за 5 минут!":lang==="uz"?"5 daqiqada testni o'ting!":"Take the 5-minute quiz!"}
        </p>
        <button className="hero-cta" onClick={() => setPage("quiz")}>{t(lang,"home.cta")} →</button>
      </div>
    </div>
  );
}
