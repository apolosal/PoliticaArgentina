import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(
      "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados",
      {
        headers: { Authorization: "Bearer ut_A7K6C52qUL6Ehp30saib8V6RCWYi3ohbY6PUAYQS" }, // Reemplazar TU_API_KEY
      }
    );

    if (!response.ok) throw new Error("Error al consultar CounterAPI");

    const data = await response.json();
    res.status(200).json({ value: data.value });
  } catch (error) {
    console.error("Error al traer contador:", error);
    res.status(500).json({ error: "Error al obtener contador" });
  }
}

