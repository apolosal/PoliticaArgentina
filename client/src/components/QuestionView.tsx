import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ChevronRight } from "lucide-react";
import type { Question, AnswerOption, UserAnswer } from "@shared/schema";
import { answerLabels } from "@shared/schema";

interface QuestionViewProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: UserAnswer) => void;
}

export function QuestionView({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
}: QuestionViewProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerOption | null>(null);
  const progressPercentage = ((questionNumber - 1) / totalQuestions) * 100;

  useEffect(() => {
    setSelectedAnswer(null);
  }, [question.id]);

  const handleAnswerClick = (answer: AnswerOption) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (selectedAnswer) {
      onAnswer({
        questionId: question.id,
        answer: selectedAnswer,
      });
    }
  };

  const answerOptions: AnswerOption[] = ["agree", "neutral", "disagree"];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto w-full">
        <Card className="p-6 md:p-8 shadow-md">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <Badge variant="secondary" className="text-sm font-medium" data-testid="text-question-number">
                Pregunta {questionNumber} de {totalQuestions}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {Math.round(progressPercentage)}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-1" />
          </div>

          <div className="mb-8">
            <p className="text-lg md:text-xl font-medium leading-relaxed text-foreground" data-testid={`text-question-${question.id}`}>
              {question.text}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {answerOptions.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswerClick(option)}
                className={`
                  w-full py-4 px-6 rounded-lg text-base font-medium
                  border-2 transition-all duration-200
                  ${
                    selectedAnswer === option
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-card text-card-foreground border-border hover-elevate active-elevate-2"
                  }
                `}
                data-testid={`button-answer-${option}`}
              >
                {answerLabels[option]}
              </button>
            ))}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleNext}
              disabled={!selectedAnswer}
              size="lg"
              className="px-6 h-auto"
              data-testid="button-next-question"
            >
              {questionNumber === totalQuestions ? "Ver Resultados" : "Siguiente"}
              <ChevronRight className="ml-1 h-5 w-5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
