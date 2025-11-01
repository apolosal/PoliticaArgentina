import { Request, Response } from "express";

// Para pruebas: memoria temporal
const userIncrementMap: Record<string, boolean> = {};

export async function incrementCounter(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Identificador de usuario (puede ser email, userId o IP)
  const userId = req.headers["x-user-id"] || req.ip; // fallback si no hay login

  // Si el usuario ya incrementó, no hacemos otra llamada
  if (userIncrementMap[userId as string]) {
    return res.status(200).json({ message: "Already incremented", value: "unchanged" });
  }

  try {
    const url = "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados/up";

    const response = await fetch(url, { method: "GET" });
    const json = await response.json();
    const value = json?.data?.up_count;

    if (value === undefined) {
      return res.status(500).json({ error: "Unexpected API response", json });
    }

    // Marcamos que este usuario ya incrementó
    userIncrementMap[userId as string] = true;

    return res.json({ value });
  } catch (err) {
    console.error("Error incrementCounter:", err);
    return res.status(500).json({ error: "Error incrementing counter" });
  }
}
