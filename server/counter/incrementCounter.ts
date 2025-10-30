import type { Request, Response } from "express";
import fetch from "node-fetch";

export async function incrementCounter(req: Request, res: Response) {
  try {
    // Para contadores públicos no hace falta API Key
    const url = "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados/up";

    // Usar GET, no POST
    const response = await fetch(url);
    const data = await response.json();

    // data.data.value es la estructura que devuelve CounterAPI
    return res.json({ value: data.data.value });
  } catch (err) {
    console.error("Error incrementCounter:", err);
    return res.status(500).json({ error: "Invalid response from CounterAPI" });
  }
}
