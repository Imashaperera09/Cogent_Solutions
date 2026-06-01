# Cogent Solutions — Full-Stack Technical Assessment
## Troubled Waters: Sailing with AI in Supply Chain
### Accelalpha × Oracle | 13th November 2024 | Marriott Resort, The Palm, Dubai

---

## 🏗️ Project Structure

```
Cogent_Solutions/
├── backend/
│   ├── main.py          ← FastAPI app (RAG + LLM + MCP simulation)
│   ├── agenda.txt       ← Conference schedule (RAG knowledge base)
│   ├── requirements.txt
│   └── .env.example     ← Copy to .env and add your Gemini API key
└── frontend/
    └── src/app/
        ├── page.tsx     ← Full SPA (Next.js 14)
        ├── layout.tsx
        └── globals.css  ← Custom design system
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Set up environment
copy .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start the server
uvicorn main:app --reload --port 8000
```

> **Note:** The backend runs without a Gemini API key — it falls back to a templated invitation. Add `GEMINI_API_KEY` to `.env` for full LLM generation.

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Core Features

### 🎨 Frontend (Next.js 14)
- **Creative Hero** — Full-screen animated gradient with live countdown timer
- **About Section** — Gulf supply chain context with animated stats
- **Speakers Grid** — All 8 industry speakers with hover animations
- **Filterable Agenda** — Timeline with category filters (Keynote / Workshop / Panel / etc.)
- **Registration Form** — Name + Email + Professional Focus → triggers backend pipeline
- **Result Modal** — Shows matched session + generated personalized invitation
- **Theme Toggle** — Dark / Light mode

### 🧠 Backend (FastAPI + Python)
- **RAG Matching** — TF-IDF cosine similarity against `agenda.txt` sessions
- **LLM Drafting** — Google Gemini with strict anti-hallucination system prompt
- **MCP Simulation** — `send_draft_via_mcp()` fires automatically with UTC timestamp
- **REST API** — `POST /api/register`, `GET /api/sessions`

### 🔗 API Endpoints
| Method | Endpoint        | Description                              |
|--------|-----------------|------------------------------------------|
| GET    | `/`             | Health check + session count             |
| GET    | `/api/sessions` | All agenda sessions (for frontend)       |
| POST   | `/api/register` | Register → RAG → LLM → MCP trigger      |

