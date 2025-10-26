import fetch from "node-fetch";

const COUNTER_API_URL = "https://api.counterapi.dev/v2/politicaar/testpoliticoargentino-completados";

export async function getCounter(req: any, res: any) {
  try {
    const response = await fetch(COUNTER_API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.COUNTER_API_KEY}`
      }
    });

    const data = await response.json();
    res.json({ value: data.data.value });
  } catch (err) {
    res.status(500).json({ error: "Error fetching counter", details: err });
  }
}
