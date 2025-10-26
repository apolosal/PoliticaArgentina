import type { Request, Response } from "express";
import fetch from "node-fetch";

export async function incrementCounter(req: Request, res: Response) {
  try {
    const apiKey = process.env.COUNTER_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "COUNTER_API_KEY not set" });

    const url = "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados/up";

    const response = await fetch(url, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}` }
    });

    const data = await response.json();
    return res.json({ value: data.data.up_count });
  } catch (err) {
    console.error("Error incrementCounter:", err);
    return res.status(500).json({ error: "Error incrementing counter" });
  }
}
