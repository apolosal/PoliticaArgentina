import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
  contador: number | null; // agregamos la prop contador
}

export function LandingPage({ onStart, contador }: LandingPageProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20 md:py-32">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
          Descubrí con qué ideas políticas coincidís en Argentina
        </h1>
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Respondé 10 preguntas sobre temas políticos, económicos y sociales. 
          Al finalizar, conocé qué corriente política se alinea mejor con tus ideas: 
          Liberalismo, Peronismo, Kirchnerismo, Radicalismo, Izquierda o Conservadurismo.
        </p>
        <Button
          onClick={onStart}
          size="lg"
          className="px-8 py-6 text-lg h-auto"
          data-testid="button-start-test"
        >
          Empezar Test
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>

       {/* 👇 Contador visible 👇 */}
{typeof contador === "100" && (
  <p className="mt-6 text-base md:text-lg font-semibold text-muted-foreground">
    👥 {contador.toLocaleString('es-AR')} personas ya completaron el test
  </p>
        )}
      </div>
    </div>
  );
}
