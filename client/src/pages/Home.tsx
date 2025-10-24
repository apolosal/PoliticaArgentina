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
        headers: {
          "Content-Type": "application/json",
        },
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
      saveResultMutation.mutate({
        sessionId,
        results: calculatedResults,
        answers: newAnswers,
      });

      // 👇 Contador de usuarios únicos que completaron el test
      try {
        if (!localStorage.getItem("testpolitico-completed")) {
          fetch("https://countapi.dev/hit/testpoliticoargentino/completados")
            .then((res) => res.json())
            .then((data) => {
              console.log("✅ Nuevo usuario completó el test. Total:", data.value);
              localStorage.setItem("testpolitico-completed", "true");
            })
            .catch((err) => console.error("Error al actualizar contador:", err));
        }
      } catch (e) {
        console.error("localStorage no disponible:", e);
      }
      // 👆 Fin contador

      setViewState("results");
    }
  };

  const calculateResults = (userAnswers: UserAnswer[]): TestResults => {
    const scores: Record<PoliticalCurrent, number> = {
      "Liberalismo": 0,
      "Conservadurismo": 0,
      "Peronismo": 0,
      "Kirchnerismo/Progresismo": 0,
      "Izquierda": 0,
      "Radicalismo": 0,
    };

    const answerDetails: AnswerDetail[] = [];

    userAnswers.forEach((userAnswer) => {
      const question = questions.find((q) => q.id === userAnswer.questionId);
      if (question) {
        const answerScores = question.scores[userAnswer.answer];
        const contributedTo: Array<{ current: PoliticalCurrent; points: number }> = [];

        Object.entries(answerScores).forEach(([current, points]) => {
          scores[current as PoliticalCurrent] += points;
          contributedTo.push({ current: current as PoliticalCurrent, points });
        });

        answerDetails.push({
          questionId: question.id,
          questionText: question.text,
          answer: userAnswer.answer,
          answerLabel: answerLabels[userAnswer.answer],
          contributedTo: contributedTo.sort((a, b) => b.points - a.points),
        });
      }
    });

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    const percentages: Record<PoliticalCurrent, number> = {
      "Liberalismo": 0,
      "Conservadurismo": 0,
      "Peronismo": 0,
      "Kirchnerismo/Progresismo": 0,
      "Izquierda": 0,
      "Radicalismo": 0,
    };

    if (totalScore > 0) {
      Object.keys(scores).forEach((current) => {
        percentages[current as PoliticalCurrent] = 
          (scores[current as PoliticalCurrent] / totalScore) * 100;
      });
    }

    const dominantCurrent = Object.entries(scores).reduce((max, [current, score]) => {
      return score > max[1] ? [current, score] : max;
    }, ["Liberalismo", 0] as [string, number])[0] as PoliticalCurrent;

    const topAnswersForDominant = answerDetails
      .filter(detail => detail.contributedTo.some((c: { current: PoliticalCurrent; points: number }) => c.current === dominantCurrent))
      .sort((a, b) => {
        const aPoints = a.contributedTo.find((c: { current: PoliticalCurrent; points: number }) => c.current === dominantCurrent)?.points || 0;
        const bPoints = b.contributedTo.find((c: { current: PoliticalCurrent; points: number }) => c.current === dominantCurrent)?.points || 0;
        return bPoints - aPoints;
      })
      .slice(0, 3);

    const keyReasons = topAnswersForDominant.map(detail => {
      const points = detail.contributedTo.find((c: { current: PoliticalCurrent; points: number }) => c.current === dominantCurrent)?.points || 0;
      return `${detail.answerLabel} en: "${detail.questionText}" (+${points} puntos)`;
    });

    return {
      scores,
      dominantCurrent,
      percentages,
      answerDetails,
      alignment: {
        current: dominantCurrent,
        percentage: percentages[dominantCurrent],
        keyReasons,
      },
    };
  };

  const handleRestart = () => {
    setViewState("landing");
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setResults(null);
  };

  if (viewState === "landing") {
    return <LandingPage onStart={handleStart} />;
  }

  if (viewState === "quiz") {
    return (
      <QuestionView
        question={questions[currentQuestionIndex]}
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={questions.length}
        onAnswer={handleAnswer}
      />
    );
  }

  if (viewState === "results" && results) {
    return <ResultsView results={results} onRestart={handleRestart} />;
  }

  return null;
}
