import { useState, useEffect, useRef } from "react";
import Nav from "../components/Nav";

function fireConfetti() {
  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:9997;";
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const COLORS = ["#0F6E56","#1D9E75","#5DCAA5","#EF9F27","#FAC775","#7E57C2"];
  const particles = Array.from({length:80}, () => ({
    x: canvas.width*0.5+(Math.random()-0.5)*200, y: canvas.height*0.4,
    vx:(Math.random()-0.5)*8, vy:-(Math.random()*10+4),
    color:COLORS[Math.floor(Math.random()*COLORS.length)],
    size:Math.random()*8+4, rotation:Math.random()*360,
    spin:(Math.random()-0.5)*8, opacity:1,
    shape:Math.random()>0.5?"rect":"circle",
  }));
  let frame;
  const draw = () => {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    let alive=false;
    particles.forEach(p => {
      p.vy+=0.25; p.x+=p.vx; p.y+=p.vy; p.rotation+=p.spin; p.opacity-=0.012;
      if(p.opacity<=0) return; alive=true;
      ctx.save(); ctx.globalAlpha=p.opacity; ctx.translate(p.x,p.y); ctx.rotate(p.rotation*Math.PI/180);
      ctx.fillStyle=p.color;
      if(p.shape==="rect") ctx.fillRect(-p.size/2,-p.size/4,p.size,p.size/2);
      else { ctx.beginPath(); ctx.arc(0,0,p.size/2,0,Math.PI*2); ctx.fill(); }
      ctx.restore();
    });
    if(alive) frame=requestAnimationFrame(draw); else canvas.remove();
  };
  draw(); setTimeout(()=>{ cancelAnimationFrame(frame); canvas.remove(); },4000);
}

const TALENT_META = {
  logic:      { icon:"🧠", color:"#1565C0", ru:"Логика",      uz:"Mantiq",     en:"Logic"      },
  creativity: { icon:"🎨", color:"#E64A19", ru:"Творчество",  uz:"Ijodkorlik", en:"Creativity"  },
  memory:     { icon:"🃏", color:"#7E57C2", ru:"Память",      uz:"Xotira",     en:"Memory"      },
  leadership: { icon:"👑", color:"#F9A825", ru:"Лидерство",   uz:"Liderlik",   en:"Leadership"  },
  languages:  { icon:"🌍", color:"#00838F", ru:"Языки",       uz:"Tillar",     en:"Languages"   },
  music:      { icon:"🎵", color:"#2E7D32", ru:"Музыка",      uz:"Musiqa",     en:"Music"       },
  sport:      { icon:"🏃", color:"#BF360C", ru:"Спорт",       uz:"Sport",      en:"Sport"       },
  nature:     { icon:"🌿", color:"#1B5E20", ru:"Природа",     uz:"Tabiat",     en:"Nature"      },
  social:     { icon:"🤝", color:"#4527A0", ru:"Общение",     uz:"Muloqot",    en:"Social"      },
};

