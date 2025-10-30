import type { Request, Response } from "express";
import fetch from "node-fetch";

export async function incrementCounter(req: Request, res: Response) {
  try {
    // Endpoint público de tu contador
    const url = "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados";

    // Hacemos GET para obtener el valor actual
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.data || typeof data.data.value !== "number") {
      return res.status(500).json({ error: "Invalid response from CounterAPI" });
    }

    // Incrementamos el valor en 1
    const newValue = data.data.value + 1;

    // Retornamos el valor incrementado al front
    return res.json({ value: newValue });
  } catch (err) {
    console.error("Error incrementCounter:", err);
    return res.status(500).json({ error: "Error incrementing counter" });
  }
}
