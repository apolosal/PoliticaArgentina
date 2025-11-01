import { Request, Response } from "express";

// Contador local temporal (memoria del servidor)
let localCounter = 0;

// Registro de usuarios que ya incrementaron
const userIncrementMap: Record<string, boolean> = {};

export async function incrementCounter(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Identificador del usuario
  const userId = req.headers["x-user-id"] || req.ip;

  // Si ya incrementó, devolvemos el valor actual
  if (userIncrementMap[userId as string]) {
    return res.status(200).json({ message: "Already incremented", value: localCounter });
  }

  try {
    // Incrementamos el contador local
    localCounter += 1;

    // Marcamos al usuario como incrementado
    userIncrementMap[userId as string] = true;

    // Llamada opcional a CounterAPI para registrar externamente
    const url = "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados/up";
    fetch(url, { method: "GET" }).catch(err => {
      console.error("Error updating CounterAPI:", err);
    });

    // Devolvemos el valor actualizado
    return res.json({ value: localCounter });
  } catch (err) {
    console.error("Error incrementCounter:", err);
    return res.status(500).json({ error: "Error incrementing counter" });
  }
}

// Endpoint para obtener el contador actual
export function getCounter(_req: Request, res: Response) {
  return res.json({ value: localCounter });
}
