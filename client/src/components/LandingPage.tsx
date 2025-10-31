import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface LandingPageProps {
  onStart: () => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const [counter, setCounter] = useState<number | null>(null);

  // 🔹 Solo obtiene el número actual de tests completados (no lo incrementa)
  useEffect(() => {
    fetch("https://politicaargentina.onrender.com/api/counter")
      .then(res => res.json())
      .then(data => {
        setCounter(data.value);
      })
      .catch(err => console.error("❌ Error fetching counter:", err));
  }, []);

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

        {/* 👇 Muestra el contador debajo del botón, manteniendo la estética */}
        <p className="mt-4 text-sm text-muted-foreground">
          {counter !== null
            ? `${counter.toLocaleString()} personas ya completaron el test`
            : "Cargando participantes..."}
        </p>
      </div>
    </div>
  );
}
