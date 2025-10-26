import type { Request, Response } from "express";

export async function incrementCounter(req: Request, res: Response) {
  try {
    const apiKey = process.env.COUNTER_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "COUNTER_API_KEY not set" });

    console.log("COUNTER_API_KEY present (first 5 chars):", apiKey.slice(0, 5) + "...");

    const response = await fetch(
      "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados/up",
      {
        method: "GET", // V2 usa GET para incrementar
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );

    const contentType = response.headers.get("content-type");
    const text = await response.text();
    console.log("CounterAPI increment response text:", text);

    if (!contentType?.includes("application/json")) {
      console.error("CounterAPI increment no devolvió JSON válido, retornando 0");
      return res.json({ value: 0 });
    }

    const data = JSON.parse(text);
    return res.json({ value: data.value ?? 0 });

  } catch (err) {
    console.error("Error incrementCounter:", err);
    return res.status(500).json({ error: "Error incrementing counter", details: err });
  }
}
