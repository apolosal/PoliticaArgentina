import type { Request, Response } from "express";
import fetch from "node-fetch";

export async function incrementCounter(_req: Request, res: Response) {
  try {
    // Contador público → NO necesita API Key
    const url = "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados/up";

    // GET (NO POST)
    const response = await fetch(url);
    const data = await response.json();

    // La respuesta correcta viene en data.data.value
    return res.json({ value: data.data.value });

  } catch (err) {
    console.error("Error incrementCounter:", err);
    return res.status(500).json({ error: "Invalid response from CounterAPI" });
  }
}
