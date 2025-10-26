import express from "express";
import fetch from "node-fetch";

const router = express.Router();

router.post("/increment-counter", async (req, res) => {
  try {
    const apiKey = process.env.COUNTER_API_KEY;
    const workspace = process.env.COUNTER_WORKSPACE;
    const slug = process.env.COUNTER_SLUG;

    const response = await fetch("https://api.counterapi.dev/v1/counter/up", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        workspace,
        slug
      })
    });

    const json = await response.json();

    if (!response.ok) {
      console.error("❌ Invalid API Key response:", json);
      return res.status(500).json({ error: "Invalid API Key response", json });
    }

    // ✅ Devolver valor al frontend
    return res.json({ value: json.data.up_count });

  } catch (error) {
    console.error("🔥 Server error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
