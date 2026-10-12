# Semester V RAG Chatbot — Backend

Full-stack RAG chatbot for Electronics & Telecommunications Engineering, Semester V.

## Structure

```
semester_v_rag/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app + /api/chat (streaming) + /api/modules
│   │   ├── rag_engine.py    # LangChain chunking + ChromaDB retrieval + Gemini generation
│   │   ├── config.py        # Settings from .env
│   │   └── knowledge_base/  # 7 module Markdown files
│   ├── requirements.txt
│   └── .env                 # GEMINI_API_KEY, CHROMA_PERSIST_DIR, ...
└── frontend/                # React (Vite) + Tailwind Gemini-style UI
```

## Backend setup

```powershell
cd semester_v_rag/backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
# Edit .env and set GEMINI_API_KEY (from https://aistudio.google.com/app/apikey)
# Optional: pre-build the Chroma index
python -c "from app.rag_engine import get_engine; get_engine().ingest(force=True); print('ingested')"
uvicorn app.main:app --reload --port 8000
```

API:
- `GET  /api/health` → `{ status, gemini_configured, modules }`
- `GET  /api/modules` → list of 7 modules
- `POST /api/chat` → `{ prompt: string, module: string ("all" or module id) }`
  - Streams `text/event-stream` chunks: `data: {"token": "..."}` … `data: [DONE]`
- `POST /api/chat-sync` → same but returns full JSON `{ answer, sources }` (easy for testing / non-streaming clients)

Without a `GEMINI_API_KEY` the backend runs in **extractive fallback mode**
(returns the top retrieved passages formatted with tables/formulas) so the UI still works.

## Frontend setup

```powershell
cd semester_v_rag/frontend
npm install
npm run dev
# open http://localhost:5173 (expects backend at http://localhost:8000)
```

## Knowledge base modules

| ID | Code | Title |
|----|------|-------|
| dsp | COU 07506 | Digital Signal Processing |
| electromagnetics | ETU 07522 | Engineering Electromagnetics |
| electronic_design | ETU 07521 | Electronic Design and Fabrication |
| industrial_training | ETU 07523 | Industrial Practical Training |
| business_management | GSU 07512 | Business Management in ICT |
| probability_statistics | GSU 07504 | Probability and Statistics |
| cybersecurity_web | COU 07503 / COU 07501 | Web App Dev / Cybersecurity |

Rich-output contract: the LLM system prompt instructs Markdown tables,
LaTeX (`$…$`, `$$…$$`), fenced code blocks, and Mermaid (` ```mermaid `) where applicable.
The frontend renders all four (KaTeX + Mermaid + GFM tables + code highlighting styles).
