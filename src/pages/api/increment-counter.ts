import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "completedTest.json");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ error: "Método no permitido" });

  const { sessionId } = req.body;
  if (!sessionId) return res.status(400).json({ error: "Falta sessionId" });

  try {
    let completed: string[] = [];
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      completed = JSON.parse(raw);
    }

    // Verificar usuario único
    if (completed.includes(sessionId)) {
      return res.status(200).json({ message: "Ya completó el test", incremented: false });
    }

    // Guardar sessionId
    completed.push(sessionId);
    fs.writeFileSync(DATA_FILE, JSON.stringify(completed, null, 2));

    // Opcional: Aquí podrías llamar a la CounterAPI si quieres un contador externo
    // const response = await fetch("https://api.countapi.xyz/hit/testpoliticoargentino/completados");
    // const data = await response.json();

    res.status(200).json({ message: "Contador incrementado", incremented: true });
  } catch (error) {
    console.error("Error al incrementar contador:", error);
    res.status(500).json({ error: "Error al incrementar contador" });
  }
}
