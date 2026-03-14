import Nav from "../components/Nav";
import { t } from "../i18n";

export default function DevelopPage({ setPage, lang, dark }) {
  return (
    <div className="page-wrap">
      <Nav page="develop" setPage={setPage} lang={lang} dark={dark} />

      <div className="develop-section">
        <div className="develop-banner">
          <div className="develop-banner-title">{t(lang,"develop.banner")}</div>
          <span style={{ color:"#fff", fontSize:"0.95rem", fontWeight:700 }}>
            {t(lang,"develop.personal")}
          </span>
        </div>

        <div className="develop-content">
          <div className="develop-left">
            <div className="develop-card">
              <div className="develop-card-title">{t(lang,"develop.fits")}</div>
              <ul>
                <li><span className="check">✔</span> {t(lang,"develop.tip1")}</li>
                <li><span className="check">✔</span> {t(lang,"develop.tip2")}</li>
                <li><span className="check">✔</span> {t(lang,"develop.tip3")}</li>
              </ul>
            </div>
            <div className="develop-card">
              <div className="develop-card-title">{t(lang,"develop.careers")}</div>
              <ul>
                <li><span style={{ color:"#FF7043", fontSize:"1.1rem" }}>✔</span> {t(lang,"develop.course")}</li>
                <li><span style={{ color:"#FF7043", fontSize:"1.1rem" }}>✔</span> {t(lang,"develop.robotics")}</li>
                <li><span style={{ color:"#FF7043", fontSize:"1.1rem" }}>✔</span> {t(lang,"develop.chess")}</li>
              </ul>
            </div>
          </div>

          <div className="develop-right">
            <div className="robot-box">
              🤖
              <div style={{ fontSize:"1rem", fontWeight:800, color:"#1565C0", marginTop:10 }}>
                {t(lang,"develop.helper")}
              </div>
            </div>
            <div className="map-box">
              <div className="map-box-title">{t(lang,"develop.nearby")}</div>
              <div className="map-pin-row">📌 IT School Tashkent</div>
              <div className="map-pin-row">📌 Robotics Hub</div>
              <div className="map-pin-row">📌 Chess Academy</div>
            </div>
          </div>
        </div>

        <div style={{ display:"flex", gap:16, marginTop:28, justifyContent:"center" }}>
          <button className="quiz-next" style={{ background:"#1565C0" }} onClick={() => setPage("home")}>
            {t(lang,"develop.toHome")}
          </button>
          <button className="quiz-next" onClick={() => setPage("tasks")}>
            {t(lang,"develop.toTasks")}
          </button>
        </div>
      </div>
    </div>
  );
}
