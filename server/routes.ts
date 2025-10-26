import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTestResultSchema } from "@shared/schema";

// Importar controladores del contador
import { getCounter } from "./counter/getCounter";
import { incrementCounter } from "./counter/incrementCounter";

// Usamos app: any para compatibilidad Render
export async function registerRoutes(app: any): Promise<Server> {
  // Rutas existentes de test
  app.post("/api/test-results", async (req: any, res: any) => {
    try {
      const validatedData = insertTestResultSchema.parse(req.body);
      const saved = await storage.saveTestResult(validatedData);
      res.json(saved);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  });

  app.get("/api/test-results/:sessionId", async (req: any, res: any) => {
    try {
      const { sessionId } = req.params;
      const results = await storage.getTestResultsBySession(sessionId);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/test-results/:sessionId/latest", async (req: any, res: any) => {
    try {
      const { sessionId } = req.params;
      const result = await storage.getLatestTestResult(sessionId);
      if (!result) {
        res.status(404).json({ error: "No results found" });
        return;
      }
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Nuevas rutas del contador
  app.get("/api/get-counter", getCounter);
  app.post("/api/increment-counter", incrementCounter);

  const httpServer = createServer(app);
  return httpServer;
}
