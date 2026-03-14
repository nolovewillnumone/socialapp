import Nav from "../components/Nav";
import { t } from "../i18n";

export default function HomePage({ setPage, user, onLogout, lang, dark }) {
  return (
    <div className="page-wrap">
      <Nav page="home" setPage={setPage} lang={lang} dark={dark} user={user} onLogout={onLogout} />

      <div className="hero">
        <div className="hero-text">
          <h1 className="hero-title">{t(lang, "home.title")}</h1>
          <button className="hero-cta" onClick={() => setPage("quiz")}>
            {t(lang, "home.cta")}
          </button>
        </div>
        <div className="hero-icons">
          <div className="hero-icon">💡</div>
          <div className="hero-icon">🚀</div>
          <div className="hero-icon">📚</div>
        </div>
      </div>

      <div className="steps">
        <div className="step">
          <div className="step-icon">🎮</div>
          <div className="step-title">{t(lang, "home.step1")}</div>
          <div className="step-desc">{t(lang, "home.step1desc")}</div>
        </div>
        <div className="step-arrow">›</div>
        <div className="step">
          <div className="step-icon">📊</div>
          <div className="step-title">{t(lang, "home.step2")}</div>
          <div className="step-desc">{t(lang, "home.step2desc")}</div>
        </div>
        <div className="step-arrow">›</div>
        <div className="step">
          <div className="step-icon">🚀</div>
          <div className="step-title">{t(lang, "home.step3")}</div>
          <div className="step-desc">{t(lang, "home.step3desc")}</div>
        </div>
      </div>
    </div>
  );
}
