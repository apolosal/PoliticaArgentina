import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const response = await fetch(
      "https://counterapi.dev/api/v1/counter/get?namespace=politicatest&key=completados",
      {
        headers: {
          Authorization: `Bearer ${process.env.COUNTER_API_KEY}`,
        },
      }
    );

    const data = await response.json();
    return res.status(200).json({ value: data.count || 0 });

  } catch (error) {
    console.error("Error obteniendo contador:", error);
    return res.status(500).json({ error: "No se pudo obtener contador" });
  }
}
