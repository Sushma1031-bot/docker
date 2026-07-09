const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

export default async function modelsController(req, res) {
  try {
    const response = await fetch(`${OLLAMA_URL}/api/tags`, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      return res.status(502).json({
        error: `Ollama returned ${response.status}`,
        detail: await safeText(response),
      });
    }

    const data = await response.json();
    const models = (data.models || []).map((m) => ({
      name: m.name,
      size: m.size,
      modifiedAt: m.modified_at,
    }));

    res.json({ models });
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
