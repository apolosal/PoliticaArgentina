import type { NextApiRequest, NextApiResponse } from "next";

export const dynamic = "force-dynamic";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).json({ error: "Método no permitido" });

  try {
    const token = process.env.COUNTER_API_TOKEN;
    if (!token) return res.status(500).json({ error: "Falta COUNTER_API_TOKEN en Render" });

    const r = await fetch("https://counterapi.dev/api/value?namespace=politica-argentina&key=completados", {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await r.json();
    return res.status(200).json({ value: data.value ?? 0 });
  } catch (error) {
    return res.status(500).json({ error: "Error al obtener contador" });
  }
}
