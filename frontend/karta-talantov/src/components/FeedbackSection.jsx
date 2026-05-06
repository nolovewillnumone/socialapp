import { useState, useEffect } from "react";

const API = "https://karta-talantov-backend.onrender.com";

// ── Star Rating ───────────────────────────────────────────────────────────────
function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{ display:"flex", gap:6 }}>
      {[1,2,3,4,5].map(n => (
        <span key={n}
          onMouseEnter={() => setHovered(n)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(n)}
          style={{ fontSize:"1.8rem", cursor:"pointer", transition:"transform 0.15s cubic-bezier(0.34,1.56,0.64,1)", transform:(hovered||value)>=n?"scale(1.2)":"scale(1)", filter:(hovered||value)>=n?"none":"grayscale(1) opacity(0.4)" }}>
          ⭐
        </span>
      ))}
    </div>
  );
}

// ── Feedback Form ─────────────────────────────────────────────────────────────
export function FeedbackForm({ lang, dark, career = "", onDone }) {
  const [rating, setRating]   = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName]       = useState("");
  const [helpful, setHelpful] = useState(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [error, setError]     = useState(null);
  const [focused, setFocused] = useState(false);

  const L = {
    ru: {
      title:       "Оставь отзыв! 💬",
      sub:         "Твоё мнение помогает нам стать лучше",
      yourName:    "Твоё имя (необязательно)",
      helpful:     "Результат был полезен?",
      yes:         "Да, помогло! 👍",
      no:          "Не совсем 🤔",
      ratingLabel: "Оцени платформу:",
      placeholder: "Расскажи о своём опыте... (необязательно)",
      submit:      "Отправить отзыв →",
      thanks:      "Спасибо за отзыв! 🌟",
      thanksSub:   "Ты помогаешь нам стать лучше!",
      ratingErr:   "Поставь оценку от 1 до 5 ⭐",
    },
    uz: {
      title:       "Fikr qoldiring! 💬",
      sub:         "Sizning fikringiz bizni yaxshilashga yordam beradi",
      yourName:    "Ismingiz (ixtiyoriy)",
      helpful:     "Natija foydali bo'ldimi?",
      yes:         "Ha, yordam berdi! 👍",
      no:          "Unchalik emas 🤔",
      ratingLabel: "Platformani baholang:",
      placeholder: "Tajribangiz haqida gapiring... (ixtiyoriy)",
      submit:      "Fikr yuborish →",
      thanks:      "Fikr uchun rahmat! 🌟",
      thanksSub:   "Yaxshilashimizga yordam berdingiz!",
      ratingErr:   "1 dan 5 gacha baho bering ⭐",
    },
    en: {
      title:       "Leave feedback! 💬",
      sub:         "Your opinion helps us improve",
      yourName:    "Your name (optional)",
      helpful:     "Were the results helpful?",
      yes:         "Yes, it helped! 👍",
      no:          "Not really 🤔",
      ratingLabel: "Rate the platform:",
      placeholder: "Tell us about your experience... (optional)",
      submit:      "Submit feedback →",
      thanks:      "Thanks for your feedback! 🌟",
      thanksSub:   "You're helping us get better!",
      ratingErr:   "Please give a rating 1-5 ⭐",
    },
  }[lang] || {};

  const submit = async () => {
    if (!rating) { setError(L.ratingErr); return; }
    setError(null);
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      await fetch(`${API}/feedback`, {
        method: "POST",
        headers: { "Content-Type":"application/json" },
        body: JSON.stringify({
          name:       name.trim() || (user?.name || "Anonymous"),
          session_id: localStorage.getItem("session_id") || "",
          lang,
          rating,
          comment:    comment.trim(),
          career:     career || "",
          helpful:    helpful === null ? true : helpful,
        }),
      });
      setDone(true);
      onDone?.();
    } catch {
      setError(lang==="ru"?"Ошибка сети. Попробуй ещё раз.":lang==="uz"?"Tarmoq xatosi.":"Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div style={{ textAlign:"center", padding:"32px 24px", animation:"cardPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
      <div style={{ fontSize:"3.5rem", marginBottom:12 }}>🌟</div>
      <h3 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.5rem", color:"#0F6E56", marginBottom:8 }}>{L.thanks}</h3>
      <p style={{ color:"#78909C", fontWeight:600 }}>{L.thanksSub}</p>
    </div>
  );

  return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div>
        <p style={{ fontSize:"0.85rem", fontWeight:800, color:dark?"#9FE1CB":"#0F6E56", marginBottom:8 }}>{L.ratingLabel}</p>
        <StarRating value={rating} onChange={setRating} />
      </div>

      {/* Helpful toggle */}
      <div>
        <p style={{ fontSize:"0.85rem", fontWeight:800, color:dark?"#9FE1CB":"#0F6E56", marginBottom:8 }}>{L.helpful}</p>
        <div style={{ display:"flex", gap:10 }}>
          {[{val:true, label:L.yes},{val:false, label:L.no}].map(({val,label}) => (
            <button key={String(val)} onClick={() => setHelpful(val)}
              style={{ flex:1, padding:"10px 14px", border:`2px solid ${helpful===val?"#0F6E56":"#E1F5EE"}`, borderRadius:12, fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.88rem", cursor:"pointer", background:helpful===val?"linear-gradient(135deg,#0F6E56,#1D9E75)":"transparent", color:helpful===val?"#fff":dark?"#9FE1CB":"#546E7A", transition:"all 0.2s cubic-bezier(0.34,1.56,0.64,1)", transform:helpful===val?"scale(1.03)":"scale(1)" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Name */}
      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder={L.yourName}
        style={{ padding:"11px 14px", border:`2px solid ${dark?"#2A4070":"#E1F5EE"}`, borderRadius:12, fontFamily:"'Nunito',sans-serif", fontWeight:600, fontSize:"0.9rem", background:dark?"rgba(255,255,255,0.04)":"#fff", color:dark?"#E1F5EE":"#04342C", outline:"none" }}
      />

      {/* Comment */}
      <textarea
        value={comment}
        onChange={e => setComment(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={L.placeholder}
        rows={3}
        style={{ padding:"11px 14px", border:`2px solid ${focused?"#0F6E56":dark?"#2A4070":"#E1F5EE"}`, borderRadius:12, fontFamily:"'Nunito',sans-serif", fontWeight:600, fontSize:"0.9rem", background:dark?"rgba(255,255,255,0.04)":"#fff", color:dark?"#E1F5EE":"#04342C", outline:"none", resize:"none", transition:"border-color 0.2s", boxShadow:focused?"0 0 0 3px rgba(15,110,86,0.12)":"none" }}
      />

      {error && <div style={{ color:"#EF5350", fontSize:"0.85rem", fontWeight:700 }}>⚠️ {error}</div>}

      <button onClick={submit} disabled={loading}
        style={{ padding:"13px", background:loading?"#9FE1CB":"linear-gradient(135deg,#0F6E56,#1D9E75)", color:"#fff", border:"none", borderRadius:14, fontFamily:"'Fredoka One',cursive", fontSize:"1.05rem", cursor:loading?"wait":"pointer", boxShadow:"0 6px 20px rgba(15,110,86,0.3)", transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
        onMouseEnter={e => { if(!loading) e.currentTarget.style.transform="translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform=""; }}>
        {loading ? "⏳ ..." : L.submit}
      </button>
    </div>
  );
}

// ── Feedback Section (public reviews) ─────────────────────────────────────────
export function FeedbackSection({ lang, dark }) {
  const [reviews, setReviews]   = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats]       = useState(null);

  useEffect(() => {
    fetch(`${API}/feedback/public?limit=6`)
      .then(r => r.json())
      .then(data => setReviews(Array.isArray(data) ? data : []))
      .catch(() => {});
    fetch(`${API}/analytics/summary`)
      .then(r => r.json())
      .then(setStats)
      .catch(() => {});
    // Generate or retrieve session ID
    if (!localStorage.getItem("session_id")) {
      localStorage.setItem("session_id", Math.random().toString(36).slice(2));
    }
  }, []);

  const L = {
    ru: { title:"Что говорят пользователи", sub:"Реальные отзывы от детей и родителей", writeBtn:"Написать отзыв ✏️", close:"Закрыть", users:"пользователей", quizzes:"тестов пройдено", rating:"средняя оценка", noReviews:"Будь первым! Оставь отзыв 👆" },
    uz: { title:"Foydalanuvchilar nima deydi", sub:"Bolalar va ota-onalarning haqiqiy sharhlari", writeBtn:"Sharh yozish ✏️", close:"Yopish", users:"foydalanuvchi", quizzes:"test topshirildi", rating:"o'rtacha baho", noReviews:"Birinchi bo'ling! Sharh qoldiring 👆" },
    en: { title:"What users say", sub:"Real reviews from kids and parents", writeBtn:"Write a review ✏️", close:"Close", users:"users", quizzes:"quizzes taken", rating:"average rating", noReviews:"Be the first! Leave a review 👆" },
  }[lang] || {};

  const stars = (n) => "⭐".repeat(n);

  return (
    <div style={{ padding:"60px 24px", background:dark?"#0F1923":"#F1EFE8" }}>
      <div style={{ maxWidth:900, margin:"0 auto" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:36 }}>
          <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2rem", color:dark?"#E1F5EE":"#04342C", marginBottom:8 }}>{L.title}</h2>
          <p style={{ color:dark?"#9FE1CB":"#546E7A", fontWeight:600 }}>{L.sub}</p>
        </div>

        {/* Stats bar */}
        {stats && (
          <div style={{ display:"flex", gap:16, justifyContent:"center", flexWrap:"wrap", marginBottom:36 }}>
            {[
              { value: stats.total_users || 0,   label: L.users,   icon:"👥" },
              { value: stats.total_quizzes || 0, label: L.quizzes, icon:"📋" },
              { value: `${stats.avg_rating || 5}/5`, label: L.rating, icon:"⭐" },
            ].map((s,i) => (
              <div key={i} style={{ background:dark?"#1A2A3A":"#fff", borderRadius:16, padding:"16px 24px", textAlign:"center", border:`1.5px solid ${dark?"#2A4070":"#E1F5EE"}`, boxShadow:"0 4px 16px rgba(15,110,86,0.08)", minWidth:130 }}>
                <div style={{ fontSize:"1.6rem", marginBottom:4 }}>{s.icon}</div>
                <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.6rem", color:"#0F6E56" }}>{s.value}</div>
                <div style={{ fontSize:"0.75rem", fontWeight:700, color:dark?"#9FE1CB":"#78909C", textTransform:"uppercase", letterSpacing:"0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Review cards */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))", gap:16, marginBottom:32 }}>
          {reviews.length > 0 ? reviews.map((r,i) => (
            <div key={r.id} style={{ background:dark?"#1A2A3A":"#fff", borderRadius:18, padding:"20px", border:`1.5px solid ${dark?"#2A4070":"#E1F5EE"}`, boxShadow:"0 4px 16px rgba(15,110,86,0.07)", animation:`cardPop 0.4s cubic-bezier(0.34,1.56,0.64,1) ${i*0.07}s both` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div>
                  <div style={{ fontWeight:900, color:dark?"#E1F5EE":"#04342C", fontSize:"0.9rem" }}>{r.name}</div>
                  {r.career && <div style={{ fontSize:"0.75rem", color:"#0F6E56", fontWeight:700 }}>→ {r.career}</div>}
                </div>
                <div style={{ fontSize:"0.9rem" }}>{stars(r.rating)}</div>
              </div>
              {r.comment && <p style={{ fontSize:"0.85rem", fontWeight:600, color:dark?"#B0BEC5":"#546E7A", lineHeight:1.6, margin:0 }}>"{r.comment}"</p>}
              <div style={{ marginTop:10, fontSize:"0.72rem", color:"#9FE1CB", fontWeight:700 }}>{r.date}</div>
            </div>
          )) : (
            <div style={{ gridColumn:"1/-1", textAlign:"center", padding:"32px", color:dark?"#9FE1CB":"#78909C", fontWeight:700 }}>
              {L.noReviews}
            </div>
          )}
        </div>

        {/* Write review button / form */}
        {!showForm ? (
          <div style={{ textAlign:"center" }}>
            <button onClick={() => setShowForm(true)}
              style={{ padding:"13px 32px", background:"linear-gradient(135deg,#0F6E56,#1D9E75)", color:"#fff", border:"none", borderRadius:50, fontFamily:"'Fredoka One',cursive", fontSize:"1.05rem", cursor:"pointer", boxShadow:"0 6px 20px rgba(15,110,86,0.3)", transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
              onMouseEnter={e => { e.currentTarget.style.transform="translateY(-3px) scale(1.04)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform=""; }}>
              {L.writeBtn}
            </button>
          </div>
        ) : (
          <div style={{ background:dark?"#1A2A3A":"#fff", borderRadius:24, padding:"28px 24px", border:`1.5px solid ${dark?"#2A4070":"#E1F5EE"}`, boxShadow:"0 8px 32px rgba(15,110,86,0.12)", maxWidth:480, margin:"0 auto", animation:"cardPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h3 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.2rem", color:dark?"#9FE1CB":"#0F6E56", margin:0 }}>💬 {L.writeBtn.replace(" ✏️","")}</h3>
              <button onClick={() => setShowForm(false)} style={{ border:"none", background:"transparent", cursor:"pointer", fontSize:"1.2rem", color:"#78909C" }}>✕</button>
            </div>
            <FeedbackForm lang={lang} dark={dark} onDone={() => { setShowForm(false); setTimeout(() => { fetch(`${API}/feedback/public?limit=6`).then(r=>r.json()).then(d=>setReviews(Array.isArray(d)?d:[])).catch(()=>{}); }, 500); }} />
          </div>
        )}
      </div>
    </div>
  );
}
