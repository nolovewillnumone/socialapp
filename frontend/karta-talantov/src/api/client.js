// src/api/client.js
import axios from "axios";

const BASE = "https://karta-talantov-backend.onrender.com";
const ML   = "https://karta-talantov-ml.onrender.com";

// ── Wake up both services immediately on import ───────────────────────────────
// Render free tier sleeps after 15 min. This ping fires as soon as the app
// loads so the server is warm by the time the user does anything.
// Wake ping — uses /docs endpoint to avoid ad blocker false-positives
const ping = (url) => fetch(`${url}/docs`, { method:"GET", cache:"no-store", mode:"no-cors" }).catch(() => {});
setTimeout(() => { ping(BASE); ping(ML); }, 2000);

// Re-ping every 10 minutes to keep services warm during a session
setInterval(() => { ping(BASE); ping(ML); }, 10 * 60 * 1000);

// ── Axios instance ────────────────────────────────────────────────────────────
const backend = axios.create({
  baseURL: BASE,
  timeout: 30000, // 30s timeout — handles cold starts gracefully
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token automatically
backend.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout on 401
backend.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    }
    return Promise.reject(err);
  }
);

// ── Auth API ──────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data)            => backend.post("/auth/register", data),
  login:    (email, password) => backend.post(
    "/auth/login",
    new URLSearchParams({ username: email, password }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  ),
  me: () => backend.get("/auth/me"),
};

// ── Quiz API ──────────────────────────────────────────────────────────────────
export const quizAPI = {
  submitAnswers: (answers, lang = "ru") => backend.post("/results", { answers, lang }),
  latestResult:  ()                     => backend.get("/results/me/latest"),
};

// ── ML direct call (bypasses backend for speed) ───────────────────────────────
export const mlAPI = {
  analyze: (answers, lang = "ru") =>
    fetch(`${ML}/analyze`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ answers, lang }),
    }).then((r) => r.json()),
};

export default backend;
