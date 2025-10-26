import type { Request, Response } from "express";
import fetch from "node-fetch";

export async function incrementCounter(req: Request, res: Response) {
  try {
    // Tomamos las variables de entorno
    const apiKey = process.env.COUNTER_API_KEY;       // Tu token V2
    const workspace = process.env.COUNTER_WORKSPACE; // "politicaar"
    const counterSlug = process.env.COUNTER_SLUG;    // "testpoliticoargentino-completados"

    // Validación rápida
    if (!apiKey || !workspace || !counterSlug) {
      return res.status(500).json({
        error: "COUNTER_API_KEY, COUNTER_WORKSPACE o COUNTER_SLUG no definido"
      });
    }

    // URL correcta para V2
    const url = `https://api.counterapi.dev/v2/${workspace}/${counterSlug}/up`;

    // Llamada POST con API Key
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`
      }
    });

    const data = await response.json();

    // Validamos que CounterAPI devolvió datos
    if (!data || !data.data || typeof data.data.up_count !== "number") {
      return res.status(500).json({
        error: "Invalid API response",
        json: data
      });
    }

    // Retornamos el valor actualizado
    return res.json({ value: data.data.up_count });

  } catch (err) {
    console.error("❌ Error incrementCounter:", err);
    return res.status(500).json({ error: "Error incrementing counter" });
  }
}
