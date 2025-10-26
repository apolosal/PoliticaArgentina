import type { Request, Response } from "express";
import fetch from "node-fetch";

export async function incrementCounter(req: Request, res: Response) {
  try {
    const apiKey = process.env.COUNTER_API_KEY;
    const workspace = process.env.COUNTER_WORKSPACE;
    const counterName = process.env.COUNTER_SLUG;

    if (!workspace || !counterName) {
      return res.status(500).json({ error: "COUNTER_WORKSPACE o COUNTER_SLUG no definido" });
    }

    const url = `https://api.counterapi.dev/v2/${workspace}/${counterName}/up`;

    const response = await fetch(url, {
      method: "POST",
      headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : {}
    });

    const data = await response.json();

    if (!data || !data.data || typeof data.data.up_count !== "number") {
      console.error("❌ Invalid API response:", data);
      return res.status(500).json({ error: "Invalid API response", json: data });
    }

    return res.json({ value: data.data.up_count });

  } catch (err) {
    console.error("Error incrementCounter:", err);
    return res.status(500).json({ error: "Error incrementing counter", details: err });
  }
}
