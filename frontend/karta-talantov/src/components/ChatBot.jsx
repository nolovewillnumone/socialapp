import { useState, useRef, useEffect } from "react";

// ── Peaceful chime ────────────────────────────────────────────────────────────
function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    [[0,523.25],[0.18,659.25],[0.36,783.99]].forEach(([t,f]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.type = "sine"; osc.frequency.value = f;
      gain.gain.setValueAtTime(0, ctx.currentTime + t);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + t + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + t + 1.2);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 1.3);
    });
  } catch {}
}

// ── Rule-based replies ────────────────────────────────────────────────────────
const KB = {
  ru: {
    triggers: {
      "карьер":    "У нас 35+ профессий! Программист 💻, Дизайнер 🎨, Врач 🩺, Музыкант 🎵, Биолог 🌿, Юрист ⚖️, Психолог 🧠, Спортсмен 🏆 и многие другие. Пройди тест и получи персональные рекомендации!",
      "профессия": "У нас 35+ профессий! Программист 💻, Дизайнер 🎨, Врач 🩺, Музыкант 🎵, Биолог 🌿, Юрист ⚖️, Психолог 🧠, Спортсмен 🏆 и многие другие. Пройди тест и получи персональные рекомендации!",
      "талант":    "Мы измеряем 9 талантов: 🧠 Логика, 🎨 Творчество, 🃏 Память, 👑 Лидерство, 🌍 Языки, 🎵 Музыка, 🏃 Спорт, 🌿 Природа, 🤝 Общение. Пройди тест — это 7 минут!",
      "логик":     "Логический интеллект — основа IT, инженерии и науки! 🧠 Советую: LeetCode, CS50 (Harvard, бесплатно), Khan Academy математика.",
      "творчеств": "Творческий интеллект — это дизайн, искусство, кино! 🎨 Попробуй Figma (бесплатно), Canva Design School, Skillshare.",
      "музык":     "Музыкальный интеллект развивает весь мозг! 🎵 Начни с Simply Piano, Yousician или musictheory.net — все бесплатно.",
      "лидер":     "Лидерский интеллект — это CEO, дипломат, тренер! 👑 Советую: Toastmasters, курс Yale Emotional Intelligence на Coursera.",
      "язык":      "Лингвистический интеллект открывает весь мир! 🌍 Duolingo каждый день + italki для практики с носителями.",
      "спорт":     "Кинестетический интеллект — не просто тело, это дисциплина! 🏃 Nike Training Club бесплатно, Coursera Sports Science.",
      "природа":   "Натуралистический интеллект — биолог, эколог, ветеринар! 🌿 iNaturalist, Khan Academy биология, Coursera Ecology (Duke).",
      "память":    "Память можно тренировать! 🃏 Попробуй приложение Anki, метод Дворца памяти и курс Learning How to Learn на Coursera.",
      "универси":  "Топ университеты: 🇺🇸 MIT, Stanford, Harvard. 🇬🇧 Oxford, Cambridge. 🇺🇿 INHA Tashkent, NUUz, Westminster Tashkent. 🇷🇺 ВШЭ, ИТМО.",
      "тест":      "Тест состоит из 30 вопросов по 5 зонам. Нет правильных или неправильных ответов — просто отвечай честно! Занимает 7 минут 🌟",
      "бесплатн":  "Да, Karta Talantov полностью бесплатна — всегда! Никаких скрытых платежей 🎁",
      "привет":    "Привет! 👋 Я AI-советник Karta Talantov. Спроси меня о талантах, профессиях, университетах или тесте!",
      "помог":     "Я могу ответить на вопросы о: талантах, профессиях, университетах, тесте, курсах развития и многом другом!",
    },
    default: "Интересный вопрос! 🤔 Попробуй спросить о: талантах, профессиях, университетах, тесте или конкретном таланте (логика, музыка, спорт и т.д.)",
    welcome: "Привет! 🌟 Я твой AI-советник по талантам. Нажми на подсказку ниже или задай свой вопрос!",
    placeholder: "Напиши вопрос...",
    title: "AI Советник",
    sub: "Онлайн · отвечаю мгновенно",
    suggestions: ["Какие есть профессии?","Как развить логику?","Лучшие университеты","Что измеряет тест?","Это бесплатно?"],
  },
  uz: {
    triggers: {
      "kasb":      "Bizda 35+ kasb bor! Dasturchi 💻, Dizayner 🎨, Shifokor 🩺, Musiqachi 🎵, Biolog 🌿, Yurist ⚖️, Psixolog 🧠, Sportchi 🏆 va boshqalar. Testni topshiring!",
      "iste'dod":  "Biz 9 ta iste'dodni o'lchaymiz: 🧠 Mantiq, 🎨 Ijod, 🃏 Xotira, 👑 Liderlik, 🌍 Tillar, 🎵 Musiqa, 🏃 Sport, 🌿 Tabiat, 🤝 Muloqot.",
      "mantiq":    "Mantiqiy intellekt — IT, muhandislik va fan uchun asos! 🧠 LeetCode, CS50 (Harvard, bepul), Khan Academy matematika.",
      "ijod":      "Ijodiy intellekt — dizayn, san'at, kino! 🎨 Figma (bepul), Canva Design School, Skillshare.",
      "musiqa":    "Musiqiy intellekt butun miyani rivojlantiradi! 🎵 Simply Piano, Yousician yoki musictheory.net — hammasi bepul.",
      "lider":     "Liderlik intellekti — CEO, diplomat, murabbiy! 👑 Toastmasters, Yale Emotional Intelligence kursi (Coursera).",
      "til":       "Lingvistik intellekt butun dunyoni ochadi! 🌍 Duolingo har kuni + italki amaliyoti.",
      "sport":     "Kinestetik intellekt — bu nafaqat jismoniy, bu intizom! 🏃 Nike Training Club bepul.",
      "tabiat":    "Naturalist intellekti — biolog, ekolog, veterinar! 🌿 iNaturalist, Khan Academy biologiya.",
      "xotira":    "Xotirani mashq qilish mumkin! 🃏 Anki ilovasi, Xotira saroyi usuli va Coursera Learning How to Learn.",
      "universi":  "Top universitetlar: 🇺🇸 MIT, Stanford, Harvard. 🇬🇧 Oxford, Cambridge. 🇺🇿 INHA, NUUz, Westminster Toshkent.",
      "test":      "Test 30 savoldan iborat, 5 zona bo'yicha. To'g'ri yoki noto'g'ri javob yo'q — faqat halol javob bering! 7 daqiqa 🌟",
      "bepul":     "Ha, Karta Talantov to'liq bepul — har doim! Yashirin to'lovlar yo'q 🎁",
      "salom":     "Salom! 👋 Men Karta Talantov AI-maslahatchimanman. Iste'dodlar, kasblar yoki universitetlar haqida so'rang!",
    },
    default: "Qiziqarli savol! 🤔 So'rang: iste'dodlar, kasblar, universitetlar, test yoki aniq iste'dod haqida.",
    welcome: "Salom! 🌟 Men sizning iste'dod bo'yicha AI-maslahatchimanman. Quyidagi tugmalardan birini bosing yoki savol bering!",
    placeholder: "Savol yozing...",
    title: "AI Maslahatchi",
    sub: "Onlayn · darhol javob beraman",
    suggestions: ["Qanday kasblar bor?","Mantiqni rivojlantirish","Eng yaxshi universitetlar","Test nima o'lchaydi?","Bu bepulmi?"],
  },
  en: {
    triggers: {
      "career":    "We have 35+ careers! Programmer 💻, Designer 🎨, Doctor 🩺, Musician 🎵, Biologist 🌿, Lawyer ⚖️, Psychologist 🧠, Athlete 🏆 and many more. Take the quiz for personal recommendations!",
      "talent":    "We measure 9 talents: 🧠 Logic, 🎨 Creativity, 🃏 Memory, 👑 Leadership, 🌍 Languages, 🎵 Music, 🏃 Sport, 🌿 Nature, 🤝 Social. The quiz takes 7 minutes!",
      "logic":     "Logical intelligence is the foundation of IT, engineering and science! 🧠 Try LeetCode, CS50 (Harvard, free), Khan Academy maths.",
      "creativ":   "Creative intelligence covers design, art, film! 🎨 Try Figma (free), Canva Design School, Skillshare.",
      "music":     "Musical intelligence develops the whole brain! 🎵 Start with Simply Piano, Yousician or musictheory.net — all free.",
      "leader":    "Leadership intelligence — CEO, diplomat, coach! 👑 Try Toastmasters, Yale Emotional Intelligence on Coursera.",
      "language":  "Linguistic intelligence opens the whole world! 🌍 Duolingo daily + italki for native speaker practice.",
      "sport":     "Kinesthetic intelligence — not just physical, it's discipline! 🏃 Nike Training Club is free.",
      "nature":    "Naturalist intelligence — biologist, ecologist, vet! 🌿 iNaturalist, Khan Academy biology, Coursera Ecology.",
      "memory":    "Memory can be trained! 🃏 Try Anki app, the Memory Palace method and Learning How to Learn on Coursera.",
      "universi":  "Top universities: 🇺🇸 MIT, Stanford, Harvard. 🇬🇧 Oxford, Cambridge. 🇺🇿 INHA Tashkent, NUUz, Westminster Tashkent.",
      "quiz":      "The quiz has 30 questions across 5 zones. No right or wrong answers — just answer honestly! Takes 7 minutes 🌟",
      "free":      "Yes, Karta Talantov is completely free — always! No hidden fees 🎁",
      "hello":     "Hello! 👋 I'm the Karta Talantov AI advisor. Ask me about talents, careers, universities or the quiz!",
      "hi":        "Hi there! 👋 Ask me anything about your talents, careers or how the quiz works!",
    },
    default: "Interesting question! 🤔 Try asking about: talents, careers, universities, the quiz or a specific talent (logic, music, sport etc.)",
    welcome: "Hi! 🌟 I'm your AI talent advisor. Tap a suggestion below or type your own question!",
    placeholder: "Ask anything...",
    title: "AI Advisor",
    sub: "Online · replies instantly",
    suggestions: ["What careers are there?","How to develop logic?","Best universities","What does the quiz measure?","Is it free?"],
  },
};

