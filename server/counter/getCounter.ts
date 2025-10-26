import type { Request, Response } from "express";
import fetch from "node-fetch";

export async function getCounter(req: Request, res: Response) {
  try {
    const apiKey = process.env.COUNTER_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "COUNTER_API_KEY not set" });

    const url = "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados";

    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });

    const data = await response.json();
    return res.json({ value: data.data.up_count });
  } catch (err) {
    console.error("Error getCounter:", err);
    return res.status(500).json({ error: "Error fetching counter" });
  }
}
