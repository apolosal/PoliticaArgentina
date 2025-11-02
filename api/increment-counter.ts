import { Request, Response } from "express";

// -----------------------------
// Contador local (fuente de verdad)
// -----------------------------
let localCounter = 0;

// Registro de usuarios que ya incrementaron
const userIncrementMap: Record<string, boolean> = {};

// -----------------------------
// Endpoint para incrementar contador
// -----------------------------
export async function incrementCounter(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Identificador único del usuario: x-user-id o fallback a IP
  const userId = (req.headers["x-user-id"] as string) || req.ip;

  // Si el usuario ya incrementó, devolvemos el contador actual
  if (userIncrementMap[userId]) {
    return res.status(200).json({
      message: "Already incremented",
      value: localCounter
    });
  }

  try {
    // -----------------------------
    // 1. Incrementamos el contador local
    // -----------------------------
    localCounter += 1;

    // 2. Marcamos al usuario como incrementado
    userIncrementMap[userId] = true;

    // 3. Enviamos incremento a CounterAPI solo como registro externo
    const counterUrl =
      "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados/up";

    fetch(counterUrl, { method: "GET" })
      .then(response => response.json())
      .then(json =>
        console.log("✅ CounterAPI incremented:", json?.data?.up_count)
      )
      .catch(err =>
        console.error("⚠️ Error updating CounterAPI:", err)
      );

    // 4. Devolvemos valor local consistente
    return res.json({ value: localCounter });

  } catch (err) {
    console.error("Error incrementCounter:", err);
    return res.status(500).json({ error: "Error incrementing counter" });
  }
}

// -----------------------------
// Endpoint para consultar contador local
// -----------------------------
export function getCounter(_req: Request, res: Response) {
  return res.json({ value: localCounter });
}
