import { Request, Response } from "express";

export async function incrementCounter(_req: Request, res: Response) {
  try {
    const url = "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados/up";

    // ✅ IMPORTANTE: usar GET, no POST
    const response = await fetch(url, { method: "GET" });

    const json = await response.json();

    // ✅ El valor real está en json.data.up_count
    const value = json?.data?.up_count;

    if (value === undefined) {
      return res.status(500).json({ error: "Unexpected API response", json });
    }

    return res.json({ value });
  } catch (err) {
    console.error("Error incrementCounter:", err);
    return res.status(500).json({ error: "Error incrementing counter" });
  }
}
