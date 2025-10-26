import type { Request, Response } from "express";
import fetch from "node-fetch";

export async function incrementCounter(req: Request, res: Response) {
  try {
    const apiKey = process.env.COUNTER_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "COUNTER_API_KEY not set" });

    const response = await fetch(`https://counterapi.dev/v1/counter/politicaargentina/completados/increment`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` }
    });

    const data = await response.json();
    return res.json({ value: data.value });
  } catch (err) {
    console.error("Error incrementCounter:", err);
    return res.status(500).json({ error: "Error incrementing counter" });
  }
}
