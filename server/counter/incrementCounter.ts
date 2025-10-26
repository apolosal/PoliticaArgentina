import fetch from "node-fetch";

export async function incrementCounter(req: any, res: any) {
  const apiKey = process.env.COUNTER_API_KEY || "TU_COUNTERAPI_KEY";
  const workspace = "politicaar"; // tu workspace
  const key = "testpoliticoargentino-completados";

  try {
    const response = await fetch(`https://api.counterapi.dev/v2/${workspace}/${key}/up`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    const data = await response.json();

    if (!data || !data.data || typeof data.data.value !== "number") {
      throw new Error("Invalid response from CounterAPI");
    }

    res.json({ value: data.data.value });
  } catch (error: any) {
    console.error("Error incrementing counter:", error);
    res.status(500).json({ error: "Error incrementing counter", details: error.message });
  }
}
