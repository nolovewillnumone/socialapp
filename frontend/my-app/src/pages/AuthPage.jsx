import { useState } from "react";
import { authAPI } from "../api/client";
import Loader from "../components/Loader";

export default function AuthPage({ setPage, setUser }) {
  const [mode, setMode]       = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);
  const [success, setSuccess] = useState(null);

  const [name, setName]     = useState("");
  const [email, setEmail]   = useState("");
  const [password, setPass] = useState("");
  const [age, setAge]       = useState("");

  // ── Show full-screen loader while waiting for server ──────────────────────
  if (loading) {
    return (
      <Loader
        message={mode === "login" ? "Входим в аккаунт... 🚀" : "Создаём аккаунт... ⭐"}
      />
    );
  }

  const handleLogin = async () => {
    setError(null);
    setSuccess(null);
    if (!email || !password) { setError("Заполни email и пароль!"); return; }
    setLoading(true);
    try {
      const res = await authAPI.login(email, password);
      localStorage.setItem("token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      setPage("home");
    } catch (err) {
      setError(err.response?.data?.detail || "Неверный email или пароль");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setError(null);
    setSuccess(null);
    if (!name || !email || !password) { setError("Заполни все поля!"); return; }
    setLoading(true);
    try {
      await authAPI.register({
        name,
        email,
        password,
        age: age ? parseInt(age) : null,
        lang: "ru",
        role: "child",
      });
      // Switch to login tab with email pre-filled
      setMode("login");
      setPass("");
      setSuccess("Аккаунт создан! Теперь войди 🎉");
    } catch (err) {
      setError(err.response?.data?.detail || "Ошибка при регистрации");
    } finally {
      setLoading(false);
    }
  };

  const switchToLogin = () => { setMode("login");    setError(null); setSuccess(null); };
  const switchToReg   = () => { setMode("register"); setError(null); setSuccess(null); };

  return (
    <div style={styles.wrap}>
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logo}>
          <span style={styles.logoEmoji}>🌟</span>
          <div>
            <div style={styles.logoTitle}>Карта Талантов</div>
            <div style={styles.logoSub}>Узнай свои способности!</div>
          </div>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button style={{ ...styles.tab, ...(mode === "login"    ? styles.tabActive : {}) }} onClick={switchToLogin}>Войти</button>
          <button style={{ ...styles.tab, ...(mode === "register" ? styles.tabActive : {}) }} onClick={switchToReg}>Регистрация</button>
        </div>

        {/* Messages */}
        {error && (
          <div style={styles.error}>❌ {error}</div>
        )}
        {success && (
          <div style={styles.successBox}>✅ {success}</div>
        )}

        {/* Form */}
        <div style={styles.form}>
          {mode === "register" && (
            <>
              <input style={styles.input} placeholder="Твоё имя" value={name} onChange={(e) => setName(e.target.value)} />
              <input style={styles.input} placeholder="Возраст (необязательно)" type="number" min="6" max="18" value={age} onChange={(e) => setAge(e.target.value)} />
            </>
          )}
          <input style={styles.input} placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input style={styles.input} placeholder="Пароль" type="password" value={password} onChange={(e) => setPass(e.target.value)} />

          <button style={styles.btn} onClick={mode === "login" ? handleLogin : handleRegister}>
            {mode === "login" ? "Войти 🚀" : "Создать аккаунт ⭐"}
          </button>
        </div>

        <button style={styles.guestBtn} onClick={() => setPage("home")}>
          Попробовать без входа →
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrap: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #E3F2FD 0%, #FFF8E1 100%)",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative", overflow: "hidden",
    fontFamily: "'Nunito', sans-serif",
  },
  blob1: { position: "absolute", top: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(21,101,192,0.10)", zIndex: 0 },
  blob2: { position: "absolute", bottom: -60, right: -60, width: 250, height: 250, borderRadius: "50%", background: "rgba(255,112,67,0.10)", zIndex: 0 },
  card: {
    background: "#fff", borderRadius: 24, padding: "40px 36px",
    width: "100%", maxWidth: 400,
    boxShadow: "0 8px 40px rgba(21,101,192,0.13)",
    position: "relative", zIndex: 1,
  },
  logo: { display: "flex", alignItems: "center", gap: 14, marginBottom: 28 },
  logoEmoji: { fontSize: "2.4rem" },
  logoTitle: { fontSize: "1.3rem", fontWeight: 900, color: "#1565C0", lineHeight: 1.1 },
  logoSub: { fontSize: "0.8rem", color: "#FF7043", fontWeight: 700 },
  tabs: { display: "flex", background: "#F0F4FF", borderRadius: 12, padding: 4, marginBottom: 20 },
  tab: { flex: 1, padding: "10px 0", border: "none", background: "transparent", borderRadius: 10, fontFamily: "'Nunito', sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#90A4AE", cursor: "pointer", transition: "all 0.2s" },
  tabActive: { background: "#fff", color: "#1565C0", boxShadow: "0 2px 8px rgba(21,101,192,0.13)" },
  error: { background: "#FFF3E0", border: "1.5px solid #FF7043", borderRadius: 10, padding: "10px 14px", color: "#E64A19", fontSize: "0.88rem", fontWeight: 700, marginBottom: 14 },
  successBox: { background: "#E8F5E9", border: "1.5px solid #66BB6A", borderRadius: 10, padding: "10px 14px", color: "#2E7D32", fontSize: "0.88rem", fontWeight: 700, marginBottom: 14 },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: { padding: "13px 16px", borderRadius: 12, border: "2px solid #E3F2FD", fontSize: "0.95rem", fontFamily: "'Nunito', sans-serif", fontWeight: 600, outline: "none", color: "#1565C0" },
  btn: { marginTop: 6, padding: "14px", background: "linear-gradient(90deg, #1565C0, #1976D2)", color: "#fff", border: "none", borderRadius: 14, fontSize: "1.05rem", fontWeight: 800, fontFamily: "'Nunito', sans-serif", cursor: "pointer", boxShadow: "0 4px 16px rgba(21,101,192,0.25)" },
  guestBtn: { marginTop: 16, width: "100%", background: "none", border: "none", color: "#90A4AE", fontFamily: "'Nunito', sans-serif", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", textAlign: "center" },
};
