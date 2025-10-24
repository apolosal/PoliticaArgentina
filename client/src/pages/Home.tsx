import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { QuestionView } from "@/components/QuestionView";
import { ResultsView } from "@/components/ResultsView";
import { questions, answerLabels } from "@shared/schema";
import type { UserAnswer, TestResults, PoliticalCurrent, AnswerDetail } from "@shared/schema";
import { getOrCreateSessionId } from "@/lib/session";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";

type ViewState = "landing" | "quiz" | "results";

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>("landing");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [results, setResults] = useState<TestResults | null>(null);

  const saveResultMutation = useMutation({
    mutationFn: async (data: { sessionId: string; results: TestResults; answers: UserAnswer[] }) => {
      return await apiRequest("/api/test-results", {
        method: "POST",
        body: JSON.stringify({
          sessionId: data.sessionId,
          dominantCurrent: data.results.dominantCurrent,
          scores: data.results.scores,
          percentages: data.results.percentages,
          answers: data.answers,
        }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/test-results"] });
    },
  });

  const handleStart = () => {
    setViewState("quiz");
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResults(null);
  };

  const handleAnswer = (answer: UserAnswer) => {
    const newAnswers = [...answers, answer];
    setAnswers(newAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      const calculatedResults = calculateResults(newAnswers);
      setResults(calculatedResults);

      const sessionId = getOrCreateSessionId();

      // Guardar resultado en tu DB
      saveResultMutation.mutate({
        sessionId,
        results: calculatedResults,
        answers: newAnswers,
      });

      // Incrementar contador sin bloquear la UI
      fetch("/api/increment-counter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      }).catch(err => console.error("Error al incrementar contador:", err));

      setViewState("results");
    }
  };

  const handleRestart = () => {
    setViewState("landing");
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResults(null);
  };

  if (viewState === "landing") return <LandingPage onStart={handleStart} />;
  if (viewState === "quiz")
    return (
      <QuestionView
        question={questions[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
      />
    );
  if (viewState === "results" && results)
    return <ResultsView results={results} onRestart={handleRestart} />;

  return null;
}

// Mantener tu función calculateResults igual que antes
