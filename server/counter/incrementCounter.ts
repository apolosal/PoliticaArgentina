import { Request, Response } from "express";
import fetch from "node-fetch";

export async function incrementCounter(req: Request, res: Response) {
  try {
    const apiKey = process.env.COUNTER_API_KEY;
    const workspace = process.env.COUNTER_WORKSPACE;
    const slug = process.env.COUNTER_SLUG;

    const response = await fetch("https://api.counterapi.dev/v1/counter/up", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ workspace, slug })
    });

    const json = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: "Invalid API response", json });
    }

    return res.json({ value: json.data.up_count });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
}
