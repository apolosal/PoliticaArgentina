import { Request, Response } from "express";

export const incrementCounter = async (_req: Request, res: Response) => {
  try {
    const response = await fetch(
      "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados/up",
      { method: "POST" }
    );

    const json = await response.json();

    // ✅ Tomamos el valor correcto que devuelve V2
    const value = json?.data?.up_count;

    // Si no existe, devolvemos error adecuado
    if (value === undefined) {
      return res.status(500).json({ error: "Invalid API response", json });
    }

    return res.json({ value });
  } catch (error) {
    return res.status(500).json({ error: "Error incrementing counter", details: error });
  }
};
