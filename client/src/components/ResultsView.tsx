import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, RotateCcw } from "lucide-react";
import type { TestResults } from "@shared/schema";
import { currentDescriptions } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ResultsViewProps {
  results: TestResults;
  onRestart: () => void;
}

export function ResultsView({ results, onRestart }: ResultsViewProps) {
  const { toast } = useToast();
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
      <div className="max-w-2xl mx-auto w-full">
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
      </div>
    </div>
  );
}
