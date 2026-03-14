import { t } from "../i18n";

const NAV_ITEMS = ["home","tasks","quiz","results","develop"];

export default function Nav({ page, setPage, lang = "ru", dark = false, user, onLogout }) {
  return (
    <nav style={{ ...S.nav, ...(dark ? S.navDark : {}) }}>
      <div style={S.logo} onClick={() => setPage("home")}>
        🌟 <span style={{ ...S.logoText, ...(dark ? S.logoTextDark : {}) }}>Карта Талантов</span>
      </div>

      <div style={S.links}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item}
            onClick={() => setPage(item)}
            style={{ ...S.link, ...(page === item ? S.linkActive : {}), ...(dark ? S.linkDark : {}) }}
          >
            {t(lang, `nav.${item}`)}
          </button>
        ))}
      </div>

      {user && onLogout && (
        <button onClick={onLogout} style={{ ...S.logout, ...(dark ? S.logoutDark : {}) }}>
          {t(lang, "nav.logout")}
        </button>
      )}
    </nav>
  );
}

const S = {
  nav:          { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 20px", background:"#fff", borderBottom:"2px solid #E3F2FD", fontFamily:"'Nunito',sans-serif", flexWrap:"wrap", gap:8, paddingRight:120 },
  navDark:      { background:"#1A2A3A", borderBottom:"2px solid #2A4070" },
  logo:         { display:"flex", alignItems:"center", gap:8, cursor:"pointer" },
  logoText:     { fontWeight:900, fontSize:"1.05rem", color:"#1565C0" },
  logoTextDark: { color:"#90CAF9" },
  links:        { display:"flex", gap:4, flexWrap:"wrap" },
  link:         { border:"none", background:"transparent", fontFamily:"'Nunito',sans-serif", fontWeight:700, fontSize:"0.85rem", color:"#90A4AE", cursor:"pointer", padding:"6px 12px", borderRadius:10, transition:"all 0.15s" },
  linkActive:   { background:"#E3F2FD", color:"#1565C0" },
  linkDark:     { color:"#B0BEC5" },
  logout:       { border:"none", background:"#FFF3E0", color:"#E64A19", fontFamily:"'Nunito',sans-serif", fontWeight:800, fontSize:"0.82rem", cursor:"pointer", padding:"6px 14px", borderRadius:10 },
  logoutDark:   { background:"#2A1A0A", color:"#FF7043" },
};
