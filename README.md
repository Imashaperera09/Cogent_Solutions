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

### 📦 POST `/api/register` Payload
```json
{
  "name": "Sarah Al-Mansoori",
  "email": "sarah@company.ae",
  "professional_focus": "I'm a COO struggling with rising logistics costs and lack of real-time supply chain visibility"
}
```

### 📤 Response
```json
{
  "matched_session": {
    "title": "Industry Keynote: Outlook & Challenges on Digital Logistics...",
    "time": "10:10 AM - 10:40 AM",
    "type": "Keynote",
    "speaker": "Srivatsav Sarvepalli",
    "description": "...",
    "match_score": 0.724
  },
  "email_draft": "Dear Sarah, ...",
  "mcp_triggered": true
}
```

---

## 🔒 Anti-Hallucination Prompt Rules

The LLM system prompt strictly enforces:
1. Only use information **explicitly provided** in context
2. **Never fabricate** speaker names, times, sessions, or topics
3. Omit details if unavailable — **never guess**
4. Professional B2B tone for C-suite audience
5. 200–280 words, ends with a **clear CTA to register**

---

## 📋 MCP Simulation Output (Server Log)

```
══════════════════════════════════════════════════════════════════════════
  🚀  MCP TRIGGER FIRED — send_draft_via_mcp()
══════════════════════════════════════════════════════════════════════════
  📧  RECIPIENT     : sarah@company.ae
  🕐  UTC TIMESTAMP : 2024-11-10T08:32:11Z
────────────────────────────────────────────────────────────────────────
  📨  EMAIL BODY:
────────────────────────────────────────────────────────────────────────
  Dear Sarah, ...
══════════════════════════════════════════════════════════════════════════
```
