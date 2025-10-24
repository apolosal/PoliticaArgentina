import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "completedTest.json");

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Método no permitido" });

  try {
    let completed: string[] = [];
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      completed = JSON.parse(raw);
    }

    // Opcional: también podrías traer el valor de CounterAPI si quieres un contador externo
    const contador = completed.length;

    res.status(200).json({ value: contador });
  } catch (error) {
    console.error("Error al leer contador:", error);
    res.status(500).json({ error: "Error al obtener contador" });
  }
}
