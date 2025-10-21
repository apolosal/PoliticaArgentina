import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, RotateCcw, ChevronDown, ChevronUp } from "lucide-react";
import type { TestResults } from "@shared/schema";
import { currentDescriptions } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ResultsViewProps {
  results: TestResults;
  onRestart: () => void;
}

export function ResultsView({ results, onRestart }: ResultsViewProps) {
  const { toast } = useToast();
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const dominantDescription = currentDescriptions[results.dominantCurrent];

  const sortedResults = Object.entries(results.percentages)
    .sort(([, a], [, b]) => b - a);

  const handleShare = async () => {
    const shareText = `Mi resultado en el Test Político Argentino:\n\n${results.dominantCurrent} - ${results.percentages[results.dominantCurrent].toFixed(1)}%\n\n${dominantDescription.description}\n\nRealizá el test vos también!`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Test Político Argentino",
          text: shareText,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          copyToClipboard(shareText);
        }
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "¡Copiado!",
      description: "El resultado se copió al portapapeles",
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto w-full space-y-6">
        <Card className="p-8 md:p-10 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-foreground">
              Tus Resultados
            </h2>
            <p className="text-muted-foreground">
              Basado en tus respuestas, estas son las corrientes políticas con las que más coincidís
            </p>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Badge className="text-lg px-4 py-2 bg-primary text-primary-foreground">
                Tu corriente principal
              </Badge>
            </div>
            <h3 className="text-xl font-semibold text-center mb-3 text-foreground" data-testid="text-dominant-current">
              {results.dominantCurrent}
            </h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              {dominantDescription.shortDescription}
            </p>
            <p className="text-base leading-relaxed text-foreground mb-4">
              {dominantDescription.description}
            </p>
          </div>

          {results.alignment && results.alignment.keyReasons.length > 0 && (
            <div className="mb-8">
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="w-full flex items-center justify-between p-4 bg-muted rounded-lg hover-elevate active-elevate-2"
                data-testid="button-toggle-analysis"
              >
                <span className="font-medium text-foreground">
                  ¿Por qué coincidís con {results.dominantCurrent}?
                </span>
                {showAnalysis ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </button>
              
              {showAnalysis && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
                  <p className="text-sm text-muted-foreground mb-3">
                    Tus respuestas que más contribuyeron a este resultado:
                  </p>
                  {results.alignment.keyReasons.map((reason, idx) => (
                    <div key={idx} className="flex gap-3">
                      <Badge variant="outline" className="shrink-0">{idx + 1}</Badge>
                      <p className="text-sm text-foreground leading-relaxed">{reason}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="border-t pt-8 mt-8">
            <h4 className="text-lg font-semibold mb-4 text-foreground">
              Distribución de tus ideas políticas
            </h4>
            <div className="space-y-3">
              {sortedResults.map(([current, percentage]) => (
                <div
                  key={current}
                  className="flex items-center justify-between py-2 border-b last:border-b-0"
                  data-testid={`result-${current}`}
                >
                  <span className="font-medium text-foreground">{current}</span>
                  <span className="font-semibold text-foreground">{percentage.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            <Button
              onClick={handleShare}
              variant="default"
              size="lg"
              className="flex-1"
              data-testid="button-share-results"
            >
              <Share2 className="mr-2 h-5 w-5" />
              Compartir Resultado
            </Button>
            <Button
              onClick={onRestart}
              variant="outline"
              size="lg"
              className="flex-1"
              data-testid="button-restart-test"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Reiniciar Test
            </Button>
          </div>
        </Card>

        {results.answerDetails && results.answerDetails.length > 0 && (
          <Card className="p-6 md:p-8 shadow-md">
            <button
              onClick={() => setShowBreakdown(!showBreakdown)}
              className="w-full flex items-center justify-between hover-elevate active-elevate-2 p-2 rounded-lg"
              data-testid="button-toggle-breakdown"
            >
              <h4 className="text-lg font-semibold text-foreground">
                Ver desglose pregunta por pregunta
              </h4>
              {showBreakdown ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>

            {showBreakdown && (
              <div className="mt-6 space-y-4">
                {results.answerDetails.map((detail, idx) => (
                  <div key={detail.questionId} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-start gap-3 mb-3">
                      <Badge variant="secondary" className="shrink-0">P{idx + 1}</Badge>
                      <p className="text-sm text-foreground leading-relaxed">
                        {detail.questionText}
                      </p>
                    </div>
                    <div className="ml-11">
                      <p className="text-sm font-medium text-foreground mb-2">
                        Tu respuesta: <span className="text-primary">{detail.answerLabel}</span>
                      </p>
                      {detail.contributedTo.length > 0 && (
                        <div className="text-xs text-muted-foreground">
                          <p className="mb-1">Contribuyó a:</p>
                          <div className="flex flex-wrap gap-2">
                            {detail.contributedTo.map((contribution) => (
                              <Badge
                                key={contribution.current}
                                variant="outline"
                                className="text-xs"
                              >
                                {contribution.current} +{contribution.points}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
