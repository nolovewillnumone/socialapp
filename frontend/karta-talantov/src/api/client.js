// src/api/client.js
import axios from "axios";

const backend = axios.create({
  baseURL: "https://karta-talantov-backend.onrender.com",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request automatically
backend.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto-logout if token expires
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

export const authAPI = {
  register: (data) => backend.post("/auth/register", data),
  login: (email, password) =>
    backend.post(
      "/auth/login",
      new URLSearchParams({ username: email, password }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    ),
  me: () => backend.get("/auth/me"),
};

export const quizAPI = {
  getQuestions: () => backend.get("/questions"),
  submitAnswers: (answers, lang = "ru") =>
    backend.post("/results", { answers, lang }),
  latestResult: () => backend.get("/results/me/latest"),
};

export default backend;
