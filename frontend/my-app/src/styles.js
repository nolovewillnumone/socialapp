// src/styles.js — Global CSS with animations and effects

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');

  /* ── Reset & Base ──────────────────────────────────────────────────────── */
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Nunito', sans-serif;
    background: #F0F7FF;
    color: #1A237E;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── Floating background particles ────────────────────────────────────── */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      radial-gradient(circle at 15% 20%, rgba(21,101,192,0.07) 0%, transparent 50%),
      radial-gradient(circle at 85% 80%, rgba(255,112,67,0.07) 0%, transparent 50%),
      radial-gradient(circle at 50% 50%, rgba(102,187,106,0.04) 0%, transparent 60%);
    pointer-events: none;
    z-index: 0;
  }

  /* ── Page wrapper ──────────────────────────────────────────────────────── */
  .page-wrap {
    min-height: 100vh;
    position: relative;
    z-index: 1;
    animation: pageIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes pageIn {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Navbar ────────────────────────────────────────────────────────────── */
  nav {
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    background: rgba(255, 255, 255, 0.82) !important;
    border-bottom: 1.5px solid rgba(21, 101, 192, 0.10) !important;
    box-shadow: 0 2px 20px rgba(21, 101, 192, 0.07);
    position: sticky;
    top: 0;
    z-index: 100;
    animation: navSlide 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @keyframes navSlide {
    from { opacity: 0; transform: translateY(-100%); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Progress bar ──────────────────────────────────────────────────────── */
  .progress-bar-wrap {
    height: 8px;
    background: rgba(21, 101, 192, 0.10);
    border-radius: 99px;
    overflow: hidden;
    margin: 0 20px;
  }

  .progress-bar-fill {
    height: 100%;
    background: linear-gradient(90deg, #1565C0, #42A5F5, #FF7043);
    background-size: 200% 100%;
    border-radius: 99px;
    transition: width 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    animation: shimmer 2.5s linear infinite;
  }

  @keyframes shimmer {
    0%   { background-position: 100% 0; }
    100% { background-position: -100% 0; }
  }

  /* ── Hero ──────────────────────────────────────────────────────────────── */
  .hero {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 48px 32px 40px;
    background: linear-gradient(135deg, #E3F2FD 0%, #FFF8E1 100%);
    position: relative;
    overflow: hidden;
  }

  .hero::after {
    content: '';
    position: absolute;
    top: -60px; right: -60px;
    width: 280px; height: 280px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(255,112,67,0.12), transparent 70%);
    pointer-events: none;
    animation: pulse 4s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1);   opacity: 0.7; }
    50%       { transform: scale(1.1); opacity: 1;   }
  }

  .hero-title {
    font-family: 'Fredoka One', cursive;
    font-size: 2.6rem;
    color: #1565C0;
    line-height: 1.15;
    animation: heroTitle 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.1s both;
  }

  @keyframes heroTitle {
    from { opacity: 0; transform: translateX(-30px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .hero-cta {
    margin-top: 24px;
    padding: 14px 32px;
    background: linear-gradient(135deg, #1565C0, #1976D2);
    color: #fff;
    border: none;
    border-radius: 50px;
    font-family: 'Fredoka One', cursive;
    font-size: 1.15rem;
    cursor: pointer;
    box-shadow: 0 6px 24px rgba(21, 101, 192, 0.35);
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
    animation: heroBtn 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both;
    position: relative;
    overflow: hidden;
  }

  .hero-cta::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 0; height: 0;
    background: rgba(255,255,255,0.25);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.4s ease, height 0.4s ease;
  }

  .hero-cta:hover::after { width: 200px; height: 200px; }
  .hero-cta:hover { transform: translateY(-3px) scale(1.04); box-shadow: 0 12px 32px rgba(21, 101, 192, 0.45); }
  .hero-cta:active { transform: scale(0.97); }

  @keyframes heroBtn {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .hero-icons {
    display: flex;
    flex-direction: column;
    gap: 14px;
    animation: heroIcons 0.6s cubic-bezier(0.22, 1, 0.36, 1) 0.3s both;
  }

  @keyframes heroIcons {
    from { opacity: 0; transform: translateX(30px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .hero-icon {
    font-size: 2.2rem;
    filter: drop-shadow(0 4px 8px rgba(21,101,192,0.15));
    animation: float 3s ease-in-out infinite;
    cursor: default;
    transition: transform 0.2s;
  }
  .hero-icon:nth-child(1) { animation-delay: 0s; }
  .hero-icon:nth-child(2) { animation-delay: 0.6s; }
  .hero-icon:nth-child(3) { animation-delay: 1.2s; }
  .hero-icon:hover { transform: scale(1.3) rotate(10deg); }

  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50%       { transform: translateY(-8px); }
  }

  /* ── Steps ─────────────────────────────────────────────────────────────── */
  .steps {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0;
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
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s;
    animation: stepIn 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
    cursor: default;
  }
  .step:nth-child(1) { animation-delay: 0.1s; }
  .step:nth-child(3) { animation-delay: 0.2s; }
  .step:nth-child(5) { animation-delay: 0.3s; }
  .step:hover { transform: translateY(-6px) scale(1.03); box-shadow: 0 12px 32px rgba(21,101,192,0.14); }

  @keyframes stepIn {
    from { opacity: 0; transform: translateY(30px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .step-icon { font-size: 2rem; margin-bottom: 10px; animation: float 3.5s ease-in-out infinite; }
  .step-title { font-weight: 900; color: #1565C0; font-size: 1rem; margin-bottom: 4px; }
  .step-desc  { font-size: 0.8rem; color: #78909C; font-weight: 600; }
  .step-arrow { font-size: 2rem; color: #BBDEFB; padding: 0 8px; }

  /* ── Quiz section ──────────────────────────────────────────────────────── */
  .quiz-section {
    max-width: 620px;
    margin: 32px auto;
    padding: 36px 32px;
    background: #fff;
    border-radius: 28px;
    box-shadow: 0 8px 40px rgba(21,101,192,0.10);
    border: 1.5px solid rgba(21,101,192,0.07);
    animation: cardPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  @keyframes cardPop {
    from { opacity: 0; transform: scale(0.92) translateY(20px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }

  .quiz-counter {
    font-size: 0.85rem;
    font-weight: 800;
    color: #90A4AE;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 14px;
  }

  .quiz-q {
    font-family: 'Fredoka One', cursive;
    font-size: 1.35rem;
    color: #1565C0;
    margin-bottom: 24px;
    line-height: 1.4;
  }

  .quiz-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 24px;
  }

  .quiz-option {
    padding: 14px 18px;
    border: 2px solid #E3F2FD;
    border-radius: 14px;
    background: #F8FBFF;
    font-family: 'Nunito', sans-serif;
    font-size: 0.95rem;
    font-weight: 700;
    color: #37474F;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
  }

  .quiz-option::before {
    content: '';
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 0;
    background: linear-gradient(90deg, rgba(21,101,192,0.08), transparent);
    transition: width 0.3s ease;
    border-radius: 14px 0 0 14px;
  }

  .quiz-option:hover {
    border-color: #90CAF9;
    background: #EEF6FF;
    transform: translateX(6px);
    box-shadow: 0 4px 16px rgba(21,101,192,0.10);
  }
  .quiz-option:hover::before { width: 6px; }

  .quiz-option.selected {
    border-color: #1565C0;
    background: linear-gradient(135deg, #E3F2FD, #EEF6FF);
    color: #1565C0;
    transform: translateX(6px);
    box-shadow: 0 4px 20px rgba(21,101,192,0.18);
  }
  .quiz-option.selected::before { width: 6px; background: #1565C0; }

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
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
    position: relative;
    overflow: hidden;
  }

  .quiz-next::after {
    content: '';
    position: absolute;
    top: 50%; left: 50%;
    width: 0; height: 0;
    background: rgba(255,255,255,0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.4s, height 0.4s;
  }
  .quiz-next:hover::after { width: 300px; height: 300px; }
  .quiz-next:hover:not(:disabled) { transform: translateY(-3px) scale(1.02); box-shadow: 0 10px 28px rgba(255,112,67,0.45); }
  .quiz-next:active:not(:disabled) { transform: scale(0.97); }

  /* ── Results / Map section ─────────────────────────────────────────────── */
  .map-section {
    max-width: 900px;
    margin: 32px auto;
    padding: 32px;
    background: #fff;
    border-radius: 28px;
    box-shadow: 0 8px 40px rgba(21,101,192,0.10);
    animation: cardPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .map-banner {
    background: linear-gradient(135deg, #1565C0, #1976D2, #FF7043);
    background-size: 200% 200%;
    animation: gradientShift 4s ease infinite;
    border-radius: 18px;
    padding: 18px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  @keyframes gradientShift {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .map-banner-title {
    font-family: 'Fredoka One', cursive;
    font-size: 1.3rem;
    color: #fff;
    letter-spacing: 0.04em;
    text-shadow: 0 2px 8px rgba(0,0,0,0.15);
  }

  .map-banner-stars { font-size: 1.3rem; animation: starSpin 2s ease-in-out infinite; }
  @keyframes starSpin {
    0%, 100% { transform: rotate(-5deg) scale(1); }
    50%       { transform: rotate(5deg) scale(1.1); }
  }

  .map-progress-row { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
  .map-progress-label { font-weight: 800; color: #1565C0; font-size: 0.9rem; white-space: nowrap; }
  .map-progress-bar { flex: 1; height: 10px; background: #E3F2FD; border-radius: 99px; overflow: hidden; }
  .map-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #1565C0, #42A5F5, #FF7043);
    background-size: 200%;
    border-radius: 99px;
    transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
    animation: shimmer 2.5s linear infinite;
  }

  .map-content { display: flex; gap: 28px; flex-wrap: wrap; }

  .radar-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    animation: cardPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
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
    font-size: 0.78rem;
    font-weight: 800;
    background: rgba(21,101,192,0.06);
    padding: 3px 10px;
    border-radius: 99px;
    transition: transform 0.2s;
  }
  .radar-label:hover { transform: scale(1.08); }

  .strengths-box {
    flex: 1;
    min-width: 220px;
    background: #F8FBFF;
    border-radius: 20px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    animation: cardPop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
  }

  .strengths-title {
    font-family: 'Fredoka One', cursive;
    font-size: 1rem;
    color: #1565C0;
    margin-bottom: 8px;
  }

  .strengths-list, .prof-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .strengths-list li, .prof-list li {
    font-size: 0.9rem;
    font-weight: 700;
    color: #37474F;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: #fff;
    border-radius: 10px;
    border: 1.5px solid #E3F2FD;
    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s;
    animation: listItemIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .strengths-list li:nth-child(1), .prof-list li:nth-child(1) { animation-delay: 0.1s; }
  .strengths-list li:nth-child(2), .prof-list li:nth-child(2) { animation-delay: 0.2s; }
  .strengths-list li:nth-child(3), .prof-list li:nth-child(3) { animation-delay: 0.3s; }

  .strengths-list li:hover, .prof-list li:hover {
    transform: translateX(5px);
    box-shadow: 0 4px 12px rgba(21,101,192,0.10);
    border-color: #90CAF9;
  }

  @keyframes listItemIn {
    from { opacity: 0; transform: translateX(-16px); }
    to   { opacity: 1; transform: translateX(0); }
  }

  .check { color: #1565C0; font-weight: 900; font-size: 1rem; }

  /* ── Develop section ───────────────────────────────────────────────────── */
  .develop-section {
    max-width: 900px;
    margin: 32px auto;
    padding: 32px;
    background: #fff;
    border-radius: 28px;
    box-shadow: 0 8px 40px rgba(21,101,192,0.10);
    animation: cardPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }

  .develop-banner {
    background: linear-gradient(135deg, #FF7043, #FF8A65);
    border-radius: 18px;
    padding: 18px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    box-shadow: 0 6px 20px rgba(255,112,67,0.25);
  }

  .develop-banner-title {
    font-family: 'Fredoka One', cursive;
    font-size: 1.3rem;
    color: #fff;
    text-shadow: 0 2px 8px rgba(0,0,0,0.10);
  }

  .develop-content { display: flex; gap: 24px; flex-wrap: wrap; }
  .develop-left, .develop-right { flex: 1; min-width: 220px; display: flex; flex-direction: column; gap: 16px; }

  .develop-card {
    background: #F8FBFF;
    border-radius: 18px;
    padding: 20px;
    border: 1.5px solid #E3F2FD;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s;
    animation: cardPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  .develop-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(21,101,192,0.12); }
  .develop-card-title { font-family: 'Fredoka One', cursive; font-size: 1rem; color: #1565C0; margin-bottom: 12px; }
  .develop-card ul { list-style: none; display: flex; flex-direction: column; gap: 8px; }
  .develop-card li { font-size: 0.88rem; font-weight: 700; color: #546E7A; display: flex; gap: 8px; align-items: center; }

  .robot-box {
    background: linear-gradient(135deg, #E3F2FD, #FFF8E1);
    border-radius: 18px;
    padding: 24px;
    text-align: center;
    font-size: 3rem;
    border: 1.5px solid #E3F2FD;
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    animation: float 4s ease-in-out infinite;
  }
  .robot-box:hover { transform: scale(1.04) rotate(2deg); }

  .map-box {
    background: #F8FBFF;
    border-radius: 18px;
    padding: 20px;
    border: 1.5px solid #E3F2FD;
  }
  .map-box-title { font-family: 'Fredoka One', cursive; font-size: 1rem; color: #1565C0; margin-bottom: 10px; }
  .map-pin-row {
    font-size: 0.88rem;
    font-weight: 700;
    color: #546E7A;
    padding: 6px 0;
    border-bottom: 1px solid #E3F2FD;
    transition: color 0.2s, transform 0.2s;
    cursor: default;
  }
  .map-pin-row:last-child { border-bottom: none; }
  .map-pin-row:hover { color: #1565C0; transform: translateX(4px); }

  /* ── Tasks section ─────────────────────────────────────────────────────── */
  .task-section {
    max-width: 700px;
    margin: 32px auto;
    padding: 32px;
    animation: pageIn 0.45s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .task-title {
    font-family: 'Fredoka One', cursive;
    font-size: 1.5rem;
    color: #1565C0;
    margin-bottom: 24px;
    text-align: center;
  }

  .task-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }

  .task-card {
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(21,101,192,0.10);
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.25s;
    animation: cardPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  .task-card:nth-child(1) { animation-delay: 0.05s; }
  .task-card:nth-child(2) { animation-delay: 0.10s; }
  .task-card:nth-child(3) { animation-delay: 0.15s; }
  .task-card:nth-child(4) { animation-delay: 0.20s; }
  .task-card:hover { transform: translateY(-8px) scale(1.03); box-shadow: 0 16px 40px rgba(21,101,192,0.18); }
  .task-card:active { transform: scale(0.97); }

  .task-card-header {
    padding: 12px 16px;
    font-family: 'Fredoka One', cursive;
    font-size: 0.95rem;
    color: #fff;
    display: flex;
    align-items: center;
    gap: 8px;
    letter-spacing: 0.05em;
    text-shadow: 0 1px 4px rgba(0,0,0,0.15);
  }

  .task-card-body {
    background: #fff;
    padding: 20px;
    text-align: center;
    transition: background 0.2s;
  }
  .task-card:hover .task-card-body { background: #F0F7FF; }

  .task-card-emoji { font-size: 2.2rem; margin-bottom: 8px; animation: float 3s ease-in-out infinite; }
  .task-card-desc  { font-size: 0.88rem; font-weight: 700; color: #546E7A; }

  /* ── Scrollbar ─────────────────────────────────────────────────────────── */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(21,101,192,0.25); border-radius: 99px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(21,101,192,0.45); }

  /* ── Selection ─────────────────────────────────────────────────────────── */
  ::selection { background: rgba(21,101,192,0.18); color: #1565C0; }

  /* ── Focus ring ────────────────────────────────────────────────────────── */
  button:focus-visible {
    outline: 3px solid rgba(21,101,192,0.5);
    outline-offset: 2px;
  }
`;

export default styles;
