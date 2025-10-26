import type { Request, Response } from "express";
import fetch from "node-fetch";

// Endpoint POST /api/increment-counter
export async function incrementCounter(req: Request, res: Response) {
  try {
    // Tu workspace y nombre de contador en CounterAPI V2
    const workspace = "PoliticaAr"; // reemplaza por tu workspace exacto
    const counterName = "testpoliticoargentino_completados"; // reemplaza por tu contador exacto

    // Asegúrate de tener tu API Key en las variables de entorno
    const apiKey = process.env.COUNTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "COUNTER_API_KEY not set" });
    }

    // URL V2 de CounterAPI para incrementar
    const url = `https://api.counterapi.dev/v2/${workspace}/${counterName}/up`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      // Si CounterAPI responde con error
      const errorData = await response.json();
      return res.status(response.status).json({ error: "CounterAPI error", details: errorData });
    }

    const data = await response.json();

    // Retornamos el valor actualizado del contador
    return res.json({ value: data.data.up_count });
  } catch (err) {
    console.error("Error incrementCounter:", err);
    return res.status(500).json({ error: "Error incrementing counter", details: err });
  }
}
