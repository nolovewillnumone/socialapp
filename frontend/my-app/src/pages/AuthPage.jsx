import { useState } from "react";
import { authAPI } from "../api/client";
import Loader from "../components/Loader";
import { t } from "../i18n";

export default function AuthPage({ setPage, setUser, lang, dark }) {
  const [mode, setMode]       = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(null);

  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [password, setPass] = useState("");
  const [age, setAge]       = useState("");

  if (loading) {
    return <Loader message={mode === "login" ? t(lang, "auth.loading.login") : t(lang, "auth.loading.reg")} />;
  }

  const handleLogin = async () => {
    setError(null); setSuccess(null);
    if (!email || !password) { setError(t(lang, "auth.errFill")); return; }
    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setPage("home");
    } catch {
      setError(t(lang, "auth.errLogin"));
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    setError(null); setSuccess(null);
    if (!name || !email || !password) { setError(t(lang, "auth.errFill")); return; }
    setLoading(true);
    try {
      await authAPI.register({ name, email, password, age: age ? parseInt(age) : null, lang, role: "child" });
      setMode("login");
      setPass("");
      setSuccess(t(lang, "auth.success"));
    } catch (err) {
      setError(err.response?.data?.detail || t(lang, "auth.errFill"));
    } finally { setLoading(false); }
  };

  const switchTo = (m) => { setMode(m); setError(null); setSuccess(null); };

  const bg = dark
    ? { wrap: { background: "linear-gradient(135deg,#0F1923,#1A2A3A)" }, card: { background: "#1A2A3A", boxShadow: "0 8px 40px rgba(0,0,0,0.4)" }, input: { background: "#0F1923", border: "2px solid #2A4070", color: "#E3F2FD" }, logoTitle: { color: "#90CAF9" } }
    : { wrap: { background: "linear-gradient(135deg,#E3F2FD,#FFF8E1)" }, card: { background: "#fff", boxShadow: "0 8px 40px rgba(21,101,192,0.13)" }, input: { background: "#fff", border: "2px solid #E3F2FD", color: "#1565C0" }, logoTitle: { color: "#1565C0" } };

  return (
    <div style={{ ...S.wrap, ...bg.wrap }}>
      <div style={S.blob1} />
      <div style={S.blob2} />
      <div style={{ ...S.card, ...bg.card }}>
        <div style={S.logo}>
          <span style={S.logoEmoji}>🌟</span>
          <div>
            <div style={{ ...S.logoTitle, ...bg.logoTitle }}>Карта Талантов</div>
            <div style={S.logoSub}>{t(lang, "auth.subtitle")}</div>
          </div>
        </div>

        <div style={S.tabs}>
          <button style={{ ...S.tab, ...(mode === "login"    ? S.tabActive : {}) }} onClick={() => switchTo("login")}>{t(lang, "auth.login")}</button>
          <button style={{ ...S.tab, ...(mode === "register" ? S.tabActive : {}) }} onClick={() => switchTo("register")}>{t(lang, "auth.register")}</button>
        </div>

        {error   && <div style={S.errorBox}>❌ {error}</div>}
        {success && <div style={S.successBox}>✅ {success}</div>}

        <div style={S.form}>
          {mode === "register" && (
            <>
              <input style={{ ...S.input, ...bg.input }} placeholder={t(lang, "auth.name")}     value={name}  onChange={(e) => setName(e.target.value)} />
              <input style={{ ...S.input, ...bg.input }} placeholder={t(lang, "auth.age")}      value={age}   onChange={(e) => setAge(e.target.value)} type="number" min="6" max="18" />
            </>
          )}
          <input style={{ ...S.input, ...bg.input }} placeholder={t(lang, "auth.email")}    value={email}    onChange={(e) => setEmail(e.target.value)} type="email" />
          <input style={{ ...S.input, ...bg.input }} placeholder={t(lang, "auth.password")} value={password} onChange={(e) => setPass(e.target.value)}  type="password" />
          <button style={S.btn} onClick={mode === "login" ? handleLogin : handleRegister}>
            {mode === "login" ? t(lang, "auth.loginBtn") : t(lang, "auth.registerBtn")}
          </button>
        </div>

        <button style={S.guestBtn} onClick={() => setPage("home")}>{t(lang, "auth.guest")}</button>
      </div>
    </div>
  );
}

const S = {
  wrap:       { minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", fontFamily:"'Nunito',sans-serif" },
  blob1:      { position:"absolute", top:-80, left:-80, width:300, height:300, borderRadius:"50%", background:"rgba(21,101,192,0.10)", zIndex:0 },
  blob2:      { position:"absolute", bottom:-60, right:-60, width:250, height:250, borderRadius:"50%", background:"rgba(255,112,67,0.10)", zIndex:0 },
  card:       { borderRadius:24, padding:"40px 36px", width:"100%", maxWidth:400, position:"relative", zIndex:1 },
  logo:       { display:"flex", alignItems:"center", gap:14, marginBottom:28 },
  logoEmoji:  { fontSize:"2.4rem" },
  logoTitle:  { fontSize:"1.3rem", fontWeight:900, lineHeight:1.1 },
  logoSub:    { fontSize:"0.8rem", color:"#FF7043", fontWeight:700 },
  tabs:       { display:"flex", background:"#F0F4FF", borderRadius:12, padding:4, marginBottom:20 },
  tab:        { flex:1, padding:"10px 0", border:"none", background:"transparent", borderRadius:10, fontFamily:"'Nunito',sans-serif", fontSize:"0.95rem", fontWeight:700, color:"#90A4AE", cursor:"pointer" },
  tabActive:  { background:"#fff", color:"#1565C0", boxShadow:"0 2px 8px rgba(21,101,192,0.13)" },
  errorBox:   { background:"#FFF3E0", border:"1.5px solid #FF7043", borderRadius:10, padding:"10px 14px", color:"#E64A19", fontSize:"0.88rem", fontWeight:700, marginBottom:14 },
  successBox: { background:"#E8F5E9", border:"1.5px solid #66BB6A", borderRadius:10, padding:"10px 14px", color:"#2E7D32", fontSize:"0.88rem", fontWeight:700, marginBottom:14 },
  form:       { display:"flex", flexDirection:"column", gap:12 },
  input:      { padding:"13px 16px", borderRadius:12, fontSize:"0.95rem", fontFamily:"'Nunito',sans-serif", fontWeight:600, outline:"none" },
  btn:        { marginTop:6, padding:"14px", background:"linear-gradient(90deg,#1565C0,#1976D2)", color:"#fff", border:"none", borderRadius:14, fontSize:"1.05rem", fontWeight:800, fontFamily:"'Nunito',sans-serif", cursor:"pointer", boxShadow:"0 4px 16px rgba(21,101,192,0.25)" },
  guestBtn:   { marginTop:16, width:"100%", background:"none", border:"none", color:"#90A4AE", fontFamily:"'Nunito',sans-serif", fontSize:"0.88rem", fontWeight:700, cursor:"pointer", textAlign:"center" },
};
