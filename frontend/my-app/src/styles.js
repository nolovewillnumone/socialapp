const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Russo+One&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Nunito', sans-serif;
    background: #1565C0;
    min-height: 100vh;
  }

  :root {
    --blue-dark: #1565C0;
    --blue-mid:  #1976D2;
    --blue-light:#42A5F5;
    --blue-pale: #E3F2FD;
    --orange:    #FF7043;
    --orange-lt: #FF8A65;
    --yellow:    #FFD740;
    --green:     #66BB6A;
    --teal:      #26C6DA;
    --red:       #EF5350;
    --purple:    #7E57C2;
    --white:     #FFFFFF;
    --card-bg:   #FFFFFF;
    --text-dark: #1A237E;
    --text-mid:  #37474F;
    --radius:    18px;
    --shadow:    0 8px 32px rgba(21,101,192,0.18);
  }

  .page-wrap {
    min-height: 100vh;
    background: linear-gradient(160deg, #1565C0 0%, #1976D2 40%, #0D47A1 100%);
  }

  /* ── NAV ── */
  .nav {
    display: flex; align-items: center; justify-content: space-between;
    padding: 14px 36px;
    background: rgba(255,255,255,0.97);
    box-shadow: 0 2px 12px rgba(21,101,192,0.13);
    position: sticky; top: 0; z-index: 100;
  }
  .nav-logo {
    display: flex; align-items: center; gap: 10px;
    font-family: 'Russo One', sans-serif;
    font-size: 1.25rem; color: var(--blue-dark);
    text-transform: uppercase; letter-spacing: 1px; cursor: pointer;
  }
  .nav-logo span { font-size: 1.7rem; }
  .nav-links { display: flex; align-items: center; gap: 28px; }
  .nav-link {
    font-weight: 700; font-size: 0.92rem; color: var(--text-mid);
    cursor: pointer; transition: color .2s; background: none; border: none;
  }
  .nav-link:hover { color: var(--blue-dark); }
  .nav-btn {
    background: var(--blue-mid); color: #fff; border: none; border-radius: 25px;
    padding: 9px 26px; font-weight: 800; font-size: 0.95rem; cursor: pointer;
    transition: background .2s, transform .1s;
  }
  .nav-btn:hover { background: var(--blue-dark); transform: scale(1.04); }

  /* ── PROGRESS BAR ── */
  .progress-bar-wrap {
    background: #e0e0e0; border-radius: 8px; height: 10px;
    margin: 0 36px; overflow: hidden;
  }
  .progress-bar-fill {
    height: 100%; border-radius: 8px;
    background: linear-gradient(90deg, #66BB6A, #00E676);
    transition: width .5s ease;
  }

  /* ── HERO ── */
  .hero {
    background: linear-gradient(120deg, #1565C0 0%, #1976D2 55%, #0D47A1 100%);
    padding: 48px 60px 52px;
    display: flex; align-items: center; justify-content: space-between;
    position: relative; overflow: hidden;
  }
  .hero::before {
    content:''; position:absolute; right:-60px; top:-60px;
    width:340px; height:340px; border-radius:50%;
    background: rgba(255,255,255,0.05);
  }
  .hero-text { max-width: 420px; }
  .hero-title {
    font-family: 'Russo One', sans-serif;
    font-size: 3rem; color: #fff; line-height: 1.1;
    margin-bottom: 28px; text-shadow: 0 2px 8px rgba(0,0,0,0.18);
  }
  .hero-cta {
    background: var(--orange); color: #fff; border: none; border-radius: 40px;
    padding: 16px 52px; font-size: 1.3rem; font-weight: 900; cursor: pointer;
    box-shadow: 0 6px 24px rgba(255,112,67,0.45);
    transition: transform .15s, box-shadow .15s;
    text-transform: uppercase; letter-spacing: 1px;
    font-family: 'Russo One', sans-serif;
  }
  .hero-cta:hover { transform: translateY(-2px) scale(1.04); box-shadow: 0 10px 32px rgba(255,112,67,0.55); }
  .hero-icons { display: flex; gap: 16px; }
  .hero-icon { font-size: 4.5rem; animation: float 3s ease-in-out infinite; }
  .hero-icon:nth-child(2) { animation-delay: .8s; }
  .hero-icon:nth-child(3) { animation-delay: 1.6s; }
  @keyframes float {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-14px); }
  }

  /* ── STEPS ── */
  .steps {
    background: #fff;
    display: flex; align-items: center; justify-content: center;
    padding: 32px 60px;
  }
  .step { display: flex; flex-direction: column; align-items: center; flex: 1; }
  .step-icon { font-size: 2.8rem; margin-bottom: 10px; }
  .step-title { font-weight: 900; font-size: 1.15rem; color: var(--blue-dark); margin-bottom: 4px; }
  .step-desc { font-size: 0.88rem; color: #607D8B; text-align: center; max-width: 160px; }
  .step-arrow { font-size: 2rem; color: var(--blue-light); flex-shrink: 0; padding: 0 8px; margin-bottom: 22px; }

  /* ── TASK GRID ── */
  .task-section { background: #fff; padding: 36px 60px 48px; }
  .task-title {
    font-family: 'Russo One', sans-serif;
    font-size: 1.7rem; color: var(--blue-dark);
    text-align: center; margin-bottom: 28px;
  }
  .task-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
  .task-card {
    border-radius: var(--radius); overflow: hidden;
    box-shadow: var(--shadow);
    display: flex; flex-direction: column; align-items: center;
    cursor: pointer; transition: transform .18s, box-shadow .18s;
  }
  .task-card:hover { transform: translateY(-6px) scale(1.03); box-shadow: 0 16px 40px rgba(21,101,192,0.22); }
  .task-card-header {
    width: 100%; padding: 12px 18px;
    display: flex; align-items: center; gap: 10px;
    font-family: 'Russo One', sans-serif; font-size: 1rem;
    color: #fff; letter-spacing: .5px;
  }
  .task-card-body {
    background: #fff; width: 100%;
    display: flex; flex-direction: column; align-items: center;
    padding: 20px 16px; flex: 1;
  }
  .task-card-emoji { font-size: 3.4rem; margin-bottom: 12px; }
  .task-card-desc { font-size: 0.95rem; font-weight: 700; color: var(--text-dark); text-align: center; }

  /* ── TALENT MAP ── */
  .map-section { background: #fff; padding: 12px 60px 48px; }
  .map-banner {
    background: linear-gradient(120deg, #1565C0 0%, #0D47A1 100%);
    border-radius: 18px; padding: 22px 36px;
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 30px;
  }
  .map-banner-title { font-family: 'Russo One', sans-serif; font-size: 1.9rem; color: #fff; }
  .map-banner-stars { font-size: 2rem; }
  .map-progress-row { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
  .map-progress-label { font-weight: 800; color: var(--blue-dark); font-size: 1rem; white-space: nowrap; }
  .map-progress-bar { flex: 1; height: 12px; background: #e0e0e0; border-radius: 8px; overflow: hidden; }
  .map-progress-fill { height: 100%; border-radius: 8px; background: linear-gradient(90deg, #42A5F5, #1565C0); }
  .map-content { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
  .radar-wrap { display: flex; flex-direction: column; align-items: center; }
  .radar-labels { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-top: 16px; }
  .radar-label { font-weight: 800; font-size: 0.95rem; display: flex; align-items: center; gap: 5px; }
  .strengths-box {
    background: #F8FBFF; border-radius: 14px;
    padding: 22px 24px; box-shadow: 0 2px 12px rgba(21,101,192,0.08);
    display: flex; flex-direction: column; gap: 18px;
  }
  .strengths-title { font-weight: 900; font-size: 1.05rem; color: var(--blue-dark); margin-bottom: 6px; }
  .strengths-list { list-style: none; display: flex; flex-direction: column; gap: 7px; }
  .strengths-list li { display: flex; align-items: center; gap: 8px; font-size: 0.95rem; color: var(--text-mid); font-weight: 600; }
  .check { color: var(--green); font-size: 1.1rem; }
  .prof-list { list-style: none; display: flex; flex-direction: column; gap: 7px; }
  .prof-list li { display: flex; align-items: center; gap: 8px; font-size: 0.95rem; color: var(--text-mid); font-weight: 600; }

  /* ── DEVELOP PAGE ── */
  .develop-section { background: #fff; padding: 12px 60px 48px; }
  .develop-banner {
    background: linear-gradient(120deg, #FFB300 0%, #FF7043 100%);
    border-radius: 18px; padding: 28px 40px; margin-bottom: 30px;
  }
  .develop-banner-title { font-family: 'Russo One', sans-serif; font-size: 2rem; color: #fff; margin-bottom: 4px; }
  .develop-content { display: grid; grid-template-columns: 1fr 1fr; gap: 32px; }
  .develop-left { display: flex; flex-direction: column; gap: 22px; }
  .develop-card {
    background: #F8FBFF; border-radius: 14px;
    padding: 22px 24px; box-shadow: 0 2px 12px rgba(21,101,192,0.08);
  }
  .develop-card-title { font-weight: 900; font-size: 1.1rem; color: var(--blue-dark); margin-bottom: 12px; }
  .develop-card ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .develop-card li { display: flex; align-items: center; gap: 8px; font-size: 0.95rem; color: var(--text-mid); font-weight: 600; }
  .develop-right { display: flex; flex-direction: column; gap: 22px; }
  .robot-box {
    background: linear-gradient(135deg, #E3F2FD, #BBDEFB);
    border-radius: 14px; padding: 24px; text-align: center; font-size: 5rem;
  }
  .map-box { background: #E8F5E9; border-radius: 14px; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
  .map-box-title { font-weight: 900; font-size: 1rem; color: var(--blue-dark); }
  .map-pin-row { display: flex; align-items: center; gap: 6px; font-weight: 700; color: var(--text-mid); font-size: 0.9rem; }

  /* ── QUIZ ── */
  .quiz-section { background: #fff; padding: 36px 60px 48px; }
  .quiz-q { font-weight: 900; font-size: 1.2rem; color: var(--text-dark); margin-bottom: 20px; }
  .quiz-options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 28px; }
  .quiz-option {
    padding: 14px 22px; border-radius: 12px;
    border: 2.5px solid #BBDEFB; background: #F8FBFF;
    font-weight: 700; font-size: 1rem; color: var(--text-dark);
    cursor: pointer; transition: all .18s; text-align: left;
  }
  .quiz-option:hover, .quiz-option.selected { background: var(--blue-mid); color: #fff; border-color: var(--blue-mid); }
  .quiz-next {
    background: var(--orange); color: #fff; border: none;
    border-radius: 30px; padding: 13px 42px;
    font-size: 1.05rem; font-weight: 900; cursor: pointer;
    transition: transform .15s; font-family: 'Nunito', sans-serif;
  }
  .quiz-next:hover { transform: scale(1.04); }
  .quiz-counter { font-size: 0.9rem; color: #90A4AE; font-weight: 700; margin-bottom: 10px; }
  .radar-svg { filter: drop-shadow(0 4px 16px rgba(21,101,192,0.15)); }

  @media (max-width: 900px) {
    .task-grid { grid-template-columns: 1fr 1fr; }
    .map-content, .develop-content { grid-template-columns: 1fr; }
    .hero { flex-direction: column; gap: 24px; padding: 32px 24px; }
    .hero-title { font-size: 2rem; }
    .steps { flex-direction: column; padding: 24px; }
    .step-arrow { transform: rotate(90deg); }
  }
`;

export default globalStyles;
