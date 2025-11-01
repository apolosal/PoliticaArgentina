import { Request, Response } from "express";

export async function incrementCounter(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const url = "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados/up";
    const response = await fetch(url, { method: "GET" });
    const json = await response.json();

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
