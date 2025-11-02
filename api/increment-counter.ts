import { Request, Response } from "express";

// -----------------------------
// Contador local y registro de usuarios
// -----------------------------
let localCounter = 0;
const userIncrementMap: Record<string, boolean> = {};

// Lock para evitar increments simultáneos
let incrementLock = false;

// -----------------------------
// Endpoint para incrementar contador
// -----------------------------
export async function incrementCounter(req: Request, res: Response) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const userId = (req.headers["x-user-id"] as string) || req.ip;

  // Si ya incrementó
  if (userIncrementMap[userId]) {
    return res.status(200).json({ message: "Already incremented", value: localCounter });
  }

  // -----------------------------
  // Lock para evitar increments simultáneos
  // -----------------------------
  while (incrementLock) {
    await new Promise(resolve => setTimeout(resolve, 1)); // espera 1ms
  }
  incrementLock = true;

  try {
    // Incremento seguro
    localCounter += 1;
    userIncrementMap[userId] = true;

    // Registro externo en CounterAPI (no afecta valor local)
    fetch("https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados/up", { method: "GET" })
      .then(resp => resp.json())
      .then(json => console.log("✅ CounterAPI incremented:", json?.data?.up_count))
      .catch(err => console.error("⚠️ Error CounterAPI:", err));

    return res.json({ value: localCounter });

  } finally {
    incrementLock = false;
  }
}

// -----------------------------
// Endpoint para consultar contador local
// -----------------------------
export function getCounter(_req: Request, res: Response) {
  return res.json({ value: localCounter });
}
