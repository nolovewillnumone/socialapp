import { useState, useRef, useEffect } from "react";

// ── Chatbot Component ─────────────────────────────────────────────────────────
export default function ChatBot({ lang, dark, results }) {
  const [open, setOpen]       = useState(false);
  const [msgs, setMsgs]       = useState([]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread]   = useState(1); // show 1 unread to attract attention
  const bottomRef             = useRef(null);
  const inputRef              = useRef(null);

  const L = {
    ru: {
      title:       "AI Советник",
      subtitle:    "Спроси о своих талантах",
      placeholder: "Спроси что-нибудь...",
      welcome:     `Привет! 👋 Я твой AI-советник по талантам. Я знаю о теории множественного интеллекта Гарднера (Гарвард) и могу помочь тебе понять свои способности, выбрать карьеру или найти курсы.\n\nО чём хочешь спросить?`,
      thinking:    "Думаю...",
      send:        "Отправить",
      suggestions: ["Какая карьера мне подойдёт?", "Как развить логику?", "Лучшие университеты для меня", "Что такое IQ и EQ?"],
    },
    uz: {
      title:       "AI Maslahatchi",
      subtitle:    "Iste'dodlaring haqida so'ra",
      placeholder: "Biror narsa so'rang...",
      welcome:     `Salom! 👋 Men sizning iste'dod bo'yicha AI-maslahatchimanman. Gardner nazariyasi (Harvard) bo'yicha qobiliyatlaringizni tushunishga yordam beraman.\n\nNima haqida so'ramoqchisiz?`,
      thinking:    "O'ylamoqda...",
      send:        "Yuborish",
      suggestions: ["Menga qanday kasb mos?", "Mantiqni qanday rivojlantirish?", "Eng yaxshi universitetlar", "IQ va EQ nima?"],
    },
    en: {
      title:       "AI Advisor",
      subtitle:    "Ask about your talents",
      placeholder: "Ask me anything...",
      welcome:     `Hi! 👋 I'm your AI talent advisor. I know about Gardner's Multiple Intelligences theory (Harvard) and can help you understand your abilities, choose a career, or find courses.\n\nWhat would you like to ask?`,
      thinking:    "Thinking...",
      send:        "Send",
      suggestions: ["What career suits me?", "How to develop logic?", "Best universities for me", "What is IQ vs EQ?"],
    },
  }[lang] || {};

  // Show welcome message when opened first time
  useEffect(() => {
    if (open && msgs.length === 0) {
      setMsgs([{ role:"ai", text: L.welcome, ts: Date.now() }]);
      setUnread(0);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [msgs, loading]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
      setUnread(0);
    }
  }, [open]);

  const send = async (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput("");

    const newMsgs = [...msgs, { role:"user", text:q, ts: Date.now() }];
    setMsgs(newMsgs);
    setLoading(true);

    try {
      const history = newMsgs.slice(-10).map(m => ({
        role: m.role === "ai" ? "assistant" : "user",
        text: m.text,
      }));

      const response = await fetch("https://karta-talantov-backend.onrender.com/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history,
          lang:     lang,
          scores:   results?.scores || {},
        }),
      });

      const data = await response.json();
      const reply = data.reply || "Sorry, I couldn't respond. Try again!";
      setMsgs(prev => [...prev, { role:"ai", text:reply, ts: Date.now() }]);
    } catch {
      setMsgs(prev => [...prev, { role:"ai", text: lang==="ru"?"Извини, произошла ошибка. Попробуй ещё раз! 🙏":lang==="uz"?"Kechirasiz, xato yuz berdi. Qayta urinib ko'ring! 🙏":"Sorry, an error occurred. Please try again! 🙏", ts: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  const bg    = dark ? "#1A2A3A" : "#fff";
  const border = dark ? "#2A4070" : "#E3F2FD";
  const textCol = dark ? "#E3F2FD" : "#1A237E";
  const mutedCol = dark ? "#607D8B" : "#90A4AE";

  return (
    <>
      <style>{`
        @keyframes botPop { from{opacity:0;transform:scale(0.5) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        @keyframes msgIn  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes pulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }
        @keyframes dotBounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        .chat-input:focus { outline:none; border-color:#42A5F5 !important; box-shadow:0 0 0 3px rgba(66,165,245,0.15) !important; }
        .suggestion-chip:hover { background:linear-gradient(135deg,#1565C0,#42A5F5) !important; color:#fff !important; transform:translateY(-2px) !important; box-shadow:0 4px 14px rgba(21,101,192,0.3) !important; }
        .send-btn:hover:not(:disabled) { transform:scale(1.1) !important; box-shadow:0 6px 18px rgba(21,101,192,0.4) !important; }
        .chat-close:hover { background:rgba(255,255,255,0.2) !important; transform:rotate(90deg) !important; }
        .chat-msg-ai { animation: msgIn 0.3s ease both; }
        .chat-msg-user { animation: msgIn 0.3s ease both; }
      `}</style>

      {/* ── Floating button ── */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          position:"fixed", bottom:80, right:20, zIndex:9999,
          width:56, height:56, borderRadius:"50%",
          background:"linear-gradient(135deg,#1565C0,#42A5F5)",
          boxShadow:"0 6px 24px rgba(21,101,192,0.45)",
          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          animation: open ? "none" : "pulse 2.5s ease-in-out infinite",
        }}
        onMouseEnter={e => { e.currentTarget.style.transform="scale(1.15)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform="scale(1)"; }}
      >
        <span style={{ fontSize:"1.6rem", lineHeight:1 }}>{open ? "✕" : "🤖"}</span>
        {/* Unread badge */}
        {!open && unread > 0 && (
          <div style={{ position:"absolute", top:-2, right:-2, width:18, height:18, borderRadius:"50%", background:"#FF7043", border:"2px solid #fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.65rem", fontWeight:900, color:"#fff" }}>
            {unread}
          </div>
        )}
      </div>

      {/* ── Chat window ── */}
      {open && (
        <div style={{
          position:"fixed", bottom:148, right:20, zIndex:9998,
          width: Math.min(360, window.innerWidth - 32),
          height:480,
          background:bg,
          borderRadius:24,
          border:`1.5px solid ${border}`,
          boxShadow:"0 24px 64px rgba(0,0,0,0.2)",
          display:"flex", flexDirection:"column",
          overflow:"hidden",
          animation:"botPop 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>

          {/* Header */}
          <div style={{ background:"linear-gradient(135deg,#1565C0,#42A5F5)", padding:"14px 18px", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.2rem", flexShrink:0 }}>🤖</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1rem", color:"#fff" }}>{L.title}</div>
              <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.8)", fontWeight:600 }}>{L.subtitle}</div>
            </div>
            <button className="chat-close" onClick={() => setOpen(false)}
              style={{ border:"none", background:"rgba(255,255,255,0.15)", color:"#fff", borderRadius:"50%", width:28, height:28, cursor:"pointer", fontSize:"0.9rem", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s", flexShrink:0 }}>
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"14px 14px 8px", display:"flex", flexDirection:"column", gap:10, scrollBehavior:"smooth" }}>
            {msgs.map((msg, i) => (
              <div key={i} className={msg.role==="ai" ? "chat-msg-ai" : "chat-msg-user"}
                style={{ display:"flex", gap:8, alignItems:"flex-start", flexDirection: msg.role==="ai" ? "row" : "row-reverse" }}>
                {msg.role==="ai" && (
                  <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#1565C0,#42A5F5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.85rem", flexShrink:0 }}>🤖</div>
                )}
                <div style={{
                  maxWidth:"78%",
                  background: msg.role==="ai"
                    ? (dark ? "rgba(66,165,245,0.12)" : "linear-gradient(135deg,#E3F2FD,#EEF6FF)")
                    : "linear-gradient(135deg,#FF7043,#FF8A65)",
                  color: msg.role==="ai" ? textCol : "#fff",
                  padding:"10px 13px",
                  borderRadius: msg.role==="ai" ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                  fontSize:"0.85rem", fontWeight:600, lineHeight:1.55,
                  boxShadow: msg.role==="ai" ? "0 2px 10px rgba(21,101,192,0.08)" : "0 2px 10px rgba(255,112,67,0.25)",
                  whiteSpace:"pre-wrap",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#1565C0,#42A5F5)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.85rem" }}>🤖</div>
                <div style={{ background: dark?"rgba(66,165,245,0.12)":"linear-gradient(135deg,#E3F2FD,#EEF6FF)", padding:"10px 16px", borderRadius:"4px 16px 16px 16px", display:"flex", gap:5, alignItems:"center" }}>
                  {[0,1,2].map(d => (
                    <div key={d} style={{ width:7, height:7, borderRadius:"50%", background:"#42A5F5", animation:`dotBounce 1.2s ease-in-out ${d*0.15}s infinite` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestion chips */}
          {msgs.length <= 1 && !loading && (
            <div style={{ padding:"0 12px 8px", display:"flex", flexWrap:"wrap", gap:6 }}>
              {L.suggestions?.map((s, i) => (
                <button key={i} className="suggestion-chip"
                  onClick={() => send(s)}
                  style={{ border:`1.5px solid ${border}`, background: dark?"#1A2A3A":"#F8FBFF", color: dark?"#90CAF9":"#1565C0", borderRadius:99, padding:"5px 12px", fontSize:"0.76rem", fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif", transition:"all 0.2s" }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding:"10px 12px", borderTop:`1px solid ${border}`, display:"flex", gap:8, flexShrink:0, background: dark?"#1A2A3A":bg }}>
            <input
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==="Enter" && !e.shiftKey && send()}
              placeholder={L.placeholder}
              disabled={loading}
              style={{ flex:1, padding:"10px 14px", border:`1.5px solid ${border}`, borderRadius:12, fontFamily:"'Nunito',sans-serif", fontWeight:600, fontSize:"0.88rem", color: textCol, background: dark?"#0F1923":"#F8FBFF", transition:"all 0.2s" }}
            />
            <button
              className="send-btn"
              onClick={() => send()}
              disabled={!input.trim() || loading}
              style={{ width:40, height:40, borderRadius:12, border:"none", background: input.trim() && !loading ? "linear-gradient(135deg,#1565C0,#42A5F5)" : "#E3F2FD", color: input.trim() && !loading ? "#fff" : "#90A4AE", cursor: input.trim() && !loading ? "pointer" : "default", fontSize:"1.1rem", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s", flexShrink:0, boxShadow: input.trim() && !loading ? "0 4px 14px rgba(21,101,192,0.3)" : "none" }}>
              {loading ? "⏳" : "→"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
