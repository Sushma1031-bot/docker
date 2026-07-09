import express from "express";
import cors from "cors";
import routes from "./routes/index.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/", routes);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`LocalMind backend listening on port ${PORT}`);
  console.log(`Ollama URL: ${process.env.OLLAMA_URL || "(default not set)"}`);
  console.log(`Default model: ${process.env.DEFAULT_MODEL || "(not set)"}`);
});
