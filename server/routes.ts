import type { Express } from "express";
import { sql } from "drizzle-orm";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { db } from "./db";
import { testResults } from "@shared/schema";
import { insertTestResultSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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

  
  app.get("/api/total-completados", async (_req, res) => {
    try {
      const result = await db.select({ count: sql<number>`COUNT(DISTINCT ${testResults.sessionId})` }).from(testResults);
      res.json({ total: result[0].count });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
