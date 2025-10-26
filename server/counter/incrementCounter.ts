// server/counter/incrementCounter.ts
import type { Request, Response } from "express";
import fetch from "node-fetch";

export async function incrementCounter(_req: Request, res: Response) {
  try {
    const apiKey = process.env.COUNTER_API_KEY; // si está, usamos autenticación
    const url = "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados/up";

    const headers: Record<string, string> = {};
    if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

    // IMPORTANTE: usar GET para /up en V2
    const response = await fetch(url, { method: "GET", headers });
    const json = await response.json().catch(() => null);

    // Si la API devolvió 404/otro error, json tendrá el mensaje
    if (!json) {
      console.error("Invalid or empty JSON from CounterAPI");
      return res.status(500).json({ error: "Invalid API response", json });
    }

    // json.data.up_count es la propiedad que vimos en tu respuesta
    const value = json?.data?.up_count ?? json?.data?.value ?? json?.value ?? null;

    if (value === null || value === undefined) {
      console.error("❌ Invalid API response:", json);
      return res.status(500).json({ error: "Invalid API response", json });
    }

    return res.json({ value });
  } catch (err) {
    console.error("Error incrementCounter:", err);
    return res.status(500).json({ error: "Error incrementing counter", details: String(err) });
  }
}
