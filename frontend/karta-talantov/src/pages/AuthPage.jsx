import { useState, useEffect, useRef } from "react";
import { authAPI } from "../api/client";
import { t } from "../i18n";

// ── Floating particle canvas ──────────────────────────────────────────────────
function ParticleCanvas() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 38 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 3 + 1,
      dx: (Math.random() - 0.5) * 0.5,
      dy: (Math.random() - 0.5) * 0.5,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? "15,110,86" : "239,159,39",
    }));

    let frame;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
        ctx.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);
  return <canvas ref={canvasRef} style={{ position:"absolute", inset:0, zIndex:0, pointerEvents:"none" }} />;
}

// ── Animated input field ──────────────────────────────────────────────────────
function AnimatedInput({ icon, placeholder, value, onChange, type = "text", delay = 0, dark }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;
  return (
    <div style={{ position:"relative", animation:`slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}s both` }}>
      <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:"1.1rem", zIndex:2, transition:"all 0.2s", opacity: focused ? 1 : 0.6 }}>
        {icon}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width:"100%", boxSizing:"border-box",
          padding:"15px 16px 15px 44px",
          border: focused ? "2px solid #1D9E75" : `2px solid ${dark ? "#2A4070" : "#E1F5EE"}`,
          borderRadius:14,
          background: dark
            ? focused ? "rgba(29,158,117,0.08)" : "rgba(255,255,255,0.04)"
            : focused ? "rgba(29,158,117,0.04)" : "rgba(255,255,255,0.85)",
          color: dark ? "#E1F5EE" : "#0F6E56",
          fontSize:"0.97rem",
          fontFamily:"'Nunito',sans-serif",
          fontWeight:600,
          outline:"none",
          backdropFilter:"blur(8px)",
          boxShadow: focused
            ? `0 0 0 4px rgba(29,158,117,0.15), 0 4px 20px rgba(29,158,117,0.12)`
            : "0 2px 8px rgba(0,0,0,0.04)",
          transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          transform: focused ? "translateY(-1px)" : "none",
        }}
      />
      {/* Animated underline */}
      <div style={{
        position:"absolute", bottom:0, left:"50%",
        width: focused ? "100%" : "0%",
        height:2,
        background:"linear-gradient(90deg,#0F6E56,#5DCAA5,#EF9F27)",
        borderRadius:"0 0 14px 14px",
        transform:"translateX(-50%)",
        transition:"width 0.3s ease",
      }} />
    </div>
  );
}