function getReply(lang, msg) {
  const kb = KB[lang] || KB.en;
  const lower = msg.toLowerCase();
  for (const [key, reply] of Object.entries(kb.triggers)) {
    if (lower.includes(key)) return reply;
  }
  return kb.default;
}

// ── Star SVG ──────────────────────────────────────────────────────────────────
function StarIcon({ size=20, color="#EF9F27", spin=false }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28"
      style={spin ? { animation:"starSpin 4s ease-in-out infinite" } : {}}>
      <path d="M14 2 L16.5 10.5 L25 11 L18.5 16.5 L20.5 25 L14 20.5 L7.5 25 L9.5 16.5 L3 11 L11.5 10.5 Z"
        fill={color} stroke="#fff" strokeWidth="1.2" strokeLinejoin="round"/>
    </svg>
  );
}

// ── ChatBot ───────────────────────────────────────────────────────────────────
export default function ChatBot({ lang, dark, results }) {
  const [open,     setOpen]     = useState(false);
  const [msgs,     setMsgs]     = useState([]);
  const [input,    setInput]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const [unread,   setUnread]   = useState(0);
  const [appeared, setAppeared] = useState(false);
  const bottomRef  = useRef(null);
  const inputRef   = useRef(null);
  const greeted    = useRef(false);

  const kb = KB[lang] || KB.en;

  // Appear after 5s with chime
  useEffect(() => {
    const t = setTimeout(() => { setAppeared(true); setUnread(1); playChime(); }, 5000);
    return () => clearTimeout(t);
  }, []);

  // Welcome on first open
  useEffect(() => {
    if (open && !greeted.current) {
      greeted.current = true;
      setMsgs([{ role:"ai", text: kb.welcome }]);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
    if (open) setUnread(0);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:"smooth" });
  }, [msgs, loading]);

  const send = (text) => {
    const q = (text || input).trim();
    if (!q || loading) return;
    setInput("");
    const userMsg = { role:"user", text: q };
    setMsgs(prev => [...prev, userMsg]);
    setLoading(true);
    // Simulate typing delay
    setTimeout(() => {
      const reply = getReply(lang, q);
      setMsgs(prev => [...prev, { role:"ai", text: reply }]);
      setLoading(false);
    }, 600 + Math.random() * 400);
  };

  const bg  = dark ? "#1A2A3A" : "#fff";
  const bdr = dark ? "#2A4070" : "#E1F5EE";
  const tc  = dark ? "#E1F5EE" : "#04342C";

  if (!appeared) return null;

  return (
    <>
      <style>{`
        @keyframes starSpin { 0%,100%{transform:rotate(0deg) scale(1)} 50%{transform:rotate(20deg) scale(1.1)} }
        @keyframes starPulse {
          0%,100%{box-shadow:0 6px 24px rgba(15,110,86,0.45),0 0 0 0 rgba(93,202,165,0.5);}
          50%{box-shadow:0 8px 32px rgba(15,110,86,0.6),0 0 0 12px rgba(93,202,165,0);}
        }
        @keyframes chatUp { from{opacity:0;transform:translateY(20px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes msgIn  { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes badgePop { from{transform:scale(0)} to{transform:scale(1)} }
        @keyframes dotBounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-5px)} }
        @keyframes btnAppear { from{opacity:0;transform:scale(0.5) translateY(20px)} to{opacity:1;transform:scale(1) translateY(0)} }
        .chat-chip:hover { background:linear-gradient(135deg,#0F6E56,#5DCAA5)!important; color:#fff!important; transform:translateY(-2px)!important; box-shadow:0 4px 14px rgba(15,110,86,0.3)!important; }
        .chat-send:hover:not(:disabled) { transform:scale(1.1)!important; }
        .chat-inp:focus { outline:none; border-color:#5DCAA5!important; box-shadow:0 0 0 3px rgba(93,202,165,0.15)!important; }
        .chat-x:hover { background:rgba(255,255,255,0.25)!important; transform:rotate(90deg)!important; }
      `}</style>

      {/* ── Floating star button ── */}
      <div onClick={() => setOpen(o => !o)}
        style={{
          position:"fixed", bottom:28, right:24, zIndex:9999,
          width:58, height:58, borderRadius:"50%",
          background:"linear-gradient(135deg,#0F6E56,#1D9E75,#5DCAA5)",
          cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          animation: open ? "btnAppear 0.3s ease both" : "starPulse 2.5s ease-in-out infinite",
        }}
        onMouseEnter={e => e.currentTarget.style.transform="scale(1.12)"}
        onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
      >
        {open
          ? <span style={{ color:"#fff", fontSize:"1.2rem", fontWeight:700 }}>✕</span>
          : <StarIcon size={26} color="#EF9F27" />
        }
        {!open && unread > 0 && (
          <div style={{ position:"absolute", top:-3, right:-3, width:20, height:20, borderRadius:"50%", background:"#EF9F27", border:"2px solid #fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.65rem", fontWeight:900, color:"#fff", animation:"badgePop 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            {unread}
          </div>
        )}
      </div>

      {/* ── Chat window ── */}
      {open && (
        <div style={{
          position:"fixed", bottom:100, right:24, zIndex:9998,
          width: Math.min(356, window.innerWidth - 32), height:480,
          background:bg, borderRadius:24, border:`1.5px solid ${bdr}`,
          boxShadow:"0 24px 64px rgba(0,0,0,0.18)",
          display:"flex", flexDirection:"column", overflow:"hidden",
          animation:"chatUp 0.4s cubic-bezier(0.34,1.56,0.64,1) both",
        }}>

          {/* Header */}
          <div style={{ background:"linear-gradient(135deg,#0F6E56,#1D9E75)", padding:"13px 16px", display:"flex", alignItems:"center", gap:10, flexShrink:0 }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,0.15)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <StarIcon size={20} color="#EF9F27" spin />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1rem", color:"#fff" }}>{kb.title}</div>
              <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.75)", fontWeight:600, display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background:"#A5D6A7", display:"inline-block" }}/>
                {kb.sub}
              </div>
            </div>
            <button className="chat-x" onClick={() => setOpen(false)}
              style={{ border:"none", background:"rgba(255,255,255,0.12)", color:"#fff", borderRadius:"50%", width:28, height:28, cursor:"pointer", fontSize:"0.9rem", display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.25s", flexShrink:0 }}>
              ✕
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"14px 12px 8px", display:"flex", flexDirection:"column", gap:10 }}>
            {msgs.map((msg, i) => (
              <div key={i} style={{ display:"flex", gap:8, alignItems:"flex-start", flexDirection:msg.role==="ai"?"row":"row-reverse", animation:"msgIn 0.3s ease both" }}>
                {msg.role==="ai" && (
                  <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#0F6E56,#5DCAA5)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                    <StarIcon size={14} color="#EF9F27" />
                  </div>
                )}
                <div style={{
                  maxWidth:"78%", padding:"9px 13px",
                  background: msg.role==="ai" ? (dark?"rgba(93,202,165,0.10)":"linear-gradient(135deg,#E8F5EE,#F1FFF8)") : "linear-gradient(135deg,#EF9F27,#FAC775)",
                  color: msg.role==="ai" ? tc : "#fff",
                  borderRadius: msg.role==="ai" ? "4px 16px 16px 16px" : "16px 4px 16px 16px",
                  fontSize:"0.85rem", fontWeight:600, lineHeight:1.6, whiteSpace:"pre-wrap",
                  boxShadow: msg.role==="ai" ? "0 2px 8px rgba(15,110,86,0.07)" : "0 2px 10px rgba(239,159,39,0.25)",
                }}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                <div style={{ width:28, height:28, borderRadius:"50%", background:"linear-gradient(135deg,#0F6E56,#5DCAA5)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <StarIcon size={14} color="#EF9F27" />
                </div>
                <div style={{ background:dark?"rgba(93,202,165,0.10)":"#E8F5EE", padding:"10px 16px", borderRadius:"4px 16px 16px 16px", display:"flex", gap:5 }}>
                  {[0,1,2].map(d => <div key={d} style={{ width:7, height:7, borderRadius:"50%", background:"#5DCAA5", animation:`dotBounce 1.2s ease-in-out ${d*0.15}s infinite` }}/>)}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Suggestion chips */}
          {msgs.length <= 1 && !loading && (
            <div style={{ padding:"0 10px 8px", display:"flex", flexWrap:"wrap", gap:6 }}>
              {kb.suggestions.map((s,i) => (
                <button key={i} className="chat-chip" onClick={() => send(s)}
                  style={{ border:`1.5px solid ${bdr}`, background:dark?"#1A2A3A":"#F8FFFE", color:dark?"#9FE1CB":"#0F6E56", borderRadius:99, padding:"5px 12px", fontSize:"0.74rem", fontWeight:700, cursor:"pointer", fontFamily:"'Nunito',sans-serif", transition:"all 0.2s" }}>
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding:"10px 12px", borderTop:`1px solid ${bdr}`, display:"flex", gap:8, flexShrink:0, background:dark?"#1A2A3A":bg }}>
            <input ref={inputRef} className="chat-inp"
              value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key==="Enter" && !e.shiftKey && send()}
              placeholder={kb.placeholder} disabled={loading}
              style={{ flex:1, padding:"10px 14px", border:`1.5px solid ${bdr}`, borderRadius:12, fontFamily:"'Nunito',sans-serif", fontWeight:600, fontSize:"0.88rem", color:tc, background:dark?"#0F1923":"#FAFFFE", transition:"all 0.2s" }}
            />
            <button className="chat-send" onClick={() => send()} disabled={!input.trim()||loading}
              style={{ width:40, height:40, borderRadius:12, border:"none", flexShrink:0, transition:"all 0.2s", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.1rem",
                background: input.trim()&&!loading?"linear-gradient(135deg,#0F6E56,#5DCAA5)":"#E1F5EE",
                color: input.trim()&&!loading?"#fff":"#90A4AE",
                cursor: input.trim()&&!loading?"pointer":"default",
              }}>
              {loading?"⏳":"→"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}