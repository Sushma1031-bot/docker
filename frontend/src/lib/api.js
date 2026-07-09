const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

async function parseError(response) {
  let detail = null;
  try {
    const body = await response.json();
    detail = body.detail || body.error || body.message || null;
  } catch {
    detail = await response.text().catch(() => null);
  }
  return detail;
}

export async function getHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error(await parseError(res) || `HTTP ${res.status}`);
  return res.json();
}

export async function getModels() {
  const res = await fetch(`${BASE_URL}/models`);
  if (!res.ok) throw new Error(await parseError(res) || `HTTP ${res.status}`);
  const data = await res.json();
  return data.models || [];
}

export async function sendChat({ model, messages, signal }) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages }),
    signal,
  });

  if (!res.ok) {
    const detail = await parseError(res);
    throw new Error(detail || `HTTP ${res.status}`);
  }

  const data = await res.json();
  const content =
    data?.message?.content ??
    data?.response ??
    data?.message ??
    "";

  return { content, raw: data };
}