// ── Main Auth Page ────────────────────────────────────────────────────────────
export default function AuthPage({ setPage, setUser, lang, dark }) {
  const [mode, setMode]       = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(null);
  const [cardVisible, setCardVisible] = useState(false);

  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [password, setPass] = useState("");
  const [age, setAge]       = useState("");

  const [btnPressed, setBtnPressed] = useState(false);

  useEffect(() => {
    setTimeout(() => setCardVisible(true), 80);
  }, []);

  const handleLogin = async () => {
    setError(null); setSuccess(null);
    if (!email || !password) { setError(L.errFill); return; }
    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      // Exit animation
      setCardVisible(false);
      setTimeout(() => setPage("home"), 350);
    } catch {
      setError(L.errLogin);
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    setError(null); setSuccess(null);
    if (!name || !email || !password) { setError(L.errFill); return; }
    setLoading(true);
    try {
      await authAPI.register({ name, email, password, age: age ? parseInt(age) : null, lang, role:"child" });
      setSuccess(L.success);
      setTimeout(() => switchTo("login"), 1500);
    } catch (err) {
      setError(err.response?.data?.detail || L.errFill);
    } finally { setLoading(false); }
  };

  const switchTo = (m) => {
    setMode(m); setError(null); setSuccess(null);
  };

  const L = {
    ru: { subtitle:"Узнай свои таланты!", login:"Войти", register:"Регистрация", name:"Твоё имя", age:"Возраст (6-18)", email:"Email адрес", password:"Пароль", loginBtn:"Войти в аккаунт →", registerBtn:"Создать аккаунт ⭐", guest:"Попробовать без входа →", errFill:"Заполни все поля!", errLogin:"Неверный email или пароль", success:"Аккаунт создан! Войди в систему.", loading:"Секундочку..." },
    uz:  { subtitle:"Iste'dodlaringizni bilib oling!", login:"Kirish", register:"Ro'yxatdan o'tish", name:"Ismingiz", age:"Yosh (6-18)", email:"Email manzil", password:"Parol", loginBtn:"Hisobga kirish →", registerBtn:"Hisob yaratish ⭐", guest:"Kirmasdan sinab ko'rish →", errFill:"Barcha maydonlarni to'ldiring!", errLogin:"Noto'g'ri email yoki parol", success:"Hisob yaratildi! Kiring.", loading:"Biroz kuting..." },
    en:  { subtitle:"Discover your abilities!", login:"Login", register:"Register", name:"Your name", age:"Age (6-18)", email:"Email address", password:"Password", loginBtn:"Sign in →", registerBtn:"Create account ⭐", guest:"Try without login →", errFill:"Fill in all fields!", errLogin:"Wrong email or password", success:"Account created! Please sign in.", loading:"One moment..." },
  }[lang] || {};

  const isRegister = mode === "register";

  return (
    <div style={{ minHeight:"100vh", display:"flex", alignItems:"center", justifyContent:"center", position:"relative", overflow:"hidden", fontFamily:"'Nunito',sans-serif", background: dark ? "linear-gradient(135deg,#060D14 0%,#0F1923 40%,#0A1F15 100%)" : "linear-gradient(135deg,#E1F5EE 0%,#FAEEDA 50%,#E1F5EE 100%)" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');

        @keyframes slideUp {
          from { opacity:0; transform:translateY(28px) scale(0.96); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        @keyframes cardIn {
          from { opacity:0; transform:translateY(40px) scale(0.93) rotateX(8deg); }
          to   { opacity:1; transform:translateY(0)    scale(1)    rotateX(0deg); }
        }
        @keyframes cardOut {
          from { opacity:1; transform:translateY(0)    scale(1);    }
          to   { opacity:0; transform:translateY(-30px) scale(0.95); }
        }
        @keyframes blobMorph {
          0%,100% { border-radius:60% 40% 30% 70%/60% 30% 70% 40%; transform:rotate(0deg) scale(1); }
          33%      { border-radius:30% 60% 70% 40%/50% 60% 30% 60%; transform:rotate(120deg) scale(1.05); }
          66%      { border-radius:40% 70% 60% 30%/40% 70% 60% 50%; transform:rotate(240deg) scale(0.95); }
        }
        @keyframes blobMorph2 {
          0%,100% { border-radius:40% 60% 60% 40%/60% 30% 70% 40%; }
          50%      { border-radius:70% 30% 50% 50%/30% 60% 40% 70%; }
        }
        @keyframes shimmerBtn {
          0%   { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        @keyframes successPop {
          0%   { transform:scale(0.8); opacity:0; }
          60%  { transform:scale(1.05); }
          100% { transform:scale(1); opacity:1; }
        }
        @keyframes float {
          0%,100% { transform:translateY(0); }
          50%      { transform:translateY(-8px); }
        }
        @keyframes spin {
          from { transform:rotate(0deg); }
          to   { transform:rotate(360deg); }
        }
        @keyframes shake {
          0%,100% { transform:translateX(0); }
          20%     { transform:translateX(-8px); }
          40%     { transform:translateX(8px); }
          60%     { transform:translateX(-5px); }
          80%     { transform:translateX(5px); }
        }

        .auth-input-wrap:focus-within .input-label {
          color: #1D9E75;
          transform: translateY(-4px) scale(0.85);
        }

        .tab-btn {
          transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1) !important;
        }
        .tab-btn:hover {
          transform: translateY(-2px) !important;
        }

        .submit-btn {
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1) !important;
        }
        .submit-btn:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.02) !important;
          box-shadow: 0 12px 32px rgba(15,110,86,0.45) !important;
        }
        .submit-btn:active:not(:disabled) {
          transform: scale(0.97) !important;
        }

        .guest-btn:hover {
          color: #1D9E75 !important;
          transform: translateY(-1px) !important;
        }
      `}</style>

      {/* Particles */}
      <ParticleCanvas />

      {/* Morphing blobs */}
      <div style={{ position:"absolute", top:"-10%", left:"-8%", width:420, height:420, background: dark ? "rgba(15,110,86,0.12)" : "rgba(15,110,86,0.15)", animation:"blobMorph 12s ease-in-out infinite", zIndex:0, filter:"blur(2px)" }} />
      <div style={{ position:"absolute", bottom:"-8%", right:"-6%", width:360, height:360, background: dark ? "rgba(239,159,39,0.10)" : "rgba(239,159,39,0.18)", animation:"blobMorph2 10s ease-in-out infinite", zIndex:0, filter:"blur(2px)" }} />
      <div style={{ position:"absolute", top:"40%", right:"8%", width:180, height:180, background: dark ? "rgba(93,202,165,0.08)" : "rgba(93,202,165,0.20)", animation:"blobMorph 16s ease-in-out infinite reverse", zIndex:0 }} />

      {/* Glassmorphism card */}
      <div style={{
        position:"relative", zIndex:10,
        width:"100%", maxWidth:420,
        margin:"20px",
        padding: isRegister ? "40px 36px 32px" : "44px 36px 36px",
        borderRadius:28,
        background: dark
          ? "rgba(15,25,35,0.75)"
          : "rgba(255,255,255,0.72)",
        backdropFilter:"blur(24px)",
        WebkitBackdropFilter:"blur(24px)",
        border: dark
          ? "1px solid rgba(93,202,165,0.18)"
          : "1px solid rgba(15,110,86,0.12)",
        boxShadow: dark
          ? "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(93,202,165,0.1)"
          : "0 32px 80px rgba(15,110,86,0.18), inset 0 1px 0 rgba(255,255,255,0.8)",
        animation: cardVisible ? "cardIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both" : "cardOut 0.35s ease both",
        transformStyle:"preserve-3d",
        transition:"padding 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      }}>

        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:30, animation:"slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.1s both" }}>
          <div style={{ width:52, height:52, borderRadius:16, background:"linear-gradient(135deg,#0F6E56,#1D9E75)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"1.7rem", boxShadow:"0 8px 24px rgba(15,110,86,0.4)", animation:"float 3s ease-in-out infinite", flexShrink:0 }}>
            🌟
          </div>
          <div>
            <div style={{ fontFamily:"'Fredoka One',cursive", fontSize:"1.4rem", color: dark ? "#9FE1CB" : "#0F6E56", lineHeight:1.1 }}>Карта Талантов</div>
            <div style={{ fontSize:"0.78rem", color:"#EF9F27", fontWeight:800, letterSpacing:"0.04em" }}>{L.subtitle}</div>
          </div>
        </div>

        {/* Tab switcher */}
        <div style={{ display:"flex", background: dark ? "rgba(255,255,255,0.05)" : "rgba(15,110,86,0.06)", borderRadius:14, padding:4, marginBottom:24, animation:"slideUp 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.15s both", border: dark ? "1px solid rgba(93,202,165,0.1)" : "1px solid rgba(15,110,86,0.08)" }}>
          {["login","register"].map((m) => (
            <button key={m} className="tab-btn"
              onClick={() => switchTo(m)}
              style={{
                flex:1, padding:"11px 0", border:"none", cursor:"pointer",
                fontFamily:"'Nunito',sans-serif", fontSize:"0.95rem", fontWeight:800,
                borderRadius:11,
                background: mode === m
                  ? dark ? "rgba(29,158,117,0.25)" : "#fff"
                  : "transparent",
                color: mode === m ? "#0F6E56" : dark ? "#607D8B" : "#90A4AE",
                boxShadow: mode === m ? (dark ? "0 2px 12px rgba(29,158,117,0.2)" : "0 2px 12px rgba(15,110,86,0.12)") : "none",
              }}>
              {m === "login" ? L.login : L.register}
            </button>
          ))}
        </div>

        {/* Error / Success */}
        {error && (
          <div style={{ background:"rgba(239,159,39,0.12)", border:"1.5px solid #EF9F27", borderRadius:12, padding:"10px 14px", color: dark ? "#FAC775" : "#993C1D", fontSize:"0.88rem", fontWeight:700, marginBottom:16, animation:"shake 0.4s ease", backdropFilter:"blur(8px)" }}>
            ⚠️ {error}
          </div>
        )}
        {success && (
          <div style={{ background:"rgba(29,158,117,0.12)", border:"1.5px solid #1D9E75", borderRadius:12, padding:"10px 14px", color: dark ? "#9FE1CB" : "#0F6E56", fontSize:"0.88rem", fontWeight:700, marginBottom:16, animation:"successPop 0.4s cubic-bezier(0.34,1.56,0.64,1)" }}>
            ✅ {success}
          </div>
        )}

        {/* Form fields */}
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {isRegister && (
            <>
              <AnimatedInput icon="👤" placeholder={L.name}     value={name}  onChange={e => setName(e.target.value)}  delay={0.2} dark={dark} />
              <AnimatedInput icon="🎂" placeholder={L.age}      value={age}   onChange={e => setAge(e.target.value)}   delay={0.25} dark={dark} type="number" />
            </>
          )}
          <AnimatedInput icon="📧" placeholder={L.email}    value={email}    onChange={e => setEmail(e.target.value)}   delay={isRegister ? 0.3 : 0.2} dark={dark} type="email" />
          <AnimatedInput icon="🔒" placeholder={L.password} value={password} onChange={e => setPass(e.target.value)}    delay={isRegister ? 0.35 : 0.25} dark={dark} type="password" />
        </div>

        {/* Submit button */}
        <button
          className="submit-btn"
          disabled={loading}
          onClick={isRegister ? handleRegister : handleLogin}
          style={{
            width:"100%", marginTop:20,
            padding:"15px",
            border:"none", borderRadius:16, cursor: loading ? "wait" : "pointer",
            fontFamily:"'Fredoka One',cursive", fontSize:"1.1rem", color:"#fff",
            background:"linear-gradient(90deg,#0F6E56,#1D9E75,#5DCAA5,#1D9E75,#0F6E56)",
            backgroundSize:"300% 100%",
            animation: loading ? "none" : "shimmerBtn 3s linear infinite",
            boxShadow:"0 6px 24px rgba(15,110,86,0.35)",
            opacity: loading ? 0.8 : 1,
            letterSpacing:"0.02em",
          }}>
          {loading
            ? <span style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8 }}>
                <span style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", display:"inline-block", animation:"spin 0.7s linear infinite" }} />
                {L.loading}
              </span>
            : isRegister ? L.registerBtn : L.loginBtn
          }
        </button>

        {/* Divider */}
        <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0 16px", animation:"slideUp 0.5s 0.4s both" }}>
          <div style={{ flex:1, height:1, background: dark ? "rgba(255,255,255,0.08)" : "rgba(15,110,86,0.10)" }} />
          <span style={{ fontSize:"0.75rem", color: dark ? "#607D8B" : "#90A4AE", fontWeight:700 }}>
            {lang==="ru"?"или":lang==="uz"?"yoki":"or"}
          </span>
          <div style={{ flex:1, height:1, background: dark ? "rgba(255,255,255,0.08)" : "rgba(15,110,86,0.10)" }} />
        </div>

        {/* Guest button */}
        <button
          className="guest-btn"
          onClick={() => { setCardVisible(false); setTimeout(() => setPage("home"), 300); }}
          style={{
            width:"100%", background:"none", border:"none",
            color: dark ? "#607D8B" : "#90A4AE",
            fontFamily:"'Nunito',sans-serif", fontSize:"0.88rem", fontWeight:700,
            cursor:"pointer", textAlign:"center", padding:"4px",
            transition:"all 0.2s",
          }}>
          {L.guest}
        </button>

        {/* Bottom decorative dots */}
        <div style={{ display:"flex", justifyContent:"center", gap:6, marginTop:20 }}>
          {[0,1,2].map(i => (
            <div key={i} style={{ width:6, height:6, borderRadius:"50%", background: i===1 ? "#0F6E56" : dark ? "#2A4070" : "#E1F5EE", transition:"all 0.3s", animation:`float ${2+i*0.4}s ease-in-out infinite` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
