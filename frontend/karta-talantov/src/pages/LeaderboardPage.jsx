import { useState, useEffect } from "react";
import Nav from "../components/Nav";

const API = "https://karta-talantov-backend.onrender.com";

const TALENTS = ["logic","creativity","memory","leadership","languages","music","sport","nature","social"];
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

const MEDAL = ["🥇","🥈","🥉"];

export default function LeaderboardPage({ setPage, results, lang, dark }) {
  const [activeTalent, setActiveTalent] = useState("logic");
  const [tab, setTab]                   = useState("leaderboard"); // leaderboard | compare
  const [board, setBoard]               = useState([]);
  const [avg, setAvg]                   = useState(null);
  const [totalUsers, setTotalUsers]     = useState(0);
  const [loading, setLoading]           = useState(false);

  const scores = results?.scores || {};
  const hasResults = Object.keys(scores).length > 0;

  const L = {
    ru: {
      title:"Таблица лидеров", compare:"Сравни себя", tabBoard:"🏆 Лидеры", tabCompare:"📊 Сравнение",
      rank:"Место", name:"Имя", score:"Счёт", career:"Профессия",
      yourScore:"Твой результат", avgScore:"Средний по платформе", youAhead:"Ты выше среднего на", youBehind:"Ты ниже среднего на",
      noResults:"Пройди тест чтобы сравниться!",
      takeQuiz:"Пройти тест →", total:"участников", betterThan:"Ты лучше чем",
      users:"пользователей",
      loading:"Загрузка...", empty:"Пока никого нет — будь первым!",
    },
    uz: {
      title:"Liderlar jadvali", compare:"O'zingizni solishtiring", tabBoard:"🏆 Liderlar", tabCompare:"📊 Taqqoslash",
      rank:"O'rin", name:"Ism", score:"Ball", career:"Kasb",
      yourScore:"Sizning natijangiz", avgScore:"Platformadagi o'rtacha", youAhead:"O'rtachadan yuqori", youBehind:"O'rtachadan past",
      noResults:"Taqqoslash uchun testni topshiring!",
      takeQuiz:"Testni topshirish →", total:"ishtirokchi", betterThan:"Siz undan yaxshiroqsiz",
      users:"foydalanuvchi",
      loading:"Yuklanmoqda...", empty:"Hali hech kim yo'q — birinchi bo'ling!",
    },
    en: {
      title:"Leaderboard", compare:"Compare Yourself", tabBoard:"🏆 Leaders", tabCompare:"📊 Compare",
      rank:"Rank", name:"Name", score:"Score", career:"Career",
      yourScore:"Your score", avgScore:"Platform average", youAhead:"You're ahead by", youBehind:"You're behind by",
      noResults:"Take the quiz to compare yourself!",
      takeQuiz:"Take quiz →", total:"participants", betterThan:"You're better than",
      users:"users",
      loading:"Loading...", empty:"No one yet — be the first!",
    },
  }[lang] || {};

  useEffect(() => {
    if (tab !== "leaderboard") return;
    setLoading(true);
    fetch(`${API}/leaderboard?talent=${activeTalent}`)
      .then(r => r.json())
      .then(d => { setBoard(Array.isArray(d) ? d : []); })
      .catch(() => setBoard([]))
      .finally(() => setLoading(false));
  }, [activeTalent, tab]);

  useEffect(() => {
    if (tab !== "compare") return;
    setLoading(true);
    fetch(`${API}/compare`)
      .then(r => r.json())
      .then(d => { setAvg(d.avg_scores || {}); setTotalUsers(d.total_users || 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tab]);

  const tm = TALENT_META[activeTalent];

  return (
    <div className="page-wrap">
      <style>{`
        @keyframes fadeSlide{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes cardPop{from{opacity:0;transform:scale(0.93)}to{opacity:1;transform:scale(1)}}
        @keyframes barGrow{from{width:0}to{width:var(--w)}}
        .talent-pill:hover{transform:translateY(-2px) scale(1.05)!important;box-shadow:0 6px 16px rgba(0,0,0,0.15)!important;}
        .row-hover:hover{background:rgba(15,110,86,0.06)!important;transform:translateX(4px)!important;}
      `}</style>

      <Nav page="leaderboard" setPage={setPage} lang={lang} dark={dark} />

      {/* Hero */}
      <div style={{ background:`linear-gradient(135deg,#0F6E56,#1D9E75,#EF9F27)`, padding:"32px 24px", textAlign:"center" }}>
        <h1 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2rem", color:"#fff", marginBottom:6 }}>
          {tab==="leaderboard" ? `🏆 ${L.title}` : `📊 ${L.compare}`}
        </h1>
        {/* Tab switcher */}
        <div style={{ display:"inline-flex", background:"rgba(255,255,255,0.15)", borderRadius:99, padding:4, gap:4, marginTop:12 }}>
          {[["leaderboard",L.tabBoard],["compare",L.tabCompare]].map(([key,label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ padding:"8px 20px", border:"none", borderRadius:99, fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.88rem", cursor:"pointer", background:tab===key?"#fff":"transparent", color:tab===key?"#0F6E56":"rgba(255,255,255,0.85)", transition:"all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:800, margin:"0 auto", padding:"24px 16px" }}>

        {/* ── Talent selector ── */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", marginBottom:24, justifyContent:"center" }}>
          {TALENTS.map(t => {
            const m = TALENT_META[t];
            const isActive = t === activeTalent;
            return (
              <button key={t} className="talent-pill"
                onClick={() => setActiveTalent(t)}
                style={{ padding:"7px 14px", border:`2px solid ${isActive?m.color:"transparent"}`, borderRadius:99, background:isActive?m.color:dark?"#1A2A3A":"#fff", color:isActive?"#fff":dark?"#9FE1CB":"#546E7A", fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.82rem", cursor:"pointer", display:"flex", alignItems:"center", gap:5, transition:"all 0.2s", boxShadow:isActive?`0 4px 14px ${m.color}44`:"0 2px 6px rgba(0,0,0,0.06)" }}>
                {m.icon} {m[lang]||m.en}
                {hasResults && scores[t] && (
                  <span style={{ background:isActive?"rgba(255,255,255,0.25)":m.color, color:"#fff", borderRadius:99, padding:"1px 7px", fontSize:"0.7rem", fontWeight:900 }}>
                    {Math.round(scores[t])}%
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── LEADERBOARD TAB ── */}
        {tab === "leaderboard" && (
          <div style={{ animation:"fadeSlide 0.3s ease both" }}>
            <div style={{ background:dark?"#1A2A3A":"#fff", borderRadius:20, border:`1.5px solid ${tm.color}33`, overflow:"hidden", boxShadow:"0 4px 24px rgba(15,110,86,0.08)" }}>

              {/* Table header */}
              <div style={{ background:`${tm.color}15`, padding:"12px 20px", display:"grid", gridTemplateColumns:"48px 1fr 80px 120px", gap:8, borderBottom:`1px solid ${tm.color}22` }}>
                {[L.rank, L.name, L.score, L.career].map(h => (
                  <span key={h} style={{ fontSize:"0.72rem", fontWeight:900, color:tm.color, textTransform:"uppercase", letterSpacing:"0.06em" }}>{h}</span>
                ))}
              </div>

              {loading ? (
                <div style={{ padding:"40px", textAlign:"center", color:"#90A4AE", fontWeight:700 }}>⏳ {L.loading}</div>
              ) : board.length === 0 ? (
                <div style={{ padding:"48px", textAlign:"center" }}>
                  <div style={{ fontSize:"2.5rem", marginBottom:12 }}>🏆</div>
                  <p style={{ color:dark?"#9FE1CB":"#78909C", fontWeight:700 }}>{L.empty}</p>
                  <button onClick={() => setPage("quiz")} style={{ marginTop:16, padding:"10px 24px", background:`linear-gradient(135deg,#0F6E56,#1D9E75)`, color:"#fff", border:"none", borderRadius:50, fontFamily:"'Fredoka One',cursive", fontSize:"0.95rem", cursor:"pointer" }}>
                    {L.takeQuiz}
                  </button>
                </div>
              ) : board.map((row, i) => {
                const isYou = hasResults && Math.abs((scores[activeTalent]||0) - row.score) < 1;
                return (
                  <div key={i} className="row-hover"
                    style={{ padding:"14px 20px", display:"grid", gridTemplateColumns:"48px 1fr 80px 120px", gap:8, alignItems:"center", borderBottom:`1px solid ${dark?"#2A4070":"#F0F4F8"}`, background:isYou?`${tm.color}08`:"transparent", transition:"all 0.15s" }}>
                    <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:i<3?"1.4rem":"1rem", color:i<3?undefined:dark?"#9FE1CB":"#90A4AE" }}>
                      {i<3 ? MEDAL[i] : `#${row.rank}`}
                    </div>
                    <div>
                      <span style={{ fontWeight:800, color:dark?"#E1F5EE":"#04342C", fontSize:"0.9rem" }}>
                        {row.name} {isYou && <span style={{ fontSize:"0.7rem", background:tm.color, color:"#fff", borderRadius:99, padding:"1px 7px", marginLeft:4 }}>YOU</span>}
                      </span>
                      {row.age && row.age !== "—" && <span style={{ fontSize:"0.72rem", color:"#90A4AE", marginLeft:6 }}>age {row.age}</span>}
                    </div>
                    <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.1rem", color:tm.color }}>{row.score}%</div>
                    <div style={{ fontSize:"0.78rem", fontWeight:700, color:dark?"#B0BEC5":"#78909C", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{row.top_career || "—"}</div>
                  </div>
                );
              })}
            </div>

            {/* Your position hint */}
            {hasResults && scores[activeTalent] && (
              <div style={{ marginTop:16, padding:"14px 20px", background:`${tm.color}10`, borderRadius:14, border:`1.5px solid ${tm.color}33`, display:"flex", alignItems:"center", gap:12 }}>
                <span style={{ fontSize:"1.4rem" }}>{tm.icon}</span>
                <div>
                  <span style={{ fontWeight:800, color:tm.color }}>{L.yourScore}: {Math.round(scores[activeTalent])}%</span>
                  {board.length > 0 && (
                    <span style={{ fontSize:"0.82rem", color:dark?"#B0BEC5":"#78909C", marginLeft:10 }}>
                      — #{board.findIndex(r => r.score <= (scores[activeTalent]||0)) + 1 || board.length + 1} {lang==="ru"?"в рейтинге":lang==="uz"?"reytingda":"in ranking"}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── COMPARE TAB ── */}
        {tab === "compare" && (
          <div style={{ animation:"fadeSlide 0.3s ease both" }}>
            {!hasResults ? (
              <div style={{ textAlign:"center", padding:"48px 24px", background:dark?"#1A2A3A":"#fff", borderRadius:20, border:`1.5px solid ${dark?"#2A4070":"#E1F5EE"}` }}>
                <div style={{ fontSize:"3rem", marginBottom:16 }}>📊</div>
                <p style={{ fontWeight:700, color:dark?"#9FE1CB":"#546E7A", marginBottom:20, fontSize:"1.05rem" }}>{L.noResults}</p>
                <button onClick={() => setPage("quiz")} style={{ padding:"12px 28px", background:"linear-gradient(135deg,#0F6E56,#1D9E75)", color:"#fff", border:"none", borderRadius:50, fontFamily:"'Fredoka One',cursive", fontSize:"1rem", cursor:"pointer" }}>{L.takeQuiz}</button>
              </div>
            ) : (
              <div>
                {totalUsers > 0 && (
                  <div style={{ textAlign:"center", marginBottom:20, padding:"10px", background:`${tm.color}10`, borderRadius:12, border:`1px solid ${tm.color}22` }}>
                    <span style={{ fontWeight:800, color:tm.color, fontSize:"0.88rem" }}>
                      📊 {lang==="ru"?`Сравнение с ${totalUsers} участниками`:lang==="uz"?`${totalUsers} ishtirokchi bilan taqqoslash`:`Comparing with ${totalUsers} ${L.users}`}
                    </span>
                  </div>
                )}

                {/* Comparison bars */}
                <div style={{ background:dark?"#1A2A3A":"#fff", borderRadius:20, border:`1.5px solid ${dark?"#2A4070":"#E1F5EE"}`, overflow:"hidden", boxShadow:"0 4px 24px rgba(15,110,86,0.08)" }}>
                  {TALENTS.map((t, i) => {
                    const m = TALENT_META[t];
                    const myScore  = Math.round(scores[t] || 0);
                    const avgScore = loading ? 0 : Math.round(avg?.[t] || 30);
                    const diff     = myScore - avgScore;
                    const isSelected = t === activeTalent;

                    return (
                      <div key={t} onClick={() => setActiveTalent(t)}
                        style={{ padding:"16px 20px", borderBottom:`1px solid ${dark?"#2A4070":"#F0F4F8"}`, cursor:"pointer", background:isSelected?`${m.color}08`:"transparent", transition:"all 0.15s" }}>
                        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <span style={{ fontSize:"1.2rem" }}>{m.icon}</span>
                            <span style={{ fontWeight:800, color:dark?"#E1F5EE":"#04342C", fontSize:"0.9rem" }}>{m[lang]||m.en}</span>
                          </div>
                          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                            <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.1rem", color:m.color }}>{myScore}%</span>
                            <span style={{ fontSize:"0.75rem", fontWeight:800, color:diff>=0?"#2E7D32":"#C62828", background:diff>=0?"#E8F5E9":"#FFEBEE", padding:"2px 8px", borderRadius:99 }}>
                              {diff>=0?`+${diff}`:`${diff}`}
                            </span>
                          </div>
                        </div>

                        {/* Dual bar */}
                        <div style={{ position:"relative", height:10, background:dark?"#2A4070":"#F0F4F8", borderRadius:99, overflow:"hidden" }}>
                          {/* Average bar */}
                          <div style={{ position:"absolute", left:0, top:0, width:`${avgScore}%`, height:"100%", background:"#B0BEC5", borderRadius:99, opacity:0.5 }} />
                          {/* Your bar */}
                          <div style={{ position:"absolute", left:0, top:0, width:`${myScore}%`, height:"100%", background:`linear-gradient(90deg,${m.color},${m.color}99)`, borderRadius:99, transition:"width 0.8s cubic-bezier(0.34,1.56,0.64,1)" }} />
                        </div>

                        <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
                          <span style={{ fontSize:"0.68rem", color:"#90A4AE", fontWeight:700 }}>
                            {lang==="ru"?"Среднее":lang==="uz"?"O'rtacha":"Avg"}: {avgScore}%
                          </span>
                          {diff !== 0 && (
                            <span style={{ fontSize:"0.68rem", fontWeight:800, color:diff>0?"#2E7D32":"#C62828" }}>
                              {diff>0 ? `↑ ${L.youAhead} ${diff}%` : `↓ ${L.youBehind} ${Math.abs(diff)}%`}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Better than % */}
                {avg && (
                  <div style={{ marginTop:16, padding:"18px 20px", background:`linear-gradient(135deg,#0F6E56,#1D9E75)`, borderRadius:16, textAlign:"center", boxShadow:"0 6px 20px rgba(15,110,86,0.25)" }}>
                    <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.6rem", color:"#fff", marginBottom:4 }}>
                      🏆 {Math.round(TALENTS.filter(t => (scores[t]||0) > (avg[t]||30)).length / TALENTS.length * 100)}%
                    </div>
                    <div style={{ fontSize:"0.85rem", fontWeight:700, color:"rgba(255,255,255,0.85)" }}>
                      {lang==="ru"?"талантов выше среднего по платформе":lang==="uz"?"iste'dodlar platformadagi o'rtachadan yuqori":"of talents above platform average"}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
