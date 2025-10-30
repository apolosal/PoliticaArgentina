import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTestResultSchema } from "@shared/schema";

import { getCounter } from "./counter/getCounter";
import { incrementCounter } from "./counter/incrementCounter";

export async function registerRoutes(app: any): Promise<Server> {
  // Rutas de test
  app.post("/api/test-results", async (req: any, res: any) => {
    try {
      const validatedData = insertTestResultSchema.parse(req.body);
      const saved = await storage.saveTestResult(validatedData);
      res.json(saved);
    } catch (error: any) {
      res.status(error.name === "ZodError" ? 400 : 500).json({ error: error.message });
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
      if (!result) return res.status(404).json({ error: "No results found" });
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ✅ Rutas del contador
  app.get("/api/get-counter", getCounter);
  app.post("/api/increment-counter", incrementCounter);

  const httpServer = createServer(app);
  return httpServer;
}
