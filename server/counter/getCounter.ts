import type { Request, Response } from "express";

export const getCounter = async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.COUNTER_API_KEY;
    if (!apiKey) {
      console.error("COUNTER_API_KEY not set");
      return res.status(500).json({ error: "COUNTER_API_KEY not set" });
    }

    console.log("COUNTER_API_KEY present (first 5 chars):", apiKey.slice(0, 5) + "...");

    const response = await fetch(
      `https://counterapi.dev/v1/counter/testpoliticoargentino-completados`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );

    if (!response.ok) {
      const text = await response.text();
      console.error("Counter API error:", response.status, text);
      return res.status(500).json({ error: "Error fetching counter", status: response.status, details: text });
    }

    const data = await response.json();
    return res.json({ value: data.value ?? 0 });

  } catch (err) {
    console.error("Error getCounter:", err);
    return res.status(500).json({ error: "Error fetching counter", details: err });
  }
};