export default function ResultsPage({ setPage, results, lang, dark }) {
  const [animated, setAnimated] = useState(false);
  const confettiFired = useRef(false);

  const data    = results;
  const scores  = data?.scores  || {};
  const careers = data?.careers || [];
  const sorted  = Object.entries(scores).sort((a,b)=>b[1]-a[1]);
  const top3    = sorted.slice(0,3);
  const overall = Math.round(Object.values(scores).reduce((a,b)=>a+b,0) / Math.max(Object.values(scores).length,1));

  useEffect(() => {
    setTimeout(() => setAnimated(true), 200);
    if (!confettiFired.current && Object.keys(scores).length > 0) {
      confettiFired.current = true;
      if (!localStorage.getItem("kt_results_seen")) {
        setTimeout(() => fireConfetti(), 800);
        localStorage.setItem("kt_results_seen","1");
      }
    }
  }, []);

  const L = {
    ru:{ title:"Твоя Карта Талантов", overall:"Общий прогресс", strengths:"Твои сильные стороны", careers:"Карьеры для тебя", takeQuiz:"Пройти тест снова", develop:"Развивай таланты", allTalents:"Все таланты", match:"совпадение", noResults:"Пройди тест чтобы увидеть результаты!", goQuiz:"Пройти тест →", topTalent:"Топ-талант" },
    uz:{ title:"Sizning Iste'dod Xaritangiz", overall:"Umumiy taraqqiyot", strengths:"Kuchli tomonlaringiz", careers:"Siz uchun kasblar", takeQuiz:"Testni qayta topshirish", develop:"Iste'dodlarni rivojlantirish", allTalents:"Barcha iste'dodlar", match:"mos", noResults:"Natijalarni ko'rish uchun testni topshiring!", goQuiz:"Testni topshirish →", topTalent:"Top iste'dod" },
    en:{ title:"Your Talent Map", overall:"Overall progress", strengths:"Your strengths", careers:"Careers for you", takeQuiz:"Retake quiz", develop:"Develop talents", allTalents:"All talents", match:"match", noResults:"Take the quiz to see your results!", goQuiz:"Take quiz →", topTalent:"Top talent" },
  }[lang] || {};

  const bg  = dark?"#060E09":"#F8FBF9";
  const card = dark?"#0D1A11":"#fff";
  const bdr  = dark?"rgba(93,202,165,0.12)":"rgba(15,110,86,0.08)";

  if (!data || Object.keys(scores).length === 0) {
    return (
      <div className="page-wrap" style={{ background:bg }}>
        <Nav page="results" setPage={setPage} lang={lang} dark={dark} />
        <div style={{ minHeight:"80vh", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:20, padding:"24px" }}>
          <div style={{ fontSize:"4rem" }}>🎯</div>
          <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.8rem", color: dark?"#E1F5EE":"#04342C", textAlign:"center" }}>{L.noResults}</h2>
          <button onClick={() => setPage("quiz")} style={{ padding:"14px 36px", background:"linear-gradient(135deg,#0F6E56,#1D9E75)", color:"#fff", border:"none", borderRadius:99, fontFamily:"'Fredoka One',cursive", fontSize:"1.1rem", cursor:"pointer", boxShadow:"0 6px 20px rgba(15,110,86,0.35)" }}>
            {L.goQuiz}
          </button>
        </div>
      </div>
    );
  }

  const topTalent = sorted[0];
  const topMeta   = TALENT_META[topTalent?.[0]] || {};

  return (
    <div className="page-wrap" style={{ background:bg, paddingTop:64 }}>
      <style>{`
        @keyframes barGrow{from{width:0}to{width:var(--w)}}
        @keyframes cardPop{from{opacity:0;transform:scale(0.9) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes scorePulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
        .result-card{background:${card};border:1.5px solid ${bdr};border-radius:24px;box-shadow:0 4px 24px rgba(15,110,86,0.08);padding:24px;transition:transform 0.3s cubic-bezier(0.34,1.56,0.64,1),box-shadow 0.3s;}
        .result-card:hover{transform:translateY(-4px);box-shadow:0 16px 40px rgba(15,110,86,0.14);}
        .career-row{display:flex;align-items:center;gap:12px;padding:14px 0;border-bottom:1px solid ${bdr};}
        .career-row:last-child{border:none;}
        .talent-pill{display:flex;align-items:center;gap:8px;padding:10px 16px;border-radius:14px;transition:transform 0.2s;}
        .talent-pill:hover{transform:translateY(-2px);}
      `}</style>
      <Nav page="results" setPage={setPage} lang={lang} dark={dark} />

      <div style={{ maxWidth:860, margin:"0 auto", padding:"32px 20px 60px" }}>

        {/* ── Hero result banner ── */}
        <div style={{ background:`linear-gradient(135deg,${topMeta.color||"#0F6E56"},${topMeta.color||"#1D9E75"}bb)`, borderRadius:28, padding:"32px 28px", marginBottom:24, color:"#fff", display:"flex", alignItems:"center", gap:24, flexWrap:"wrap", animation:"cardPop 0.5s ease both" }}>
          <div style={{ fontSize:"4rem" }}>{topMeta.icon||"🌟"}</div>
          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ fontSize:"0.75rem", fontWeight:800, letterSpacing:"0.15em", textTransform:"uppercase", opacity:0.7, marginBottom:4 }}>{L.topTalent}</div>
            <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"clamp(1.8rem,5vw,2.8rem)", marginBottom:6 }}>
              {topMeta[lang]||topMeta.en||"—"}
            </h1>
            <div style={{ fontSize:"0.9rem", opacity:0.85, fontWeight:600 }}>
              {lang==="ru"?"Пройди тест снова чтобы улучшить результат!":lang==="uz"?"Natijani yaxshilash uchun testni qayta topshiring!":"Take the quiz again to improve your result!"}
            </div>
          </div>
          <div style={{ textAlign:"center" }}>
            <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"3.5rem", lineHeight:1, animation:"scorePulse 2s ease-in-out infinite" }}>
              {Math.round(topTalent?.[1]||0)}%
            </div>
            <div style={{ fontSize:"0.72rem", fontWeight:800, opacity:0.7, textTransform:"uppercase", letterSpacing:"0.1em" }}>{L.match}</div>
          </div>
        </div>

        {/* ── Overall progress bar ── */}
        <div className="result-card" style={{ marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
            <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.1rem", color: dark?"#E1F5EE":"#04342C" }}>{L.overall}</span>
            <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.4rem", color:"#EF9F27" }}>{overall}%</span>
          </div>
          <div style={{ height:10, background: dark?"rgba(255,255,255,0.08)":"#E1F5EE", borderRadius:99, overflow:"hidden" }}>
            <div style={{ height:"100%", width: animated?`${overall}%`:"0%", background:"linear-gradient(90deg,#EF9F27,#FAC775)", borderRadius:99, transition:"width 1.2s cubic-bezier(0.34,1.56,0.64,1)" }}/>
          </div>
        </div>

        {/* ── All 9 talent bars ── */}
        <div className="result-card" style={{ marginBottom:20 }}>
          <h3 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.15rem", color: dark?"#E1F5EE":"#04342C", marginBottom:20 }}>{L.allTalents}</h3>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {sorted.map(([talent,score],i) => {
              const m = TALENT_META[talent] || {};
              return (
                <div key={talent} style={{ animation:`cardPop 0.4s ease ${i*0.06}s both` }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:"1.1rem" }}>{m.icon}</span>
                      <span style={{ fontSize:"0.88rem", fontWeight:800, color: dark?"#E1F5EE":"#2E4057" }}>{m[lang]||m.en}</span>
                    </div>
                    <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1rem", color:m.color, fontWeight:900 }}>{Math.round(score)}%</span>
                  </div>
                  <div style={{ height:8, background: dark?"rgba(255,255,255,0.06)":"#F0F4F8", borderRadius:99, overflow:"hidden" }}>
                    <div style={{ height:"100%", width: animated?`${score}%`:"0%", background:`linear-gradient(90deg,${m.color},${m.color}88)`, borderRadius:99, transition:`width 1s cubic-bezier(0.34,1.56,0.64,1) ${0.1+i*0.08}s` }}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Top 3 strength cards ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:12, marginBottom:20 }}>
          {top3.map(([talent,score],i) => {
            const m = TALENT_META[talent] || {};
            return (
              <div key={talent} style={{ background:`${m.color}12`, border:`1.5px solid ${m.color}33`, borderRadius:20, padding:"18px 14px", textAlign:"center", animation:`cardPop 0.5s ease ${0.2+i*0.1}s both` }}>
                <div style={{ fontSize:"2rem", marginBottom:8 }}>{m.icon}</div>
                <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.5rem", color:m.color }}>{Math.round(score)}%</div>
                <div style={{ fontSize:"0.75rem", fontWeight:800, color: dark?"#9FE1CB":"#546E7A", marginTop:4 }}>{m[lang]||m.en}</div>
              </div>
            );
          })}
        </div>

        {/* ── Careers ── */}
        {careers.length > 0 && (
          <div className="result-card" style={{ marginBottom:24 }}>
            <h3 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.15rem", color: dark?"#E1F5EE":"#04342C", marginBottom:16 }}>🚀 {L.careers}</h3>
            {careers.slice(0,6).map((c,i) => {
              const pct   = typeof c.score==="number" ? Math.round(c.score) : (95-i*8);
              const color = pct>=80?"#2E7D32":pct>=65?"#0F6E56":"#EF9F27";
              return (
                <div key={i} className="career-row" style={{ animation:`cardPop 0.4s ease ${i*0.07}s both` }}>
                  <span style={{ fontSize:"1.3rem", flexShrink:0 }}>{c.emoji||"💼"}</span>
                  <span style={{ flex:1, fontWeight:800, fontSize:"0.92rem", color: dark?"#E1F5EE":"#2E4057" }}>{c.name}</span>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    <div style={{ width:80, height:6, background: dark?"rgba(255,255,255,0.08)":"#E1F5EE", borderRadius:99, overflow:"hidden" }}>
                      <div style={{ height:"100%", width: animated?`${pct}%`:"0%", background:color, borderRadius:99, transition:`width 0.8s ease ${0.3+i*0.08}s` }}/>
                    </div>
                    <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:"0.95rem", color, minWidth:38, textAlign:"right" }}>{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Action buttons ── */}
        <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
          <button onClick={() => setPage("develop")} style={{ flex:1, minWidth:180, padding:"14px 24px", background:"linear-gradient(135deg,#0F6E56,#1D9E75)", color:"#fff", border:"none", borderRadius:99, fontFamily:"'Fredoka One',cursive", fontSize:"1rem", cursor:"pointer", boxShadow:"0 6px 20px rgba(15,110,86,0.3)", transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
            onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 10px 28px rgba(15,110,86,0.4)";}}
            onMouseLeave={e=>{e.currentTarget.style.transform="";e.currentTarget.style.boxShadow="0 6px 20px rgba(15,110,86,0.3)";}}>
            📚 {L.develop}
          </button>
          <button onClick={() => setPage("quiz")} style={{ flex:1, minWidth:180, padding:"14px 24px", background:"transparent", color: dark?"#5DCAA5":"#0F6E56", border:`2px solid ${dark?"rgba(93,202,165,0.3)":"rgba(15,110,86,0.2)"}`, borderRadius:99, fontFamily:"'Fredoka One',cursive", fontSize:"1rem", cursor:"pointer", transition:"all 0.2s" }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(15,110,86,0.06)";}}
            onMouseLeave={e=>{e.currentTarget.style.background="transparent";}}>
            🔄 {L.takeQuiz}
          </button>
        </div>
      </div>
    </div>
  );
}
