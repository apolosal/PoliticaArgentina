import { Request, Response } from "express";

// Registro de usuarios que ya incrementaron
const userIncrementMap: Record<string, boolean> = {};

// Contador local opcional (para usar en frontend o tests)
let localCounter = 0;

export async function incrementCounter(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Identificador del usuario
  const userId = req.headers["x-user-id"] || req.ip;

  // Si el usuario ya incrementó, devolvemos el valor actual
  if (userIncrementMap[userId as string]) {
    return res.status(200).json({ message: "Already incremented", value: localCounter });
  }

  try {
    // Incrementamos el contador local
    localCounter += 1;

    // Marcamos al usuario como incrementado
    userIncrementMap[userId as string] = true;

    // ✅ Enviamos el incremento a CounterAPI
    const url = "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados/up";

    // Hacemos fetch a CounterAPI y no bloqueamos la respuesta si falla
    fetch(url, { method: "GET" })
      .then(response => response.json())
      .then(json => {
        console.log("CounterAPI incremented:", json?.data?.up_count);
      })
      .catch(err => {
        console.error("Error updating CounterAPI:", err);
      });

    // Devolvemos valor actualizado
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
