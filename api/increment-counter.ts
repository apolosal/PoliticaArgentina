import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "completedTest.json");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: "Falta sessionId" });

  try {
    // Leer archivo JSON (si no existe, crear uno vacío)
    let completed: string[] = [];
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      completed = JSON.parse(raw);
    }

    // Verificar si el usuario ya completó el test
    if (completed.includes(sessionId)) {
      return res.status(200).json({ message: "Ya completó el test", incremented: false });
    }

    // Agregar sessionId al JSON
    completed.push(sessionId);
    fs.writeFileSync(DATA_FILE, JSON.stringify(completed, null, 2));

    // Llamar a CounterAPI para incrementar
    const response = await fetch(
      "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados/up",
      {
        method: "POST",
        headers: { Authorization: "Bearer ut_A7K6C52qUL6Ehp30saib8V6RCWYi3ohbY6PUAYQS" }, // Reemplazar TU_API_KEY
      }
    );

    if (!response.ok) throw new Error("Error al incrementar CounterAPI");
    const data = await response.json();

    res.status(200).json({ message: "Contador incrementado", value: data.value, incremented: true });
  } catch (error) {
    console.error("Error en increment-counter:", error);
    res.status(500).json({ error: "Error al incrementar contador" });
  }
}
