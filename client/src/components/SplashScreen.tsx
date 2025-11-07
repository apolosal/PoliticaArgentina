import { useEffect } from "react";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 1800); // duración de splash (1.8s)

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <div className="animate-pulse text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Política Argentina
        </h1>
        <p className="text-sm mt-2 text-muted-foreground">
          Cargando…
        </p>
      </div>
    </div>
  );
}
