import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { QuestionView } from "@/components/QuestionView";
import { ResultsView } from "@/components/ResultsView";
import { questions } from "@shared/schema";
import type { UserAnswer, TestResults, PoliticalCurrent } from "@shared/schema";

type ViewState = "landing" | "quiz" | "results";

export default function Home() {
  const [viewState, setViewState] = useState<ViewState>("landing");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [results, setResults] = useState<TestResults | null>(null);

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

    userAnswers.forEach((userAnswer) => {
      const question = questions.find((q) => q.id === userAnswer.questionId);
      if (question) {
        const answerScores = question.scores[userAnswer.answer];
        Object.entries(answerScores).forEach(([current, points]) => {
          scores[current as PoliticalCurrent] += points;
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

    return {
      scores,
      dominantCurrent,
      percentages,
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
