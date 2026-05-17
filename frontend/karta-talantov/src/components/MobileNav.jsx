import { useEffect, useState } from "react";

const TABS = [
  { key:"home",    icon:"🏠", ru:"Главная", uz:"Bosh",    en:"Home"    },
  { key:"quiz",    icon:"🎯", ru:"Тест",    uz:"Test",    en:"Quiz"    },
  { key:"results", icon:"🌟", ru:"Итоги",   uz:"Natija",  en:"Results" },
  { key:"develop", icon:"📚", ru:"Развитие",uz:"Rivojl.", en:"Develop" },
  { key:"tasks",   icon:"🎮", ru:"Задания", uz:"Vazifa",  en:"Tasks"   },
];

export default function MobileNav({ page, setPage, lang, dark }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => setVisible(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!visible) return null;

  return (
    <nav className={`mobile-bottom-nav${dark?" dark-nav":""}`} aria-label="Mobile navigation">
      <div className="mobile-nav-items">
        {TABS.map(tab => {
          const isActive = page === tab.key;
          return (
            <button key={tab.key} className="mobile-nav-item"
              onClick={() => setPage(tab.key)}
              style={{ color: isActive ? "#0F6E56" : dark ? "#607D8B" : "#90A4AE",
                       background: isActive ? "rgba(15,110,86,0.08)" : "transparent" }}
              aria-label={tab[lang] || tab.en}
              aria-current={isActive ? "page" : undefined}>
              <span className="mobile-nav-icon" style={{ filter: isActive ? "none" : "grayscale(0.5) opacity(0.6)" }}>
                {tab.icon}
              </span>
              <span className="mobile-nav-label" style={{ color: isActive ? "#0F6E56" : dark ? "#607D8B" : "#90A4AE" }}>
                {tab[lang] || tab.en}
              </span>
              {isActive && (
                <div style={{ position:"absolute", top:0, left:"50%", transform:"translateX(-50%)", width:24, height:2, background:"linear-gradient(90deg,#0F6E56,#5DCAA5)", borderRadius:99 }} />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
