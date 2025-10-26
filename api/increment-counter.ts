import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const response = await fetch("https://counterapi.dev/api/v1/counter/increment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.COUNTER_API_KEY}`,
      },
      body: JSON.stringify({
        namespace: "politicatest",
        key: "completados",
        amount: 1,
      }),
    });

    const data = await response.json();
    return res.status(200).json(data);

  } catch (error) {
    console.error("Error incrementando contador:", error);
    return res.status(500).json({ error: "No se pudo incrementar contador" });
  }
}
