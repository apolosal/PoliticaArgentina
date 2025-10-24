import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch(
      `https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados`
    );

    const data = await response.json();
    return res.status(200).json({ value: data.count ?? data.value ?? 0 });
  } catch (error) {
    console.error("Error en get-counter:", error);
    return res.status(500).json({ value: 0 });
  }
}
