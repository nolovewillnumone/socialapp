import { useState } from "react";
import globalStyles from "./styles";
import HomePage    from "./pages/HomePage";
import TasksPage   from "./pages/TasksPage";
import QuizPage    from "./pages/QuizPage";
import ResultsPage from "./pages/ResultsPage";
import DevelopPage from "./pages/DevelopPage";

export default function App() {
  const [page, setPage] = useState("home");

  const renderPage = () => {
    switch (page) {
      case "home":    return <HomePage    setPage={setPage} />;
      case "tasks":   return <TasksPage   setPage={setPage} />;
      case "quiz":    return <QuizPage    setPage={setPage} />;
      case "results": return <ResultsPage setPage={setPage} />;
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
