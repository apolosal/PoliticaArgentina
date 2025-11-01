import { Request, Response } from "express";

// Contador local (fuente de verdad)
let localCounter = 0;

// Registro de usuarios que ya incrementaron
const userIncrementMap: Record<string, boolean> = {};

export async function incrementCounter(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Identificador del usuario (puede ser x-user-id o IP)
  const userId = req.headers["x-user-id"] || req.ip;

  // Si el usuario ya incrementó, devolvemos el contador actual
  if (userIncrementMap[userId as string]) {
    return res.status(200).json({ message: "Already incremented", value: localCounter });
  }

  try {
    // Incrementamos el contador local
    localCounter += 1;

    // Marcamos al usuario como incrementado
    userIncrementMap[userId as string] = true;

    // Enviamos incremento a CounterAPI para registro externo (no bloquea el valor local)
    const url = "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados/up";
    fetch(url, { method: "GET" })
      .then(response => response.json())
      .then(json => console.log("CounterAPI incremented:", json?.data?.up_count))
      .catch(err => console.error("Error updating CounterAPI:", err));

    // Devolvemos valor actualizado consistente
    return res.json({ value: localCounter });

  } catch (err) {
    console.error("Error incrementCounter:", err);
    return res.status(500).json({ error: "Error incrementing counter" });
  }
}

// Endpoint opcional para consultar el contador local
export function getCounter(_req: Request, res: Response) {
  return res.json({ value: localCounter });
}
