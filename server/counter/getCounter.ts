import type { Request, Response } from "express";

export const getCounter = async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.COUNTER_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "COUNTER_API_KEY not set" });

    const response = await fetch(
      `https://counterapi.dev/v1/counter/politicaargentina/completados`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );

    const data = await response.json();
    return res.json({ value: data.value ?? 0 });
  } catch (err) {
    console.error("Error getCounter:", err);
    return res.status(500).json({ error: "Error fetching counter" });
  }
};
