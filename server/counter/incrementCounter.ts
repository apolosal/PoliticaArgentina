import type { Request, Response } from "express";
import fetch from "node-fetch";

export async function incrementCounter(req: Request, res: Response) {
  try {
    const apiKey = process.env.COUNTER_API_KEY;
    if (!apiKey) {
      console.error("❌ COUNTER_API_KEY not set");
      return res.status(500).json({ error: "Server missing API key" });
    }

    const url = "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados/up";

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    const json = await response.json();

    // Validación por si la API responde error
    if (!json?.data?.up_count && json?.code !== "200") {
      console.error("❌ Invalid API response:", json);
      return res.status(500).json({ error: "Invalid API response", json });
    }

    return res.json({ value: json.data.up_count });

  } catch (err) {
    console.error("🔥 Error incrementCounter:", err);
    return res.status(500).json({ error: "Error incrementing counter" });
  }
}
