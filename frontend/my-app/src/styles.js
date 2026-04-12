const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Nunito', sans-serif;
    background: #F0F7FF;
    color: #1A237E;
    min-height: 100vh;
    overflow-x: hidden;
  }

  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      radial-gradient(circle at 15% 20%, rgba(21,101,192,0.07) 0%, transparent 50%),
      radial-gradient(circle at 85% 80%, rgba(255,112,67,0.07) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .page-wrap {
    min-height: 100vh;
    position: relative;
    z-index: 1;
    animation: pageIn 0.45s cubic-bezier(0.22,1,0.36,1) both;
    padding-bottom: 100px;
  }

  @keyframes pageIn {
    from { opacity:0; transform:translateY(18px); }
    to   { opacity:1; transform:translateY(0); }
  }

  /* ── NAV ── */
  .nav-bar {
    display: flex;
    align-items: center;
    padding: 12px 24px;
    background: rgba(255,255,255,0.92);
    border-bottom: 1.5px solid rgba(21,101,192,0.10);
    box-shadow: 0 2px 20px rgba(21,101,192,0.07);
    position: sticky;
    top: 0;
    z-index: 200;
    backdrop-filter: blur(12px);
    gap: 8px;
  }

  .nav-logo {
    font-family: 'Fredoka One', cursive;
    font-size: 1.1rem;
    color: #1565C0;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }

  .nav-links {
    display: flex;
    gap: 4px;
    flex: 1;
    justify-content: center;
    flex-wrap: wrap;
  }

  .nav-link {
    border: none;
    background: transparent;
    font-family: 'Nunito', sans-serif;
    font-weight: 700;
    font-size: 0.85rem;
    color: #90A4AE;
    cursor: pointer;
    padding: 6px 10px;
    border-radius: 10px;
    transition: all 0.15s;
  }

  .nav-link.active {
    background: #E3F2FD;
    color: #1565C0;
  }

  .nav-hamburger {
    display: none;
    flex-direction: column;
    gap: 5px;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 6px;
    margin-left: auto;
    flex-shrink: 0;
  }

  .nav-hamburger span {
    display: block;
    width: 24px;
    height: 2.5px;
    background: #1565C0;
    border-radius: 99px;
    transition: all 0.25s;
  }

  .nav-mobile-menu {
    display: none;
    flex-direction: column;
    background: #fff;
    border-bottom: 2px solid #E3F2FD;
    box-shadow: 0 8px 32px rgba(21,101,192,0.10);
    position: sticky;
    top: 57px;
    z-index: 199;
  }

  .nav-mobile-menu.open { display: flex; }

  .nav-mobile-link {
    border: none;
    background: transparent;
    font-family: 'Nunito', sans-serif;
    font-weight: 800;
    font-size: 1rem;
    color: #546E7A;
    cursor: pointer;
    padding: 14px 24px;
    text-align: left;
    border-bottom: 1px solid #F0F7FF;
    transition: background 0.15s;
  }

  .nav-mobile-link.active {
    background: #E3F2FD;
    color: #1565C0;
  }

  /* ── PROGRESS BAR ── */
  .progress-bar-wrap {
    height: 8px;
    background: rgba(21,101,192,0.10);
    border-radius: 99px;
    overflow: hidden;
    margin: 0 20px;
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #1565C0, #42A5F5, #FF7043);
    border-radius: 99px;
    transition: width 0.5s cubic-bezier(0.34,1.56,0.64,1);
    animation: shimmer 2.5s linear infinite;
    background-size: 200% 100%;
  }

  @keyframes shimmer {
    0%   { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }

  /* ── HERO ── */
  .hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 48px 32px 40px;
    background: linear-gradient(135deg, #E3F2FD 0%, #FFF8E1 100%);
    gap: 24px;
  }

  .hero-text { flex: 1; }

  .hero-title {
    font-family: 'Fredoka One', cursive;
    font-size: 2.6rem;
    color: #1565C0;
    line-height: 1.15;
  }

  .hero-cta {
    display: inline-block;
    margin-top: 24px;
    padding: 14px 32px;
    background: linear-gradient(135deg, #1565C0, #1976D2);
    color: #fff;
    border: none;
    border-radius: 50px;
    font-family: 'Fredoka One', cursive;
    font-size: 1.1rem;
    cursor: pointer;
    box-shadow: 0 6px 24px rgba(21,101,192,0.35);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .hero-cta:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(21,101,192,0.45); }
  .hero-cta:active { transform: scale(0.97); }

  .hero-icons {
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex-shrink: 0;
  }

  .hero-icon {
    font-size: 2.2rem;
    animation: float 3s ease-in-out infinite;
  }
  .hero-icon:nth-child(2) { animation-delay: 0.6s; }
  .hero-icon:nth-child(3) { animation-delay: 1.2s; }

  @keyframes float {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-8px); }
  }

  /* ── STEPS ── */
  .steps {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 36px 24px;
    flex-wrap: wrap;
  }

  .step {
    background: #fff;
    border-radius: 20px;
    padding: 24px 20px;
    text-align: center;
    min-width: 140px;
    border: 2px solid #E3F2FD;
    box-shadow: 0 4px 16px rgba(21,101,192,0.07);
    flex: 1;
    max-width: 220px;
  }

  .step-icon  { font-size: 2rem; margin-bottom: 10px; }
  .step-title { font-weight: 900; color: #1565C0; font-size: 0.95rem; margin-bottom: 4px; }
  .step-desc  { font-size: 0.8rem; color: #78909C; font-weight: 600; }
  .step-arrow { font-size: 2rem; color: #BBDEFB; padding: 0 4px; flex-shrink: 0; }

  /* ── QUIZ ── */
  .quiz-section {
    max-width: 600px;
    margin: 24px auto;
    padding: 32px 28px;
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 8px 40px rgba(21,101,192,0.10);
  }

  .quiz-counter {
    font-size: 0.82rem;
    font-weight: 800;
    color: #90A4AE;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 12px;
  }

  .quiz-q {
    font-family: 'Fredoka One', cursive;
    font-size: 1.3rem;
    color: #1565C0;
    margin-bottom: 20px;
    line-height: 1.4;
  }

  .quiz-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 20px;
  }

  .quiz-option {
    padding: 13px 16px;
    border: 2px solid #E3F2FD;
    border-radius: 14px;
    background: #F8FBFF;
    font-family: 'Nunito', sans-serif;
    font-size: 0.93rem;
    font-weight: 700;
    color: #37474F;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s;
    -webkit-tap-highlight-color: transparent;
  }

  .quiz-option:hover   { border-color: #90CAF9; background: #EEF6FF; }
  .quiz-option.selected { border-color: #1565C0; background: #E3F2FD; color: #1565C0; }

  .quiz-next {
    width: 100%;
    padding: 15px;
    background: linear-gradient(135deg, #FF7043, #FF8A65);
    color: #fff;
    border: none;
    border-radius: 16px;
    font-family: 'Fredoka One', cursive;
    font-size: 1.1rem;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(255,112,67,0.35);
    transition: transform 0.2s, box-shadow 0.2s;
    -webkit-tap-highlight-color: transparent;
  }

  .quiz-next:hover:not(:disabled) { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(255,112,67,0.45); }
  .quiz-next:active:not(:disabled) { transform: scale(0.97); }

  /* ── RESULTS ── */
  .map-section {
    max-width: 860px;
    margin: 24px auto;
    padding: 28px;
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 8px 40px rgba(21,101,192,0.10);
  }

  .map-banner {
    background: linear-gradient(135deg, #1565C0, #1976D2, #FF7043);
    background-size: 200%;
    border-radius: 16px;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    animation: gradientShift 4s ease infinite;
  }

  @keyframes gradientShift {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }

  .map-banner-title {
    font-family: 'Fredoka One', cursive;
    font-size: 1.2rem;
    color: #fff;
  }

  .map-banner-stars { font-size: 1.2rem; }

  .map-progress-row {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
  }

  .map-progress-label { font-weight: 800; color: #1565C0; font-size: 0.88rem; white-space: nowrap; }
  .map-progress-bar   { flex: 1; height: 10px; background: #E3F2FD; border-radius: 99px; overflow: hidden; }
  .map-progress-fill  { height: 100%; background: linear-gradient(90deg,#1565C0,#42A5F5,#FF7043); border-radius: 99px; transition: width 1s; }

  .map-content { display: flex; gap: 24px; flex-wrap: wrap; align-items: flex-start; }

  .radar-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .radar-svg { filter: drop-shadow(0 4px 16px rgba(21,101,192,0.15)); }

  .radar-labels {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
    max-width: 280px;
  }

  .radar-label {
    font-size: 0.76rem;
    font-weight: 800;
    background: rgba(21,101,192,0.06);
    padding: 3px 10px;
    border-radius: 99px;
  }

  .strengths-box {
    flex: 1;
    min-width: 200px;
    background: #F8FBFF;
    border-radius: 18px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .strengths-title { font-family:'Fredoka One',cursive; font-size:0.95rem; color:#1565C0; margin-bottom:8px; }

  .strengths-list, .prof-list { list-style: none; display: flex; flex-direction: column; gap: 8px; }

  .strengths-list li, .prof-list li {
    font-size: 0.88rem;
    font-weight: 700;
    color: #37474F;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #fff;
    border-radius: 10px;
    border: 1.5px solid #E3F2FD;
  }

  .check { color: #1565C0; font-weight: 900; }

  /* ── DEVELOP ── */
  .develop-section {
    max-width: 860px;
    margin: 24px auto;
    padding: 28px;
    background: #fff;
    border-radius: 24px;
    box-shadow: 0 8px 40px rgba(21,101,192,0.10);
  }

  .develop-banner {
    background: linear-gradient(135deg, #FF7043, #FF8A65);
    border-radius: 16px;
    padding: 16px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .develop-banner-title { font-family:'Fredoka One',cursive; font-size:1.2rem; color:#fff; }

  .develop-content { display: flex; gap: 20px; flex-wrap: wrap; }
  .develop-left, .develop-right { flex: 1; min-width: 200px; display: flex; flex-direction: column; gap: 14px; }

  .develop-card {
    background: #F8FBFF;
    border-radius: 16px;
    padding: 18px;
    border: 1.5px solid #E3F2FD;
  }

  .develop-card-title { font-family:'Fredoka One',cursive; font-size:0.95rem; color:#1565C0; margin-bottom:10px; }
  .develop-card ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .develop-card li { font-size: 0.86rem; font-weight: 700; color: #546E7A; display: flex; gap: 8px; align-items: flex-start; }

  /* ── TASKS ── */
  .task-section {
    max-width: 680px;
    margin: 24px auto;
    padding: 28px 20px;
  }

  .task-title { font-family:'Fredoka One',cursive; font-size:1.5rem; color:#1565C0; margin-bottom:20px; text-align:center; }

  .task-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .task-card {
    border-radius: 18px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(21,101,192,0.10);
    transition: transform 0.2s, box-shadow 0.2s;
    -webkit-tap-highlight-color: transparent;
  }

  .task-card:active { transform: scale(0.97); }

  .task-card-header {
    padding: 12px 14px;
    font-family: 'Fredoka One', cursive;
    font-size: 0.9rem;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .task-card-body { background: #fff; padding: 18px; text-align: center; }
  .task-card-emoji { font-size: 2.2rem; margin-bottom: 8px; }
  .task-card-desc  { font-size: 0.85rem; font-weight: 700; color: #546E7A; }

  /* ── LANG SWITCHER (bottom pill) ── */
  .lang-dark-pill {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 300;
    display: flex;
    align-items: center;
    gap: 4px;
    background: rgba(255,255,255,0.92);
    border: 1.5px solid #E3F2FD;
    border-radius: 99px;
    padding: 6px 12px;
    box-shadow: 0 4px 20px rgba(21,101,192,0.15);
    backdrop-filter: blur(10px);
  }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(21,101,192,0.25); border-radius: 99px; }

  ::selection { background: rgba(21,101,192,0.18); color: #1565C0; }

  button:focus-visible { outline: 3px solid rgba(21,101,192,0.5); outline-offset: 2px; }

  @keyframes cardPop {
    from { opacity:0; transform:scale(0.93) translateY(16px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }

  @keyframes listItemIn {
    from { opacity:0; transform:translateX(-16px); }
    to   { opacity:1; transform:translateX(0); }
  }

  /* ══════════════════════════════════════════════════════
     TABLET — max 768px
  ══════════════════════════════════════════════════════ */
  @media (max-width: 768px) {

    /* Nav — hide desktop links, show hamburger */
    .nav-links   { display: none !important; }
    .nav-hamburger { display: flex !important; }
    .nav-bar { padding: 12px 16px; }

    /* Hero — stack vertically */
    .hero {
      flex-direction: column;
      text-align: center;
      padding: 28px 20px 24px;
    }

    .hero-text { width: 100%; }
    .hero-title { font-size: 2rem; }

    .hero-icons {
      flex-direction: row;
      justify-content: center;
    }

    /* Steps — vertical stack */
    .steps { flex-direction: column; align-items: stretch; padding: 20px 16px; gap: 0; }
    .step   { max-width: 100%; padding: 16px; }
    .step-arrow { transform: rotate(90deg); text-align: center; padding: 4px 0; }

    /* Quiz */
    .quiz-section { margin: 14px 12px; padding: 22px 16px; border-radius: 20px; }
    .quiz-q       { font-size: 1.1rem; }
    .quiz-option  { font-size: 0.88rem; padding: 12px 14px; }

    /* Results */
    .map-section  { margin: 14px 12px; padding: 18px 14px; border-radius: 20px; }
    .map-banner   { flex-direction: column; text-align: center; gap: 4px; padding: 12px 14px; }
    .map-banner-title { font-size: 1rem; }
    .map-content  { flex-direction: column; }
    .radar-svg    { width: 200px !important; height: 200px !important; }
    .strengths-box { min-width: 100%; padding: 16px; }

    /* Develop */
    .develop-section { margin: 14px 12px; padding: 18px 14px; border-radius: 20px; }
    .develop-banner  { flex-direction: column; text-align: center; gap: 4px; }
    .develop-banner-title { font-size: 1rem; }
    .develop-content { flex-direction: column; }
    .develop-left, .develop-right { min-width: 100%; }

    /* Tasks */
    .task-section { margin: 14px 12px; padding: 18px 12px; }
    .task-grid    { grid-template-columns: 1fr 1fr; gap: 10px; }
    .task-card-body  { padding: 14px 10px; }
    .task-card-emoji { font-size: 1.8rem; }
    .task-card-desc  { font-size: 0.78rem; }
  }

  /* ══════════════════════════════════════════════════════
     SMALL PHONE — max 480px
  ══════════════════════════════════════════════════════ */
  @media (max-width: 480px) {

    .hero-title { font-size: 1.7rem; }
    .hero-cta   { font-size: 0.95rem; padding: 12px 24px; }

    .quiz-section { margin: 10px 8px; padding: 18px 12px; }
    .quiz-q       { font-size: 1rem; }
    .quiz-option  { font-size: 0.84rem; padding: 11px 12px; }
    .quiz-next    { font-size: 0.95rem; padding: 13px; }

    .map-section, .develop-section { margin: 10px 8px; padding: 14px 10px; }

    .task-section { margin: 10px 8px; padding: 14px 8px; }
    .task-grid    { grid-template-columns: 1fr 1fr; gap: 8px; }
    .task-card-header { font-size: 0.75rem; padding: 8px 10px; }

    .map-progress-row { flex-wrap: wrap; }
  }
`;

export default styles;
