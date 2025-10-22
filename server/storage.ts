import { type InsertTestResult, type SelectTestResult, testResults } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  saveTestResult(result: InsertTestResult): Promise<SelectTestResult>;
  getTestResultsBySession(sessionId: string): Promise<SelectTestResult[]>;
  getLatestTestResult(sessionId: string): Promise<SelectTestResult | undefined>;
}

export class DbStorage implements IStorage {
  async saveTestResult(result: InsertTestResult): Promise<SelectTestResult> {
    const [saved] = await db.insert(testResults).values(result).returning();
    return saved;
  }

  async getTestResultsBySession(sessionId: string): Promise<SelectTestResult[]> {
    return await db
      .select()
      .from(testResults)
      .where(eq(testResults.sessionId, sessionId))
      .orderBy(desc(testResults.createdAt));
  }

  async getLatestTestResult(sessionId: string): Promise<SelectTestResult | undefined> {
    const results = await db
      .select()
      .from(testResults)
      .where(eq(testResults.sessionId, sessionId))
      .orderBy(desc(testResults.createdAt))
      .limit(1);
    
    return results[0];
  }
}

export const storage = new DbStorage();
