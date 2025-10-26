// server/incrementCounter.ts
import type { Request, Response } from "express";
import fetch from "node-fetch";

export async function incrementCounter(req: Request, res: Response) {
  try {
    const apiKey = process.env.COUNTER_API_KEY;
    if (!apiKey) {
      console.error("COUNTER_API_KEY not set");
      return res.status(500).json({ error: "COUNTER_API_KEY not set" });
    }

    const response = await fetch(
      "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados/up",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("CounterAPI responded with error:", text);
      return res.status(500).json({ error: "Error incrementing counter", details: text });
    }

    const data = await response.json();

    // data.data.value contiene el valor actualizado
    return res.json({ value: data.data.value });
  } catch (err) {
    console.error("Error incrementCounter:", err);
    return res.status(500).json({ error: "Error incrementing counter" });
  }
}
