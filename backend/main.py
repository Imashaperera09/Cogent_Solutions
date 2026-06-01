import os
import re
import sys
import logging
from datetime import datetime, timezone
from pathlib import Path

# Fix Unicode output on Windows
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8")

import numpy as np
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import google.generativeai as genai

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s UTC | %(levelname)s | %(message)s",
    datefmt="%Y-%m-%dT%H:%M:%SZ",
)
logger = logging.getLogger("cogent_mcp")

AGENDA_PATH = Path(__file__).parent / "agenda.txt"

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


app = FastAPI(
    title="Cogent Solutions Event API",
    description="RAG-powered personalized invitation backend for the Accelalpha x Oracle Supply Chain Event",
    version="1.0.0",
)

# Define allowed origins for CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Get the frontend URL from an environment variable
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RegistrationRequest(BaseModel):
    name: str
    email: str
    professional_focus: str


class RegistrationResponse(BaseModel):
    matched_session: dict
    email_draft: str
    mcp_triggered: bool


def parse_agenda(path: Path) -> list[dict]:
    text = path.read_text(encoding="utf-8")
    blocks = text.split("---")
    sessions = []

    for block in blocks:
        block = block.strip()
        if not re.search(r"\[SESSION_\d+\]", block):
            continue

        session = {}

        time_m    = re.search(r"Time:\s*(.+)", block)
        title_m   = re.search(r"Title:\s*(.+)", block)
        speaker_m = re.search(r"Speaker:\s*(.+)", block)
        kw_m      = re.search(r"Focus Keywords:\s*(.+)", block)
        desc_m    = re.search(r"Description:\s*([\s\S]+)", block)

        session["time"]        = time_m.group(1).strip()    if time_m    else "TBD"
        session["title"]       = title_m.group(1).strip()   if title_m   else "Unknown Session"
        session["speaker"]     = speaker_m.group(1).strip() if speaker_m else "TBD"
        session["keywords"]    = kw_m.group(1).strip()      if kw_m      else ""
        session["description"] = desc_m.group(1).strip()    if desc_m    else ""

        title_lower = session["title"].lower()
        if "keynote" in title_lower:
            session["type"] = "Keynote"
        elif "panel" in title_lower or "strategies in action" in title_lower:
            session["type"] = "Panel"
        elif "practical guide" in title_lower or "implementation" in title_lower:
            session["type"] = "Workshop"
        elif "coffee" in title_lower or "lunch" in title_lower or "registration" in title_lower:
            session["type"] = "Break"
        elif "q&a" in title_lower or "closing" in title_lower:
            session["type"] = "Closing"
        elif "welcome" in title_lower:
            session["type"] = "Opening"
        else:
            session["type"] = "Session"

        # Weight title and keywords higher in TF-IDF corpus
        session["corpus_text"] = (
            f"{session['title']} {session['title']} "
            f"{session['keywords']} {session['keywords']} "
            f"{session['description']} "
            f"{session['speaker']}"
        )

        sessions.append(session)

    return sessions


SESSIONS = parse_agenda(AGENDA_PATH)
CORPUS   = [s["corpus_text"] for s in SESSIONS]

logger.info(f"Loaded {len(SESSIONS)} sessions from agenda.txt")


def find_best_session(user_query: str) -> dict:
    vectorizer  = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
    all_texts   = CORPUS + [user_query]
    tfidf_mat   = vectorizer.fit_transform(all_texts)

    query_vec    = tfidf_mat[-1]
    session_mat  = tfidf_mat[:-1]
    similarities = cosine_similarity(query_vec, session_mat).flatten()

    skip_types = {"break"}
    ranked = np.argsort(similarities)[::-1]

    for idx in ranked:
        s = SESSIONS[idx]
        if s["type"].lower() not in skip_types:
            return {**s, "match_score": float(similarities[idx])}

    top = int(ranked[0])
    return {**SESSIONS[top], "match_score": float(similarities[top])}


SYSTEM_PROMPT = """You are a professional B2B communications specialist writing exclusive event invitations
for a high-level supply chain and technology conference in Dubai.

STRICT RULES — FOLLOW WITHOUT EXCEPTION:
1. Use ONLY the information explicitly provided in the user message. Do NOT invent any detail.
2. Do NOT fabricate speaker names, titles, session names, times, or topics not present in the context.
3. Do NOT add sessions, agenda items, or facts that are not listed in the provided context.
4. If a piece of information is not available, omit it — never guess or embellish.
5. Write in a professional, warm B2B tone suitable for C-suite executives (CFOs, COOs, Directors).
6. The email must feel personally crafted for the recipient based on their stated professional interest.
7. Keep the email between 200–280 words: concise, impactful, action-oriented.
8. Close with a clear call to action to register for the event.
"""

