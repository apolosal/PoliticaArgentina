import fetch from "node-fetch";

const COUNTER_API_URL = "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados";

export async function incrementCounter(req: any, res: any) {
  try {
    const response = await fetch(`${COUNTER_API_URL}/up`, {
      method: "GET", // CounterAPI usa GET incluso para incrementar
      headers: {
        Authorization: `Bearer ${process.env.COUNTER_API_KEY}`
      }
    });

    const data = await response.json();

    // La respuesta de V2 tiene data.value
    res.json({ value: data.data.value });
  } catch (err) {
    res.status(500).json({ error: "Error incrementing counter", details: err });
  }
}
