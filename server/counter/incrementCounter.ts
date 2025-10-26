import { Request, Response } from "express";
import fetch from "node-fetch";

export async function incrementCounter(req: Request, res: Response) {
  try {
    const response = await fetch(
      "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados/up",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.COUNTER_API_KEY}`,
          "Content-Type": "application/json"
        },
      }
    );

    const data = await response.json();

    if (!data || !data.data || typeof data.data.value !== "number") {
      throw new Error("Invalid response from CounterAPI");
    }

    res.json({ value: data.data.value });
  } catch (error: any) {
    res.status(500).json({
      error: "Error incrementing counter",
      details: error.message
    });
  }
}
