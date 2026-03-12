import { useState } from "react";
import globalStyles from "./styles";
import HomePage    from "./pages/HomePage";
import TasksPage   from "./pages/TasksPage";
import QuizPage    from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";
import DevelopPage from "./pages/DevelopPage";

export default function App() {
  const [page, setPage] = useState("home");
  const [results, setResults] = useState(null); // ← ADD THIS

  const renderPage = () => {
    switch (page) {
      case "home":    return <HomePage    setPage={setPage} />;
      case "tasks":   return <TasksPage   setPage={setPage} />;
      case "quiz":    return <QuizPage    setPage={setPage} setResults={setResults} />; // ← ADD setResults
      case "results": return <ResultsPage setPage={setPage} results={results} />;       // ← ADD results
      case "develop": return <DevelopPage setPage={setPage} />;
      default:        return <HomePage    setPage={setPage} />;
    }
  };

  return (
    <>
      <style>{globalStyles}</style>
      {renderPage()}
    </>
  );
}