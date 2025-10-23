import { useQuery } from "@tanstack/react-query";
import { getOrCreateSessionId } from "@/lib/session";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar } from "lucide-react";
import { Link } from "wouter";
import type { SelectTestResult, PoliticalCurrent } from "@shared/schema";

export default function History() {
  const sessionId = getOrCreateSessionId();

  const { data: results, isLoading } = useQuery<SelectTestResult[]>({
    queryKey: ["/api/test-results", sessionId],
    queryFn: async () => {
      const response = await fetch(`/api/test-results/${sessionId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }
      return response.json();
    },
    enabled: !!sessionId,
  });

  const formatDate = (date: Date | string) => {
    const d = new Date(date);
    return new Intl.DateTimeFormat('es-AR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  };

  const getColorForCurrent = (current: string): string => {
    const colors: Record<string, string> = {
      "Liberalismo": "bg-blue-500",
      "Conservadurismo": "bg-indigo-500",
      "Peronismo": "bg-cyan-500",
      "Kirchnerismo/Progresismo": "bg-violet-500",
      "Izquierda": "bg-red-500",
      "Radicalismo": "bg-rose-500",
    };
    return colors[current] || "bg-gray-500";
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back-home">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio
            </Button>
          </Link>
        </div>

        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Historial de Resultados
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Todos tus tests anteriores guardados
            </p>
          </div>

          {isLoading && (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Cargando historial...</p>
            </Card>
          )}

          {!isLoading && (!results || results.length === 0) && (
            <Card className="p-8 text-center space-y-4">
              <p className="text-muted-foreground">
                Todavía no realizaste ningún test
              </p>
              <Link href="/">
                <Button data-testid="button-start-first-test">
                  Realizar primer test
                </Button>
              </Link>
            </Card>
          )}

          {!isLoading && results && results.length > 0 && (
            <div className="space-y-4">
              {results.map((result) => {
                const percentages = result.percentages as Record<PoliticalCurrent, number>;
                const dominant = result.dominantCurrent as PoliticalCurrent;
                
                return (
                  <Card 
                    key={result.id} 
                    className="p-6 hover-elevate"
                    data-testid={`result-card-${result.id}`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <Badge 
                            className={`${getColorForCurrent(dominant)} text-white text-base px-3 py-1`}
                            data-testid={`badge-dominant-${result.id}`}
                          >
                            {dominant}
                          </Badge>
                          <span className="text-2xl font-bold text-foreground">
                            {percentages[dominant].toFixed(1)}%
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(result.createdAt)}</span>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {Object.entries(percentages)
                            .sort(([, a], [, b]) => (b as number) - (a as number))
                            .slice(0, 6)
                            .map(([current, percentage]) => (
                              <div 
                                key={current} 
                                className="flex justify-between text-sm"
                                data-testid={`percentage-${current}-${result.id}`}
                              >
                                <span className="text-muted-foreground">{current}:</span>
                                <span className="font-medium text-foreground">
                                  {(percentage as number).toFixed(1)}%
                                </span>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
