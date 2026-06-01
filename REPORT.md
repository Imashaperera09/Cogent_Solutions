# Cogent Solutions — Technical Assessment Report

This report outlines the deployment status, local setup instructions, marketing outreach content, and LLM prompt engineering strategy for the Accelalpha × Oracle SCM Conference platform.

---

## 🔗 Live Gateways

* **Live Frontend Website:** [https://cogent-solutions-eta.vercel.app](https://cogent-solutions-eta.vercel.app)
* **Live Backend API Endpoint:** `https://cogent-solutions-backend.onrender.com` *(Please replace this with your actual Render service URL if named differently)*

---

## 💻 Local Setup Guide

Follow these steps to clone the repository and run both the FastAPI backend and Next.js frontend locally.

### 1. Clone the Repository
```bash
git clone https://github.com/Imashaperera09/Cogent_Solutions.git
cd Cogent_Solutions
```

### 2. Backend Local Setup
```bash
# Navigate to backend folder
cd backend

# Create and activate a Python virtual environment
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install Python dependencies
pip install -r requirements.txt

# Configure environment variables
copy .env.example .env
# Open .env and add your GEMINI_API_KEY=your_actual_api_key_here

# Start the FastAPI server
uvicorn main:app --reload --port 8000
```
*The backend local server will run on [http://localhost:8000](http://localhost:8000).*

### 3. Frontend Local Setup
Open a new terminal window at the root of the repository:
```bash
# Navigate to frontend folder
cd frontend

# Install Node dependencies
npm install

# Start the Next.js development server
npm run dev
```
*The frontend development server will run on [http://localhost:3000](http://localhost:3000).*

---

## 📢 Content Creation Check (LinkedIn Promotional Post)

Are you still manually sorting and matching corporate delegates with conference sessions? Our new AI-powered event matching system uses advanced RAG vector analysis to instantly align attendees' SCM challenges with the optimal speakers and sessions. Revolutionize your next corporate event and deliver hyper-personalized VIP invitations automatically by integrating our intelligent MCP pipeline today!

---

## 🧠 Prompt Strategy

To ensure absolute zero hallucination, we implemented a strict anti-hallucination system prompt that enforces several rigid rules: (1) it explicitly limits the model's source of truth to the provided `agenda.txt` context, (2) it forbids the generation of any speaker names, session titles, times, or topics not explicitly present in the input context, (3) it instructs the model to omit details rather than guessing or embellishing if info is missing, and (4) it frames the model's task as a direct mapping exercise where each generated fact is bound to a verified attribute from the matched session. This structured boundary guarantees that all generated invitations remain 100% faithful to the actual event schedule.
