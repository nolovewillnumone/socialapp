# 🌟 Karta Talantov — AI Talent Discovery Platform

> **Free AI platform helping children aged 8–16 discover their talents and dream careers**
> Built by a 16-year-old developer from Tashkent, Uzbekistan 🇺🇿

[![Live Demo](https://img.shields.io/badge/🌐_Live-levelup--talent.xyz-0F6E56?style=for-the-badge)](https://levelup-talent.xyz)
[![License](https://img.shields.io/badge/License-MIT-EF9F27?style=for-the-badge)](LICENSE)
[![Languages](https://img.shields.io/badge/RU_|_UZ_|_EN-Trilingual-1D9E75?style=for-the-badge)](#)
[![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge)](#)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge)](#)

---

## 📖 About The Project

**Karta Talantov** (Russian) / **Iste'dod Xaritasi** (Uzbek) / **Talent Map** (English) is a free, trilingual AI platform that helps children aged 8–16 discover their natural talents and find matching career paths — before they have to make life-changing decisions about their education.

> *"In Uzbekistan, most children never receive professional career counselling. I built this to change that."*

### The Problem
- **65% of students** in Central Asia choose their university major without any self-assessment
- Professional career counselling costs **$50–200 per session** — unaffordable for most families
- Existing tools are **English-only**, ignoring 50+ million Russian and Uzbek speakers
- Most aptitude tests measure **IQ**, not what children actually love to do

### The Solution
A free, science-backed, interest-based quiz that analyses 9 talent dimensions and recommends 35+ careers with personalised development plans — available to anyone with a phone or computer.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🧠 **Interest Quiz** | 30 questions across 5 zones, based on Gardner's Multiple Intelligences |
| 🤖 **ML Career Matching** | Dot-product scoring → 35+ career recommendations with match % |
| 📊 **Talent Radar** | 9-dimension visual map with platform average comparison |
| 🌍 **Fully Trilingual** | Russian, Uzbek, English — every word translated |
| 🏆 **Leaderboard** | Compare scores with other users across all 9 talents |
| 📚 **Dev Plan** | Weekly schedules, free courses, top universities per talent |
| 🎮 **Mini-Games** | 4 interactive games that reinforce talent discovery |
| 💬 **AI Chatbot** | Rule-based talent advisor, no API cost |
| 📈 **Admin Dashboard** | Real-time analytics: users, quizzes, feedback, career trends |
| 🔒 **Secure Auth** | JWT + SHA-256, rate limiting, input sanitisation |

---

## 🏗 Architecture

```
Frontend (React + Vite)          Backend (FastAPI)         ML Service (FastAPI)
levelup-talent.xyz         →     Render (Python 3.11)  →  Render (Python 3.11)
                                 PostgreSQL                 NumPy + scikit-learn
```

**Tech Stack:**
- **Frontend:** React 19, Vite, CSS-in-JS
- **Backend:** FastAPI, SQLAlchemy 2.0, PostgreSQL, passlib
- **ML:** NumPy, scikit-learn, custom weighted dot-product scorer
- **Infra:** Vercel + Render (free tier), GitHub CI/CD

---

## 🧠 Scientific Foundation

Based on peer-reviewed research:

- **Howard Gardner's Multiple Intelligences** — Harvard University (1983, updated 1999)
- **Wechsler Intelligence Scale for Children (WISC-V)** — memory assessment
- **Torrance Tests of Creative Thinking (TTCT)** — divergent thinking
- **Cambridge CEFR Scale** — language proficiency framework
- **Kohlberg's Moral Development** — Harvard, leadership dimension

---

## 📊 9 Talent Dimensions

`Logic` · `Creativity` · `Memory` · `Leadership` · `Languages` · `Music` · `Sport` · `Nature` · `Social`

Each mapped to real careers, top universities (MIT, Harvard, Oxford, INHA Tashkent etc.) and weekly development plans.

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/nolovewillnumone/socialapp.git
cd socialapp

# Frontend
cd frontend/karta-talantov && npm install && npm run dev

# Backend (new terminal)
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000

# ML Service (new terminal)
uvicorn ml.ml_service:app --reload --port 8001
```

**Environment variables needed:**
```env
DATABASE_URL=postgresql://...
SECRET_KEY=your-secret
ML_SERVICE_URL=http://localhost:8001
ADMIN_PASSWORD=your-admin-password
```

---

## 📁 Structure

```
socialapp/
├── backend/          FastAPI app, auth, quiz, analytics, admin
├── ml/               ML scoring engine + career matcher (35+ careers)
├── frontend/
│   └── karta-talantov/
│       ├── src/pages/     HomePage, QuizPage, ResultsPage, DevelopPage...
│       ├── src/components/ Nav, ChatBot, FeedbackSection, Loader
│       └── src/api/       Axios client with wake-up pings
└── requirements.txt
```

---

## 🌍 Impact

**Who uses it:** Children and teenagers in Uzbekistan, Russia, Kazakhstan

**Why it matters:**
- First free, Uzbek-language career guidance platform
- Reaches children in regions with no access to counsellors
- Built by a teenager, for teenagers

**Roadmap:**
- [ ] Mobile app (React Native)
- [ ] School/teacher dashboard
- [ ] Ministry of Education partnership (Uzbekistan)
- [ ] Kazakh, Kyrgyz, Tajik language support
- [ ] University direct application links

---

## 👨‍💻 About the Developer

Built by two devs**[Your Name]**, age 16, Tashkent, Uzbekistan.
Design → Frontend → Backend → ML Engine → DevOps → all done independently.

- 🐙 GitHub: [@nolovewillnumone](https://github.com/nolovewillnumone)
- 🌐 Project: [levelup-talent.xyz](https://levelup-talent.xyz)

---

## 📄 License

MIT — free to use with attribution.

---

*Made with ❤️ in Bukhara 🇺🇿 · Для детей Центральной Азии · Markaziy Osiyo bolalari uchun*
