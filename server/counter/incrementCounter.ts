// server/counter/incrementCounter.ts
import { Request, Response } from "express";
import fetch from "node-fetch";

// Exportación nombrada para que routes.ts funcione
export async function incrementCounter(req: Request, res: Response) {
  try {
    const apiKey = process.env.COUNTER_API_KEY;       // Tu API Key de CounterAPI
    const workspace = process.env.COUNTER_WORKSPACE; // "politicaar"
    const counterName = process.env.COUNTER_SLUG;    // "testpoliticoargentino-completados"

    if (!apiKey || !workspace || !counterName) {
      return res.status(500).json({
        error: "COUNTER_API_KEY, COUNTER_WORKSPACE o COUNTER_SLUG no definido"
      });
    }

    const url = `https://api.counterapi.dev/v2/${workspace}/${counterName}/up`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    const json = await response.json();

    if (!response.ok || !json.data || typeof json.data.up_count !== "number") {
      return res.status(500).json({ error: "Invalid API response", json });
    }

    // Devuelve valor actualizado listo para el front
    return res.json({ value: json.data.up_count });
  } catch (err) {
    console.error("Error incrementCounter:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
