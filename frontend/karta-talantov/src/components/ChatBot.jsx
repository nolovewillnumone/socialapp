import { useState, useRef, useEffect } from "react";

// ── Peaceful chime sound (Web Audio API — no file needed) ─────────────────────
function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const times = [0, 0.18, 0.36];
    const freqs  = [523.25, 659.25, 783.99]; // C5 E5 G5 — major chord
    times.forEach((t, i) => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.value = freqs[i];
      gain.gain.setValueAtTime(0, ctx.currentTime + t);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 1.2);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 1.3);
    });
  } catch {}
}

// ── Animated star button ──────────────────────────────────────────────────────
function StarButton({ onClick, unread, open }) {
  return (
    <div onClick={onClick} style={{
      position:"fixed", bottom:28, right:24, zIndex:9999, cursor:"pointer",
      width:60, height:60, borderRadius:"50%",
      background:"linear-gradient(135deg,#0F6E56,#1D9E75,#5DCAA5)",
      boxShadow: open
        ? "0 8px 32px rgba(15,110,86,0.5)"
        : "0 6px 24px rgba(15,110,86,0.45), 0 0 0 0 rgba(93,202,165,0.4)",
      display:"flex", alignItems:"center", justifyContent:"center",
      transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
      animation: open ? "none" : "starPulse 2.5s ease-in-out infinite",
    }}
    onMouseEnter={e => { e.currentTarget.style.transform="scale(1.12)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; }}
    >
      {/* Star SVG — matches homepage star */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
        <path
          d="M14 2 L16.5 10.5 L25 11 L18.5 16.5 L20.5 25 L14 20.5 L7.5 25 L9.5 16.5 L3 11 L11.5 10.5 Z"
          fill={open ? "rgba(255,255,255,0.6)" : "#EF9F27"}
          stroke="#fff"
          strokeWidth="1.2"
          strokeLinejoin="round"
          style={{ transition:"fill 0.3s", filter: open ? "none" : "drop-shadow(0 0 6px rgba(239,159,39,0.8))" }}
        />
      </svg>
      {/* Unread badge */}
      {!open && unread > 0 && (
        <div style={{
          position:"absolute", top:-3, right:-3,
          width:20, height:20, borderRadius:"50%",
          background:"#EF9F27", border:"2px solid #fff",
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:"0.65rem", fontWeight:900, color:"#fff",
          animation:"badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>
          {unread}
        </div>
      )}
    </div>
  );
}

// ── Main ChatBot ──────────────────────────────────────────────────────────────
export default function ChatBot({ lang, dark, results }) {
  const [open,      setOpen]      = useState(false);
  const [msgs,      setMsgs]      = useState([]);
  const [input,     setInput]     = useState("");
  const [loading,   setLoading]   = useState(false);
  const [unread,    setUnread]    = useState(0);
  const [appeared,  setAppeared]  = useState(false);
  const bottomRef   = useRef(null);
  const inputRef    = useRef(null);
  const greeted     = useRef(false);

  const L = {
    ru:{ title:"AI Советник", sub:"Онлайн · отвечаю мгновенно",
         placeholder:"Напиши что-нибудь...",
         welcome:"Привет! 🌟 Я твой AI-советник по талантам. Спроси меня о своих способностях, карьере или университетах!",
         suggestions:["Какая карьера мне подойдёт?","Как развить логику?","Лучшие университеты","Что такое EQ?"] },
    uz:{ title:"AI Maslahatchi", sub:"Onlayn · darhol javob beraman",
         placeholder:"Yozing...",
         welcome:"Salom! 🌟 Men sizning iste'dod bo'yicha AI-maslahatchimanman. Qobiliyatlar, kasblar yoki universitetlar haqida so'rang!",
         suggestions:["Menga qanday kasb mos?","Mantiqni qanday rivojlantirish?","Eng yaxshi universitetlar","EQ nima?"] },
    en:{ title:"AI Advisor", sub:"Online · replies instantly",
         placeholder:"Ask me anything...",
         welcome:"Hi! 🌟 I'm your AI talent advisor. Ask me about your abilities, careers or universities!",
         suggestions:["What career suits me?","How to develop logic?","Best universities","What is EQ?"] },
  }[lang] || {};

  // Appear after 5 seconds with chime
  useEffect(() => {
    const t = setTimeout(() => {
      setAppeared(true);
      setUnread(1);
      playChime();
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  // Welcome message on first open
  useEffect(() => {
    if (open && !greeted.current) {
      greeted.current = true;
      setUnread(0);
      setMsgs([{ role:"ai", text: L.welcome, ts: Date.now() }]);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
    if (open) setUnread(0);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [msgs, loading]);

  const buildSystem = () => {
    const scores    = results?.scores || {};
    const topTalents = Object.entries(scores).sort((a,b)=>b[1]-a[1]).slice(0,3)
      .map(([k,v])=>`${k}: ${Math.round(v)}%`).join(", ");
    const careers   = results?.careers?.slice(0,3).map(c=>c.name).join(", ") || "";
    const rl        = lang==="ru"?"Russian":lang==="uz"?"Uzbek":"English";
    return `You are a warm, encouraging AI talent advisor for children aged 8–16 on Karta Talantov.
Always respond in ${rl}. Keep answers SHORT: 2-3 sentences max unless asked for more. Use 1 emoji naturally.
You know Gardner's Multiple Intelligences, 35+ career paths, top universities worldwide and in Central Asia (INHA, NUUz, Westminster Tashkent).
${topTalents?`This user's top talents: ${topTalents}.`:""}
${careers?`Their top careers: ${careers}.`:""}
Be specific, actionable, age-appropriate. Never lecture. If unrelated, gently redirect to talents/careers.`;
  };

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput("");

    const history = [...msgs, { role:"user", text:q, ts:Date.now() }];
    setMsgs(history);
    setLoading(true);

    try {
      const claudeMsgs = history.map(m => ({
        role:    m.role === "ai" ? "assistant" : "user",
        content: m.text,
      }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method:"POST",
        headers:{ "Content-Type":"application/json" },
        body: JSON.stringify({
          model:      "claude-sonnet-4-20250514",
          max_tokens: 300,
          system:     buildSystem(),
          messages:   claudeMsgs,
        }),
      });

      const data  = await res.json();
      const reply = data.content?.[0]?.text ||
        (lang==="ru"?"Извини, попробуй ещё раз!":lang==="uz"?"Qayta urinib ko'ring!":"Try again!");

      setMsgs(prev => [...prev, { role:"ai", text:reply, ts:Date.now() }]);
    } catch {
      setMsgs(prev => [...prev, { role:"ai",
        text: lang==="ru"?"Извини, ошибка. Попробуй ещё раз! 🙏":
              lang==="uz"?"Xato yuz berdi. Qayta urinib ko'ring! 🙏":
              "Error. Please try again! 🙏",
        ts:Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  const bg  = dark?"#1A2A3A":"#fff";
  const bdr = dark?"#2A4070":"#E1F5EE";
  const tc  = dark?"#E1F5EE":"#04342C";

  if (!appeared) return null;

  return (
    <>
      <style>{`
        @keyframes starPulse {
          0%,100% { box-shadow:0 6px 24px rgba(15,110,86,0.45),0 0 0 0 rgba(93,202,165,0.5); }
          50%      { box-shadow:0 8px 32px rgba(15,110,86,0.6),0 0 0 12px rgba(93,202,165,0); }
        }
        @keyframes chatSlideUp {
          from { opacity:0; transform:translateY(24px) scale(0.95); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
        @keyframes msgIn {
          from { opacity:0; transform:translateY(8px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes badgePop {
          from { transform:scale(0); }
          to   { transform:scale(1); }
        }
        @keyframes dotBounce {
          0%,80%,100% { transform:translateY(0); }
          40%          { transform:translateY(-5px); }
        }
        @keyframes starSpin {
          0%   { transform:rotate(0deg) scale(1); }
          50%  { transform:rotate(20deg) scale(1.1); }
          100% { transform:rotate(0deg) scale(1); }
        }
        .chat-send:hover:not(:disabled) { transform:scale(1.1)!important; box-shadow:0 6px 18px rgba(15,110,86,0.4)!important; }
        .chip:hover { background:linear-gradient(135deg,#0F6E56,#5DCAA5)!important; color:#fff!important; transform:translateY(-2px)!important; }
        .chat-input-field:focus { outline:none; border-color:#5DCAA5!important; box-shadow:0 0 0 3px rgba(93,202,165,0.15)!important; }
        .chat-close-btn:hover { background:rgba(255,255,255,0.25)!important; transform:rotate(90deg)!important; }
      `}</style>

      {/* Star button */}
      <StarButton onClick={() => setOpen(o=>!o)} unread={unread} open={open} />

      {/* Chat window */}
      {open && (
        <div style={{
          position:"fixed", bottom:100, right:24, zIndex:9998,
          width: Math.min(356, (typeof window!=="undefined"?window.innerWidth:400) - 32),
          height: 480,
          background: bg,
          borderRadius: 24,
          border: `1.5px solid ${bdr}`,
          boxShadow: "0 24px 64px rgba(0,0,0,0.18), 0 4px 16px rgba(15,110,86,0.12)",
          display:"flex", flexDirection:"column", overflow:"hidden",
          animation:"chatSlideUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>

          {/* Header */}
          <div style={{ background:"linear-gradient(135deg,#0F6E56,#1D9E75)", padding:"13px 16px", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
            {/* Animated star icon */}
            <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="20" height="20" viewBox="0 0 28 28" style={{ animation:"starSpin 4s ease-in-out infinite" }}>
                <path d="M14 2 L16.5 10.5 L25 11 L18.5 16.5 L20.5 25 L14 20.5 L7.5 25 L9.5 16.5 L3 11 L11.5 10.5 Z"
                  fill="#EF9F27" stroke="#fff" strokeWidth="1" strokeLinejoin="round"/>
              </svg>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1rem", color:"#fff", lineHeight:1.2 }}>{L.title}</div>
              <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.75)", fontWeight:600, display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#A5D6A7", display:"inline-block" }}/>
                {L.sub}
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setOpen(false)}
              style={{ border:"none", background:"rgba(255,255,255,0.12)", color:"#fff", borderRadius:"50%", width:28, height:28, cursor:"pointer", fontSize:"0.9rem", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.25s", flexShrink:0 }}>
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"14px 12px 8px", display:"flex", flexDirection:"column", gap:10 }}>
            {msgs.map((msg, i) => (
              <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", flexDirection: msg.role==="ai"?"row":"row-reverse", animation:"msgIn 0.3s ease both" }}>
                {msg.role==="ai" && (
                  <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#0F6E56,#5DCAA5)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <svg width="14" height="14" viewBox="0 0 28 28">
                      <path d="M14 2 L16.5 10.5 L25 11 L18.5 16.5 L20.5 25 L14 20.5 L7.5 25 L9.5 16.5 L3 11 L11.5 10.5 Z"
                        fill="#EF9F27" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
                <div style={{
                  maxWidth:"78%", padding:"9px 13px",
                  background: msg.role==="ai"
                    ? dark?"rgba(93,202,165,0.10)":"linear-gradient(135deg,#E8F5EE,#F1FFF8)"
                    : "linear-gradient(135deg,#EF9F27,#FAC775)",
                  color: msg.role==="ai" ? tc : "#fff",
                  borderRadius: msg.role==="ai"?"4px 16px 16px 16px":"16px 4px 16px 16px",
                  fontSize:"0.85rem", fontWeight:600, lineHeight:1.6,
                  whiteSpace:"pre-wrap",
                  boxShadow: msg.role==="ai"?"0 2px 8px rgba(15,110,86,0.07)":"0 2px 10px rgba(239,159,39,0.25)",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing dots */}
            {loading && (
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#0F6E56,#5DCAA5)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="14" height="14" viewBox="0 0 28 28"><path d="M14 2 L16.5 10.5 L25 11 L18.5 16.5 L20.5 25 L14 20.5 L7.5 25 L9.5 16.5 L3 11 L11.5 10.5 Z" fill="#EF9F27" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round"/></svg>
                </div>
                <div style={{ background: dark?"rgba(93,202,165,0.10)":"#E8F5EE", padding:"10px 16px", borderRadius:"4px 16px 16px 16px", display:"flex", gap:5 }}>
                  {[0,1,2].map(d => <div key={d} style={{ width:7, height:7, borderRadius:"50%", background:"#5DCAA5", animation:`dotBounce 1.2s ease-in-out ${d*0.15}s infinite` }}/>)}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Suggestion chips */}
          {msgs.length <= 1 && !loading && (
            <div style={{ padding:"0 10px 8px", display:"flex", flexWrap:"wrap", gap:6 }}>
              {L.suggestions?.map((s,i) => (
                <button key={i} className="chip" onClick={() => send(s)}
                  style={{ border:`1.5px solid ${bdr}`, background: dark?"#1A2A3A":"#F8FFFE", color: dark?"#9FE1CB":"#0F6E56", borderRadius:99, padding:"5px 12px", fontSize:"0.74rem", fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif", transition:"all 0.2s" }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding:"10px 12px", borderTop:`1px solid ${bdr}`, display:"flex", gap:8, flexShrink:0, background: dark?"#1A2A3A":bg }}>
            <input ref={inputRef} className="chat-input-field"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==="Enter" && !e.shiftKey && send()}
              placeholder={L.placeholder}
              disabled={loading}
              style={{ flex:1, padding:"10px 14px", border:`1.5px solid ${bdr}`, borderRadius:12, fontFamily:"'Nunito',sans-serif", fontWeight:600, fontSize:"0.88rem", color:tc, background: dark?"#0F1923":"#FAFFFE", transition:"all 0.2s" }}
            />
            <button className="chat-send" onClick={() => send()} disabled={!input.trim()||loading}
              style={{ width:40, height:40, borderRadius:12, border:"none", flexShrink:0, cursor: input.trim()&&!loading?"pointer":"default", fontSize:"1.1rem", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s",
                background: input.trim()&&!loading?"linear-gradient(135deg,#0F6E56,#5DCAA5)":"#E1F5EE",
                color: input.trim()&&!loading?"#fff":"#90A4AE",
                boxShadow: input.trim()&&!loading?"0 4px 14px rgba(15,110,86,0.3)":"none",
              }}>
              {loading?"⏳":"→"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
