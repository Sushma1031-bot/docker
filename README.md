# LocalMind AI

A ChatGPT-style web application that talks to a **locally running [Ollama](https://ollama.com)** server — fully containerized with Docker and ready to run with a single command.

> No authentication. No database. No streaming. Just a clean, modern, private AI chat UI that runs entirely on your machine.

---

## Project Overview

LocalMind AI is a lightweight, self-hosted alternative to cloud chat apps. It wraps a local Ollama instance in a polished web interface built with React, Vite, Tailwind CSS, and a thin Express backend. Everything ships in Docker, so it runs the same way on any machine with minimal setup.

The AI model is configurable through a single environment variable — swap `llama3` for `mistral`, `phi3`, or any model you've pulled, and the app picks it up automatically.

---

## Features

- ChatGPT-style chat interface with sidebar
- New Chat / Clear Chat buttons
- Conversation history persisted across reloads (in-browser, no database)
- User and AI message bubbles with distinct styling
- Auto-scroll to the latest message
- Loading indicator while the model is responding
- Inline error notifications with retry
- Fully responsive layout (mobile, tablet, desktop)
- Dark, modern UI with smooth micro-interactions
- Connects to Ollama via its REST API
- Model configurable through environment variable (`DEFAULT_MODEL`)
- Stop generation button (cancels in-flight requests)

---

## Architecture

```
Browser  ──HTTP──▶  Frontend (Vite dev server :5173)
                          │
                          └──▶  Backend (Express :3001)
                                      │
                                      └──▶  Ollama REST API (:11434 on host)
```

| Layer    | Tech                          | Responsibility                                  |
| -------- | ----------------------------- | ----------------------------------------------- |
| Frontend | React + Vite + Tailwind CSS   | UI, chat state, message rendering, input       |
| Backend  | Node.js + Express             | Proxy to Ollama, health & model listing        |
| AI       | Ollama REST API               | Runs the local LLM and returns completions      |

The frontend talks only to the backend, which proxies to Ollama. This keeps the Ollama URL off the browser and lets Docker networking (`host.docker.internal`) reach the host where Ollama runs.

---

## Folder Structure

```
localmind-ai/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── ChatInput.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── LoadingDots.jsx
│   │   │   └── ErrorBanner.jsx
│   │   ├── hooks/
│   │   │   └── useChat.js
│   │   ├── lib/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   │   └── vite.svg
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── Dockerfile
│   ├── .env
│   └── .env.example
├── backend/
│   ├── controllers/
│   │   ├── healthController.js
│   │   ├── modelsController.js
│   │   └── chatController.js
│   ├── routes/
│   │   └── index.js
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   ├── .env
│   └── .env.example
├── docker-compose.yml
├── .dockerignore
├── .gitignore
├── README.md
└── LICENSE
```

---

## Prerequisites

You need three things installed on your machine:

1. **Docker** (with the Compose plugin)
2. **Ollama** — to run the local model
3. A pulled model (e.g. `llama3`)

Git is optional (only if you want to clone/push the repo).

### Installing Docker

#### Linux (Ubuntu / Debian)

```bash
# Add Docker's official GPG key and repository
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify
docker --version
docker compose version
```

#### macOS

Download **Docker Desktop** from <https://www.docker.com/products/docker-desktop/> and install it. Start the app, then verify:

```bash
docker --version
docker compose version
```

#### Windows

Install **Docker Desktop** (includes Compose) from <https://www.docker.com/products/docker-desktop/>. On Windows, `host.docker.internal` works out of the box. Verify in PowerShell:

```powershell
docker --version
docker compose version
```

---

### Running Ollama

Ollama must run **on your host machine** (not inside Docker) so the containers can reach it.

#### Linux

```bash
curl -fsSL https://ollama.com/install.sh | sh
ollama serve        # starts the REST API on http://localhost:11434
```

#### macOS

Download the macOS app from <https://ollama.com/download>, install it, and launch it. The app runs the server at `http://localhost:11434`.

#### Windows

Download the Windows installer from <https://ollama.com/download>, install it, and launch it.

> The Ollama server listens on port **11434** by default. Leave it running while you use LocalMind AI.

---

### Pulling llama3

With Ollama running, pull the default model in a separate terminal:

```bash
ollama pull llama3
```

This downloads the model (a few GB) once. To use a different model later, pull it and update `DEFAULT_MODEL` in `backend/.env`:

```bash
ollama pull mistral
ollama pull phi3
ollama pull qwen2.5
```

---

### Creating the `.env` files

Sample `.env` files are committed under `backend/.env` and `frontend/.env` with working defaults, plus `.env.example` copies for reference. Edit them if your setup differs.

**`backend/.env`**

```env
PORT=3001
OLLAMA_URL=http://host.docker.internal:11434
DEFAULT_MODEL=llama3
```

> On Linux, `host.docker.internal` is resolved by the `extra_hosts` entry in `docker-compose.yml`. On macOS/Windows (Docker Desktop) it works automatically. If you run the backend **outside** Docker, set `OLLAMA_URL=http://localhost:11434`.

**`frontend/.env`**

```env
VITE_API_URL=http://localhost:3001
```

> This is the URL the browser uses to reach the backend. Keep it as `localhost:3001` when running via Docker Compose on the same machine.

---

## Docker Build

To build the images without starting them:

```bash
docker compose build
```

To start everything (builds automatically if images are missing):

```bash
docker compose up --build
```

Then open the app in your browser:

```
http://localhost:5173
```

The backend health check is available at:

```
http://localhost:3001/health
```

---

## Docker Compose Up

```bash
# From the project root
docker compose up --build
```

- Frontend → <http://localhost:5173>
- Backend  → <http://localhost:3001>
- Ollama   → <http://localhost:11434> (on your host)

---

## Stopping Containers

Stop and remove the containers (keeps images):

```bash
docker compose down
```

Stop and remove containers **and** images (full clean rebuild next time):

```bash
docker compose down --rmi local
```

View live logs:

```bash
docker compose logs -f
docker compose logs -f backend
docker compose logs -f frontend
```

---

## Environment Variables

### Backend

| Variable        | Description                                        | Default                              |
| --------------- | -------------------------------------------------- | ------------------------------------ |
| `PORT`          | Port the Express server listens on                 | `3001`                               |
| `OLLAMA_URL`    | Base URL of the Ollama REST API                    | `http://host.docker.internal:11434`  |
| `DEFAULT_MODEL` | Model used for chat when none is specified         | `llama3`                             |

### Frontend

| Variable        | Description                                        | Default                          |
| --------------- | -------------------------------------------------- | -------------------------------- |
| `VITE_API_URL`  | Base URL of the LocalMind backend                  | `http://localhost:3001`          |

---

## API Endpoints

| Method | Endpoint     | Description                                                       |
| ------ | ------------ | ----------------------------------------------------------------- |
| `GET`  | `/health`    | Returns service status and the configured Ollama URL + model.     |
| `GET`  | `/models`    | Lists models available in the local Ollama instance.              |
| `POST` | `/chat`      | Sends a prompt to Ollama and returns the generated response.       |

### `POST /chat` body

```json
{
  "model": "llama3",
  "messages": [
    { "role": "system", "content": "You are a helpful assistant." },
    { "role": "user", "content": "Hello!" }
  ]
}
```

`model` is optional — if omitted, the backend uses `DEFAULT_MODEL`. `messages` is required and follows the OpenAI-style roles: `system`, `user`, `assistant`.

### `POST /chat` response

```json
{
  "model": "llama3",
  "message": { "role": "assistant", "content": "Hi there! How can I help?" },
  "done": true
}
```

---

## Screenshots

> Place screenshots here once you've run the app.

```
docs/
  ├── chat-desktop.png
  ├── chat-mobile.png
  └── sidebar-open.png
```

---

## Future Improvements

- Streaming responses (token-by-token) via Ollama's `stream: true`
- Multiple saved conversations with titles
- Model picker dropdown populated from `/models`
- Markdown / code-block rendering with syntax highlighting
- Token usage and latency stats
- Export conversation as Markdown or JSON
- Light theme toggle
- Docker healthchecks and multi-stage production builds

---

## License

Released under the [MIT License](./LICENSE).
