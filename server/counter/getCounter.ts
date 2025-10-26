import type { Request, Response } from "express";
import fetch from "node-fetch";

export async function getCounter(req: Request, res: Response) {
  try {
    const apiKey = process.env.COUNTER_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "COUNTER_API_KEY not set" });

    console.log("COUNTER_API_KEY present (first 5 chars):", apiKey.slice(0, 5) + "...");

    const response = await fetch(
      `https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );

    const contentType = response.headers.get("content-type");
    const text = await response.text();
    console.log("CounterAPI get response text:", text);

    if (!contentType?.includes("application/json")) {
      console.error("CounterAPI get no devolvió JSON válido, retornando 0");
      return res.json({ value: 0 });
    }

    const data = JSON.parse(text);
    return res.json({ value: data.value ?? 0 });

  } catch (err) {
    console.error("Error getCounter:", err);
    return res.status(500).json({ error: "Error fetching counter", details: err });
  }
}
