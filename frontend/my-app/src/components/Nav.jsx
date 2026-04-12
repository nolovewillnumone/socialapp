import { useState } from "react";

const ITEMS = [
  { key: "home",    ru: "Главная",  uz: "Asosiy",   en: "Home"    },
  { key: "tasks",   ru: "Задания",  uz: "Vazifalar", en: "Tasks"   },
  { key: "quiz",    ru: "Тест",     uz: "Test",      en: "Quiz"    },
  { key: "results", ru: "Карта",    uz: "Xarita",    en: "Results" },
  { key: "develop", ru: "Развитие", uz: "Rivojl.",   en: "Develop" },
];

export default function Nav({ page, setPage, lang = "ru", dark = false, user, onLogout }) {
  const [open, setOpen] = useState(false);

  const go = (key) => { setPage(key); setOpen(false); };

  const label = (item) => item[lang] || item.ru;

  const navBg   = dark ? "#1A2A3A" : "rgba(255,255,255,0.95)";
  const border  = dark ? "2px solid #2A4070" : "1.5px solid rgba(21,101,192,0.10)";
  const textCol = dark ? "#90CAF9" : "#1565C0";
  const mutedCol = dark ? "#607D8B" : "#90A4AE";

  return (
    <>
      <nav className="nav-bar" style={{ background: navBg, borderBottom: border }}>
        {/* Logo */}
        <div className="nav-logo" style={{ color: textCol }} onClick={() => go("home")}>
          🌟 Карта Талантов
        </div>

        {/* Desktop links */}
        <div className="nav-links">
          {ITEMS.map((item) => (
            <button key={item.key}
              className={`nav-link${page === item.key ? " active" : ""}`}
              style={{ color: page === item.key ? "#1565C0" : mutedCol }}
              onClick={() => go(item.key)}>
              {label(item)}
            </button>
          ))}
          {user && onLogout && (
            <button className="nav-link" style={{ color: "#E64A19" }} onClick={onLogout}>
              {lang === "uz" ? "Chiqish" : lang === "en" ? "Logout" : "Выйти"}
            </button>
          )}
        </div>

        {/* Hamburger */}
        <button className="nav-hamburger" onClick={() => setOpen(!open)} aria-label="menu">
          <span style={{ transform: open ? "translateY(7.5px) rotate(45deg)" : "none", background: textCol }} />
          <span style={{ opacity: open ? 0 : 1, background: textCol }} />
          <span style={{ transform: open ? "translateY(-7.5px) rotate(-45deg)" : "none", background: textCol }} />
        </button>
      </nav>

      {/* Mobile dropdown */}
      <div className={`nav-mobile-menu${open ? " open" : ""}`}
        style={{ background: navBg, borderBottom: border }}>
        {ITEMS.map((item) => (
          <button key={item.key}
            className={`nav-mobile-link${page === item.key ? " active" : ""}`}
            style={{ color: page === item.key ? "#1565C0" : mutedCol }}
            onClick={() => go(item.key)}>
            {label(item)}
          </button>
        ))}
        {user && onLogout && (
          <button className="nav-mobile-link" style={{ color:"#E64A19", borderTop:"1.5px solid #E3F2FD" }}
            onClick={() => { onLogout(); setOpen(false); }}>
            {lang === "uz" ? "Chiqish" : lang === "en" ? "Logout" : "Выйти"}
          </button>
        )}
      </div>
    </>
  );
}
