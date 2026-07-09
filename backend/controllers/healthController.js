export default function healthController(req, res) {
  res.json({
    status: "ok",
    service: "localmind-backend",
    ollamaUrl: process.env.OLLAMA_URL || null,
    defaultModel: process.env.DEFAULT_MODEL || null,
    timestamp: new Date().toISOString(),
  });
}
