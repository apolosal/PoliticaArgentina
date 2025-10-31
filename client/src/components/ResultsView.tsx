import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";

interface ResultsViewProps {
  results: any;
  onRestart: () => void;
}

export function ResultsView({ results, onRestart }: ResultsViewProps) {
  const hasIncremented = useRef(false); // 👈 Evita doble ejecución del contador

  useEffect(() => {
    if (hasIncremented.current) return; // 👈 Previene la ejecución doble en modo estricto
    hasIncremented.current = true;

    if (!localStorage.getItem("testpolitico-completed")) {
      fetch("https://politicaargentina.onrender.com/api/increment-counter", { method: "POST" })
        .then(res => res.json())
        .then(data => {
          console.log("✅ Contador actualizado:", data.value);
          localStorage.setItem("testpolitico-completed", "true"); // Guarda bandera para evitar duplicado
        })
        .catch(err => console.error("❌ Error incrementing counter:", err));
    }
  }, []);

  const handleRestart = () => {
    localStorage.removeItem("testpolitico-completed"); // 👈 Permite contar un nuevo test al reiniciar
    onRestart(); // 👈 Vuelve a la pantalla de inicio
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">
        Tu corriente política más cercana es:
      </h1>

      <p className="text-2xl font-semibold mb-2 text-primary">
        {results.alignment.current}
      </p>

      <p className="text-muted-foreground mb-6">
        Coincidís un {results.alignment.percentage.toFixed(1)}% con esta corriente.
      </p>

      <div className="max-w-lg text-left bg-muted/30 p-6 rounded-2xl shadow-sm mb-8">
        <h2 className="text-lg font-semibold mb-3">Principales razones:</h2>
        <ul className="list-disc list-inside text-sm text-muted-foreground">
          {results.alignment.keyReasons.map((reason: string, index: number) => (
            <li key={index}>{reason}</li>
          ))}
        </ul>
      </div>

      <Button
        onClick={handleRestart}
        size="lg"
        className="px-8 py-6 text-lg h-auto"
      >
        Volver a empezar
      </Button>
    </div>
  );
}