def build_llm_prompt(name: str, professional_focus: str, session: dict) -> str:
    return f"""Using ONLY the verified information below, write a personalized B2B event invitation email.

=== RECIPIENT ===
Name: {name}
Professional Interest / Challenge: {professional_focus}

=== MATCHED SESSION (use ONLY these facts) ===
Session Title   : {session['title']}
Session Time    : {session['time']}
Session Type    : {session['type']}
Speaker(s)      : {session['speaker']}
Description     : {session['description']}

=== EVENT DETAILS (use ONLY these facts) ===
Event Name : Troubled Waters: Sailing with AI in Supply Chain
Hosted by  : Accelalpha & Oracle
Date       : 13th November 2024
Hours      : 09:30 AM to 01:00 PM
Venue      : Marriott Resort, The Palm, Dubai, UAE

=== TASK ===
Write a professional invitation email that:
1. Opens with a personalized greeting to {name}
2. References their specific challenge: "{professional_focus}"
3. Highlights why "{session['title']}" at {session['time']} directly addresses their challenge
4. Names the speaker(s) by their exact name and title as listed above
5. Mentions the event date, time, and venue
6. Ends with a compelling call to action to register

Output ONLY the email body (no subject line, no extra commentary).
"""


def send_draft_via_mcp(email_address: str, email_body: str) -> None:
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    sep  = "=" * 72
    dash = "-" * 72

    output = (
        f"\n{sep}\n"
        f"  MCP TRIGGER FIRED — send_draft_via_mcp()\n"
        f"{sep}\n"
        f"  RECIPIENT     : {email_address}\n"
        f"  UTC TIMESTAMP : {timestamp}\n"
        f"{dash}\n"
        f"  EMAIL BODY:\n"
        f"{dash}\n"
        f"{email_body}\n"
        f"{sep}\n"
    )

    print(output)
    logger.info(output)


@app.get("/")
async def root():
    return {
        "status": "running",
        "service": "Cogent Solutions Event API",
        "event": "Troubled Waters: Sailing with AI in Supply Chain",
        "sessions_loaded": len(SESSIONS),
    }


@app.get("/api/sessions")
async def get_sessions():
    return [
        {
            "title":       s["title"],
            "time":        s["time"],
            "type":        s["type"],
            "speaker":     s["speaker"],
            "description": s["description"],
        }
        for s in SESSIONS
    ]


@app.post("/api/register", response_model=RegistrationResponse)
async def register(payload: RegistrationRequest):
    if not payload.name.strip():
        raise HTTPException(status_code=422, detail="Name is required.")
    if not payload.professional_focus.strip():
        raise HTTPException(status_code=422, detail="Professional focus is required.")

    logger.info(f"New registration -> {payload.name} <{payload.email}>")
    logger.info(f"Professional focus: {payload.professional_focus}")

    matched = find_best_session(payload.professional_focus)
    logger.info(f"RAG match -> '{matched['title']}' (score: {matched['match_score']:.3f})")

    email_draft = ""

    if not GEMINI_API_KEY:
        email_draft = (
            f"Dear {payload.name},\n\n"
            f"We are delighted to extend an exclusive invitation to you for "
            f'"Troubled Waters: Sailing with AI in Supply Chain", hosted by Accelalpha & Oracle '
            f"on 13th November 2024 at the Marriott Resort, The Palm, Dubai.\n\n"
            f'Given your focus on "{payload.professional_focus}", we believe you will find '
            f"exceptional value in the session:\n\n"
            f"  - {matched['title']} ({matched['time']})\n"
            f"  Speaker: {matched['speaker']}\n\n"
            f"{matched['description']}\n\n"
            f"This event runs from 09:30 AM to 01:00 PM and is designed exclusively for "
            f"senior supply chain leaders.\n\n"
            f"Please register now to secure your complimentary seat.\n\n"
            f"Best regards,\n"
            f"The Accelalpha & Oracle Team"
        )
    else:
        try:
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction=SYSTEM_PROMPT,
            )
            prompt   = build_llm_prompt(payload.name, payload.professional_focus, matched)
            response = model.generate_content(prompt)
            email_draft = response.text.strip()
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            email_draft = (
                f"Dear {payload.name},\n\n"
                f'We are pleased to invite you to "Troubled Waters: Sailing with AI in Supply Chain" '
                f"on 13th November 2024 at the Marriott Resort, The Palm, Dubai.\n\n"
                f'Based on your interest in "{payload.professional_focus}", we recommend the session '
                f'"{matched["title"]}" at {matched["time"]}, featuring {matched["speaker"]}.\n\n'
                f"{matched['description']}\n\n"
                f"Register now to secure your place.\n\n"
                f"Best regards,\nThe Accelalpha & Oracle Team"
            )

    send_draft_via_mcp(payload.email, email_draft)

    return RegistrationResponse(
        matched_session={
            "title":       matched["title"],
            "time":        matched["time"],
            "type":        matched["type"],
            "speaker":     matched["speaker"],
            "description": matched["description"],
            "match_score": round(matched["match_score"], 3),
        },
        email_draft=email_draft,
        mcp_triggered=True,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
