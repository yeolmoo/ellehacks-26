const handler = async (req: any, res: any) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    const { del } = require("@vercel/blob");

    const body = req.body || {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing GEMINI_API_KEY" });
    }

    return res.status(200).json({ ok: true, note: "handler reached" });
  } catch (err: any) {
    return res.status(500).json({
      error: "Analysis failed",
      detail: String(err?.message || err),
    });
  }
};

module.exports = handler;
