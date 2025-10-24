import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "completedTest.json");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Método no permitido" });

  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: "Falta sessionId" });

  try {
    let completed: string[] = [];

    if (fs.existsSync(DATA_FILE)) {
      completed = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    }

    // Si ya está, no incrementamos
    if (completed.includes(sessionId)) {
      return res.status(200).json({ incremented: false });
    }

    // Guardar sessionId como completado
    completed.push(sessionId);
    fs.writeFileSync(DATA_FILE, JSON.stringify(completed, null, 2));

    // Incrementar contador llamando CounterAPI (directo, sin CORS)
    await fetch(
      `https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados/up`,
      {
        method: "POST",
      }
    );

    return res.status(200).json({ incremented: true });
  } catch (error) {
    console.error("Error en increment-test:", error);
    return res.status(500).json({ incremented: false });
  }
}
