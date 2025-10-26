import { Request, Response } from "express";
import fetch from "node-fetch";

export const incrementCounter = async (req: Request, res: Response) => {
  try {
    // Revisar si el usuario ya completó (cookie)
    const userId = req.cookies?.user_id;
    if (!userId) {
      return res.status(400).json({ error: "No user identifier found" });
    }

    // Variables de entorno
    const apiKey = process.env.COUNTER_API_KEY;
    const workspace = process.env.COUNTER_WORKSPACE;
    const counterName = process.env.COUNTER_SLUG;

    if (!apiKey || !workspace || !counterName) {
      return res.status(500).json({ error: "COUNTER_API_KEY, COUNTER_WORKSPACE o COUNTER_SLUG no definido" });
    }

    const url = `https://api.counterapi.dev/v2/${workspace}/${counterName}/up`;

    // Llamada a CounterAPI
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const json = await response.json();

    if (json.code !== 200) {
      return res.status(500).json({ error: "Invalid API response", json });
    }

    // Devolver el nuevo valor
    return res.json({ value: json.data.up_count });

  } catch (err) {
    console.error("Error incrementing counter:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
