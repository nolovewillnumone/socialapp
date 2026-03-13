import { useState } from "react";
import globalStyles from "./styles";
import AuthPage    from "./pages/AuthPage";
import HomePage    from "./pages/HomePage";
import TasksPage   from "./pages/TasksPage";
import QuizPage    from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";
import DevelopPage from "./pages/DevelopPage";

export default function App() {
  const [page, setPage]       = useState("auth");
  const [results, setResults] = useState(null);

  // Persist user across page refresh
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPage("auth");
  };

  // Skip auth screen if already logged in
  const startPage = user ? "home" : "auth";
  if (page === "auth" && user) setPage("home");

  const renderPage = () => {
    switch (page) {
      case "auth":
        return <AuthPage setPage={setPage} setUser={setUser} />;
      case "home":
        return <HomePage setPage={setPage} user={user} onLogout={handleLogout} />;
      case "tasks":
        return <TasksPage setPage={setPage} />;
      case "quiz":
        return <QuizPage setPage={setPage} setResults={setResults} />;
      case "results":
        return <ResultsPage setPage={setPage} results={results} />;
      case "develop":
        return <DevelopPage setPage={setPage} />;
      default:
        return <AuthPage setPage={setPage} setUser={setUser} />;
    }
  };

  return (
    <>
      <style>{globalStyles}</style>
      {renderPage()}
    </>
  );
}
