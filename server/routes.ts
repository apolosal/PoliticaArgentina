import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTestResultSchema } from "@shared/schema";

// Importamos la función para incrementar el contador
import { incrementCounter } from "./counter/incrementCounter";

export async function registerRoutes(app: Express): Promise<Server> {
  // Rutas existentes para resultados del test
  app.post("/api/test-results", async (req, res) => {
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

  app.get("/api/test-results/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const results = await storage.getTestResultsBySession(sessionId);
      res.json(results);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get("/api/test-results/:sessionId/latest", async (req, res) => {
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

  // NUEVA RUTA: incrementa el contador de personas que completaron el test
  app.post("/api/increment-counter", async (req, res) => {
    try {
      const result = await incrementCounter();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
