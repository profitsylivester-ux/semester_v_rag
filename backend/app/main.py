"""FastAPI app: /api/chat (SSE stream) + /api/chat-sync + /api/modules + /api/health."""
from __future__ import annotations
import asyncio, json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from .rag_engine import MODULES, get_engine
from .config import settings
app = FastAPI(title="Semester V RAG Chatbot", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])
class ChatRequest(BaseModel):
    prompt: str = Field(..., min_length=1, max_length=4000)
    module: str = Field(default="all")
@app.get("/api/health")
def health():
    key = settings.GEMINI_API_KEY
    return {"status": "ok", "gemini_configured": bool(key and key != "your-gemini-api-key-here"), "modules": list(MODULES.keys())}
@app.get("/api/modules")
def modules():
    return [{"id": k, **v} for k, v in MODULES.items()]
@app.post("/api/chat-sync")
def chat_sync(req: ChatRequest):
    engine = get_engine()
    text, sources = engine.answer(req.prompt, req.module if req.module in MODULES else "all")
    return {"answer": text, "sources": sources}
@app.post("/api/chat")
async def chat(req: ChatRequest):
    engine = get_engine()
    module = req.module if req.module in MODULES else "all"
    async def gen():
        async for chunk in engine.answer_stream(req.prompt, module):
            yield f"data: {json.dumps({'token': chunk})}\n\n"
            await asyncio.sleep(0)
        yield "data: [DONE]\n\n"
    return StreamingResponse(gen(), media_type="text/event-stream")
@app.post("/api/reindex")
def reindex():
    n = get_engine().ingest(force=True)
    return {"chunks": n}
