const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";
const DEFAULT_MODEL = process.env.DEFAULT_MODEL || "llama3";

export default async function chatController(req, res) {
  try {
    const { model, messages } = req.body || {};

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "messages is required and must be a non-empty array",
      });
    }

    const invalid = messages.find(
      (m) => !m.role || typeof m.content !== "string"
    );
    if (invalid) {
      return res.status(400).json({
        error: "Each message must have a 'role' and a string 'content'",
      });
    }

    const selectedModel = model || DEFAULT_MODEL;

    const ollamaRes = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: selectedModel,
        messages,
        stream: false,
      }),
    });

    if (!ollamaRes.ok) {
      return res.status(ollamaRes.status).json({
        error: `Ollama returned ${ollamaRes.status}`,
        detail: await safeText(ollamaRes),
      });
    }

    const data = await ollamaRes.json();
    res.json(data);
  } catch (err) {
    res.status(502).json({
      error: "Failed to reach Ollama",
      detail: err.message,
    });
  }
}

async function safeText(response) {
  try {
    return await response.text();
  } catch {
    return null;
  }
}
