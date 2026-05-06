import { useState, useEffect } from "react";

const API = "https://karta-talantov-backend.onrender.com";

const TALENT_EMOJI = { logic:"🧠", creativity:"🎨", memory:"🃏", leadership:"👑", languages:"🌍", music:"🎵", sport:"🏃", nature:"🌿", social:"🤝" };
const LANG_FLAG   = { ru:"🇷🇺", uz:"🇺🇿", en:"🇬🇧" };

function StatCard({ icon, value, label, color="#0F6E56" }) {
  return (
    <div style={{ background:"#fff", borderRadius:18, padding:"20px 24px", border:"1.5px solid #E1F5EE", boxShadow:"0 4px 16px rgba(15,110,86,0.07)", display:"flex", flexDirection:"column", gap:6, animation:"cardPop 0.4s cubic-bezier(0.34,1.56,0.64,1) both" }}>
      <div style={{ fontSize:"1.8rem" }}>{icon}</div>
      <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"2rem", color, lineHeight:1 }}>{value}</div>
      <div style={{ fontSize:"0.78rem", fontWeight:800, color:"#78909C", textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</div>
    </div>
  );
}

function Table({ columns, rows, emptyMsg="No data yet" }) {
  return (
    <div style={{ overflowX:"auto" }}>
      <table style={{ width:"100%", borderCollapse:"collapse", fontFamily:"'Nunito',sans-serif", fontSize:"0.85rem" }}>
        <thead>
          <tr style={{ background:"#E1F5EE" }}>
            {columns.map(c => (
              <th key={c.key} style={{ padding:"10px 14px", textAlign:"left", fontWeight:900, color:"#0F6E56", whiteSpace:"nowrap", fontSize:"0.78rem", textTransform:"uppercase", letterSpacing:"0.05em" }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={columns.length} style={{ padding:"24px", textAlign:"center", color:"#90A4AE", fontWeight:700 }}>{emptyMsg}</td></tr>
          ) : rows.map((row, i) => (
            <tr key={i} style={{ borderBottom:"1px solid #F0F4F8", background:i%2===0?"#fff":"#FAFFFE", transition:"background 0.15s" }}
              onMouseEnter={e => e.currentTarget.style.background="#E8F5EE"}
              onMouseLeave={e => e.currentTarget.style.background=i%2===0?"#fff":"#FAFFFE"}>
              {columns.map(c => (
                <td key={c.key} style={{ padding:"10px 14px", color:"#2E4057", fontWeight:600, whiteSpace:"nowrap" }}>
                  {c.render ? c.render(row[c.key], row) : (row[c.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BarChart({ data, labelKey, valueKey, color="#0F6E56" }) {
  const max = Math.max(...data.map(d => d[valueKey]), 1);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
      {data.map((d, i) => (
        <div key={i} style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ fontSize:"0.82rem", fontWeight:800, color:"#546E7A", minWidth:120, textAlign:"right" }}>{d[labelKey] || "—"}</div>
          <div style={{ flex:1, background:"#F0F4F8", borderRadius:99, height:22, overflow:"hidden" }}>
            <div style={{ width:`${(d[valueKey]/max)*100}%`, height:"100%", background:`linear-gradient(90deg,${color},${color}99)`, borderRadius:99, transition:"width 0.8s cubic-bezier(0.34,1.56,0.64,1)", display:"flex", alignItems:"center", paddingLeft:8 }}>
              <span style={{ fontSize:"0.72rem", fontWeight:900, color:"#fff", whiteSpace:"nowrap" }}>{d[valueKey]}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminPage({ setPage }) {
  const [password, setPassword] = useState("");
  const [authed,   setAuthed]   = useState(false);
  const [data,     setData]     = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState(null);
  const [tab,      setTab]      = useState("overview");
  const [pwInput,  setPwInput]  = useState("");

  const login = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API}/admin/data?password=${encodeURIComponent(pwInput)}`);
      if (!res.ok) { setError("Wrong password!"); setLoading(false); return; }
      const json = await res.json();
      setData(json);
      setPassword(pwInput);
      setAuthed(true);
    } catch {
      setError("Cannot connect to backend.");
    } finally { setLoading(false); }
  };

  const refresh = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/data?password=${encodeURIComponent(password)}`);
      const json = await res.json();
      setData(json);
    } catch {}
    finally { setLoading(false); }
  };

  // ── Login screen ────────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", background:"linear-gradient(135deg,#E1F5EE,#FAEEDA)", fontFamily:"'Nunito',sans-serif" }}>
      <style>{`@keyframes cardPop{from{opacity:0;transform:scale(0.92) translateY(20px)}to{opacity:1;transform:scale(1) translateY(0)}}`}</style>
      <div style={{ background:"#fff", borderRadius:24, padding:"40px 36px", width:"100%", maxWidth:380, boxShadow:"0 24px 64px rgba(15,110,86,0.18)", animation:"cardPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:"3rem", marginBottom:10 }}>🔐</div>
          <h2 style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.6rem", color:"#0F6E56", marginBottom:4 }}>Admin Dashboard</h2>
          <p style={{ color:"#78909C", fontWeight:600, fontSize:"0.88rem" }}>Karta Talantov Analytics</p>
        </div>
        <input
          type="password"
          placeholder="Admin password"
          value={pwInput}
          onChange={e => setPwInput(e.target.value)}
          onKeyDown={e => e.key==="Enter" && login()}
          style={{ width:"100%", boxSizing:"border-box", padding:"13px 16px", border:"2px solid #E1F5EE", borderRadius:14, fontFamily:"'Nunito',sans-serif", fontSize:"0.95rem", fontWeight:600, outline:"none", marginBottom:14, color:"#04342C" }}
        />
        {error && <div style={{ color:"#EF5350", fontWeight:700, fontSize:"0.85rem", marginBottom:10 }}>⚠️ {error}</div>}
        <button onClick={login} disabled={loading}
          style={{ width:"100%", padding:"14px", background:"linear-gradient(135deg,#0F6E56,#1D9E75)", color:"#fff", border:"none", borderRadius:14, fontFamily:"'Fredoka One',cursive", fontSize:"1.05rem", cursor:"pointer", boxShadow:"0 6px 20px rgba(15,110,86,0.3)" }}>
          {loading ? "Logging in..." : "Enter Dashboard →"}
        </button>
        <button onClick={() => setPage("home")} style={{ width:"100%", marginTop:12, background:"none", border:"none", color:"#90A4AE", fontWeight:700, cursor:"pointer", fontSize:"0.85rem" }}>
          ← Back to site
        </button>
      </div>
    </div>
  );

  const { stats, top_careers, top_talents, lang_dist, users, feedbacks, anon_results } = data || {};

  const TABS = [
    { id:"overview",  label:"📊 Overview"  },
    { id:"feedback",  label:"💬 Feedback"  },
    { id:"users",     label:"👥 Users"     },
    { id:"results",   label:"📋 Quizzes"   },
  ];

  // ── Dashboard ───────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:"#F1EFE8", fontFamily:"'Nunito',sans-serif" }}>
      <style>{`
        @keyframes cardPop{from{opacity:0;transform:scale(0.92) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
      `}</style>

      {/* Top bar */}
      <div style={{ background:"#fff", borderBottom:"1.5px solid #E1F5EE", padding:"14px 28px", display:"flex", alignItems:"center", gap:16, boxShadow:"0 2px 12px rgba(15,110,86,0.07)", position:"sticky", top:0, zIndex:100 }}>
        <span style={{ fontSize:"1.4rem" }}>🌟</span>
        <span style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.2rem", color:"#0F6E56", flex:1 }}>Karta Talantov — Admin</span>
        <button onClick={refresh} disabled={loading}
          style={{ background:"#E1F5EE", border:"none", borderRadius:10, padding:"7px 16px", fontWeight:800, color:"#0F6E56", cursor:"pointer", fontSize:"0.85rem" }}>
          {loading ? "⏳" : "🔄 Refresh"}
        </button>
        <button onClick={() => setPage("home")}
          style={{ background:"none", border:"1.5px solid #E1F5EE", borderRadius:10, padding:"7px 16px", fontWeight:800, color:"#78909C", cursor:"pointer", fontSize:"0.85rem" }}>
          ← Site
        </button>
        <button onClick={() => { setAuthed(false); setData(null); }}
          style={{ background:"#FFEBEE", border:"none", borderRadius:10, padding:"7px 16px", fontWeight:800, color:"#EF5350", cursor:"pointer", fontSize:"0.85rem" }}>
          Logout
        </button>
      </div>

      {/* Tab bar */}
      <div style={{ background:"#fff", borderBottom:"1.5px solid #E1F5EE", padding:"0 28px", display:"flex", gap:4 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            style={{ padding:"12px 18px", border:"none", borderBottom:`2px solid ${tab===t.id?"#0F6E56":"transparent"}`, background:"transparent", fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.88rem", color:tab===t.id?"#0F6E56":"#90A4AE", cursor:"pointer", transition:"all 0.2s" }}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding:"28px", maxWidth:1100, margin:"0 auto" }}>

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <div style={{ animation:"fadeIn 0.3s ease both" }}>
            {/* Stat cards */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:16, marginBottom:28 }}>
              <StatCard icon="👥" value={stats?.total_users||0}    label="Registered users" color="#0F6E56" />
              <StatCard icon="📋" value={stats?.total_quizzes||0}  label="Quizzes taken"    color="#1D9E75" />
              <StatCard icon="🙋" value={stats?.guest_quizzes||0}  label="Guest quizzes"    color="#5DCAA5" />
              <StatCard icon="💬" value={stats?.total_feedback||0} label="Feedbacks"        color="#EF9F27" />
              <StatCard icon="⭐" value={`${stats?.avg_rating||0}/5`} label="Avg rating"   color="#BA7517" />
              <StatCard icon="👍" value={`${stats?.helpful_pct||0}%`} label="Found helpful" color="#0F6E56" />
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:20, flexWrap:"wrap" }}>
              {/* Top careers */}
              <div style={{ background:"#fff", borderRadius:18, padding:"22px", border:"1.5px solid #E1F5EE", boxShadow:"0 4px 16px rgba(15,110,86,0.06)" }}>
                <h3 style={{ fontFamily:"'Fredoka One',cursive", color:"#0F6E56", marginBottom:16, fontSize:"1.05rem" }}>🏆 Top Recommended Careers</h3>
                <BarChart data={top_careers||[]} labelKey="career" valueKey="count" color="#0F6E56" />
              </div>

              {/* Top talents */}
              <div style={{ background:"#fff", borderRadius:18, padding:"22px", border:"1.5px solid #E1F5EE", boxShadow:"0 4px 16px rgba(15,110,86,0.06)" }}>
                <h3 style={{ fontFamily:"'Fredoka One',cursive", color:"#EF9F27", marginBottom:16, fontSize:"1.05rem" }}>🧠 Top Talents</h3>
                <BarChart data={(top_talents||[]).map(t=>({...t,talent:`${TALENT_EMOJI[t.talent]||""} ${t.talent}`}))} labelKey="talent" valueKey="count" color="#EF9F27" />
              </div>

              {/* Language distribution */}
              <div style={{ background:"#fff", borderRadius:18, padding:"22px", border:"1.5px solid #E1F5EE", boxShadow:"0 4px 16px rgba(15,110,86,0.06)" }}>
                <h3 style={{ fontFamily:"'Fredoka One',cursive", color:"#7E57C2", marginBottom:16, fontSize:"1.05rem" }}>🌍 Language Distribution</h3>
                <BarChart data={(lang_dist||[]).map(l=>({...l,lang:`${LANG_FLAG[l.lang]||""} ${l.lang?.toUpperCase()}`}))} labelKey="lang" valueKey="count" color="#7E57C2" />
              </div>
            </div>
          </div>
        )}

        {/* ── FEEDBACK ── */}
        {tab === "feedback" && (
          <div style={{ animation:"fadeIn 0.3s ease both" }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
              <h2 style={{ fontFamily:"'Fredoka One',cursive", color:"#0F6E56", fontSize:"1.4rem" }}>💬 User Feedback ({feedbacks?.length||0})</h2>
            </div>
            {/* Rating breakdown */}
            <div style={{ background:"#fff", borderRadius:16, padding:"18px 22px", border:"1.5px solid #E1F5EE", marginBottom:20, display:"flex", gap:16, flexWrap:"wrap" }}>
              {[5,4,3,2,1].map(r => {
                const cnt = (feedbacks||[]).filter(f=>f.rating===r).length;
                return (
                  <div key={r} style={{ textAlign:"center", minWidth:60 }}>
                    <div style={{ fontSize:"1.2rem" }}>{"⭐".repeat(r)}</div>
                    <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.3rem", color:"#0F6E56" }}>{cnt}</div>
                  </div>
                );
              })}
            </div>
            <div style={{ background:"#fff", borderRadius:18, border:"1.5px solid #E1F5EE", overflow:"hidden" }}>
              <Table
                columns={[
                  { key:"id",      label:"ID"      },
                  { key:"date",    label:"Date"    },
                  { key:"name",    label:"Name"    },
                  { key:"lang",    label:"Lang",   render: v => `${LANG_FLAG[v]||""} ${v}` },
                  { key:"rating",  label:"Rating", render: v => "⭐".repeat(v) },
                  { key:"helpful", label:"Helpful",render: v => v ? "👍 Yes" : "🤔 No" },
                  { key:"career",  label:"Career"  },
                  { key:"comment", label:"Comment", render: v => v ? `"${v.slice(0,80)}${v.length>80?"...":""}"` : "—" },
                ]}
                rows={feedbacks||[]}
                emptyMsg="No feedback yet — share the site!"
              />
            </div>
          </div>
        )}

        {/* ── USERS ── */}
        {tab === "users" && (
          <div style={{ animation:"fadeIn 0.3s ease both" }}>
            <h2 style={{ fontFamily:"'Fredoka One',cursive", color:"#0F6E56", fontSize:"1.4rem", marginBottom:20 }}>👥 Registered Users ({users?.length||0})</h2>
            <div style={{ background:"#fff", borderRadius:18, border:"1.5px solid #E1F5EE", overflow:"hidden" }}>
              <Table
                columns={[
                  { key:"id",         label:"ID"       },
                  { key:"created_at", label:"Date"     },
                  { key:"name",       label:"Name"     },
                  { key:"email",      label:"Email"    },
                  { key:"age",        label:"Age"      },
                  { key:"lang",       label:"Lang", render: v => `${LANG_FLAG[v]||""} ${v}` },
                ]}
                rows={users||[]}
                emptyMsg="No registered users yet"
              />
            </div>
          </div>
        )}

        {/* ── RESULTS ── */}
        {tab === "results" && (
          <div style={{ animation:"fadeIn 0.3s ease both" }}>
            <h2 style={{ fontFamily:"'Fredoka One',cursive", color:"#0F6E56", fontSize:"1.4rem", marginBottom:20 }}>
              📋 Anonymous Quiz Results ({anon_results?.length||0})
            </h2>
            <div style={{ background:"#fff", borderRadius:18, border:"1.5px solid #E1F5EE", overflow:"hidden" }}>
              <Table
                columns={[
                  { key:"id",         label:"ID"      },
                  { key:"date",       label:"Date"    },
                  { key:"lang",       label:"Lang",   render: v => `${LANG_FLAG[v]||""} ${v}` },
                  { key:"top_talent", label:"Top Talent", render: v => `${TALENT_EMOJI[v]||""} ${v}` },
                  { key:"top_career", label:"Top Career" },
                ]}
                rows={anon_results||[]}
                emptyMsg="No quiz results yet"
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
