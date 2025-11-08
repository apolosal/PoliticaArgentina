import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import History from "@/pages/History";
import NotFound from "@/pages/not-found";

// Import PostHog
import { initPostHog, usePageTracking } from "@/lib/posthog";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/historial" component={History} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Inicializa PostHog solo en el cliente
  useEffect(() => {
    initPostHog();
  }, []);

  // Trackeo automático de páginas vistas con wouter
  usePageTracking();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
