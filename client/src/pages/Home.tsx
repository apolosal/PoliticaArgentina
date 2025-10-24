import { useState, useEffect } from "react";
import { LandingPage } from "@/components/LandingPage";
import { QuestionView } from "@/components/QuestionView";
import { ResultsView } from "@/components/ResultsView";
import { questions, answerLabels } from "@shared/schema";
import type { UserAnswer, TestResults } from "@shared/schema";
import { getOrCreateSessionId } from "@/lib/session";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { calculateResults } from "@/utils/calculateResults"; // <--- Import corregido

type ViewState = "landing" | "quiz" | "results";

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>("landing");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [results, setResults] = useState<TestResults | null>(null);
  const [contador, setContador] = useState<number>(0); // inicializamos en 0

  const sessionId = getOrCreateSessionId();

  // Traer contador inicial de manera robusta
  useEffect(() => {
    const fetchContador = async () => {
      try {
        const res = await fetch("/api/get-counter");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setContador(data.value);
      } catch (error) {
        console.error("Error al traer contador:", error);
        setContador(0); // opcional, inicializar en 0 si falla
      }
    };
    fetchContador();
  }, []);

  // Incrementa contador solo si el usuario no completó antes
  const incrementarContador = async () => {
    try {
      const res = await fetch("/api/increment-counter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      if (data.incremented) setContador(data.value);
    } catch (error) {
      console.error("Error al incrementar contador:", error);
    }
  };

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/test-results"] }),
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
      // Calculamos resultados usando la función importada
      const calculatedResults = calculateResults(newAnswers);
      setResults(calculatedResults);

      // Guardar resultados
      saveResultMutation.mutate({ sessionId, results: calculatedResults, answers: newAnswers });

      // Incrementar contador
      incrementarContador();

      setViewState("results");
    }
  };

  const handleRestart = () => {
    setViewState("landing");
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResults(null);
  };

  if (viewState === "landing") return <LandingPage onStart={handleStart} contador={contador} />;
  if (viewState === "quiz")
    return (
      <QuestionView
        question={questions[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
      />
    );
  if (viewState === "results" && results) return <ResultsView results={results} onRestart={handleRestart} />;
  return null;
}
