"""RAG engine: load .md knowledge base, chunk, embed with ChromaDB, retrieve + generate."""
from __future__ import annotations
import re
from pathlib import Path
from typing import Dict, List, Optional
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from .config import settings
MODULES: Dict[str, Dict[str, str]] = {
    "dsp": {"code": "COU 07506", "title": "Digital Signal Processing", "file": "dsp.md"},
    "electromagnetics": {"code": "ETU 07522", "title": "Engineering Electromagnetics", "file": "electromagnetics.md"},
    "electronic_design": {"code": "ETU 07521", "title": "Electronic Design and Fabrication", "file": "electronic_design.md"},
    "industrial_training": {"code": "ETU 07523", "title": "Industrial Practical Training", "file": "industrial_training.md"},
    "business_management": {"code": "GSU 07512", "title": "Business Management in ICT", "file": "business_management.md"},
    "probability_statistics": {"code": "GSU 07504", "title": "Probability and Statistics", "file": "probability_statistics.md"},
    "cybersecurity_web": {"code": "COU 07503 / COU 07501", "title": "Web App Dev / Cybersecurity", "file": "cybersecurity_web.md"},
}
SYSTEM_PROMPT = """You are 'Semester V', a study assistant for Electronics & Telecommunications Engineering students.
Answer ONLY from the provided context passages when they contain the answer; otherwise use your own engineering knowledge but stay on-topic for Semester V modules.
RICH OUTPUT CONTRACT - always follow:
- Use GitHub-flavoured Markdown: headings, bullet lists, numbered steps, bold key terms.
- Use Markdown tables for comparisons, pin lists, registers, parameters, summaries.
- Use LaTeX for ALL maths: inline $...$ and display $$...$$ (KaTeX available in UI).
- Use fenced code blocks with language tag for code, MATLAB, assembly, CLI, configs.
- Use a mermaid block for flows, architectures, state machines, signal chains (flowchart, sequenceDiagram, stateDiagram-v2 only).
- End quantitative answers with a short 'Check / Try it' line.
- Cite source module code (e.g. [COU 07506]) after factual claims.
"""
def _build_prompt(question: str, contexts: List[str]) -> str:
    ctx = "\n\n---\n\n".join(contexts) if contexts else "(no retrieved context)"
    return (f"{SYSTEM_PROMPT}\n\nCONTEXT PASSAGES:\n{ctx}\n\nSTUDENT QUESTION: {question}\n\nAnswer with Markdown + LaTeX + tables + mermaid/code where applicable.")
class RagEngine:
    def __init__(self) -> None:
        self._embeddings: Optional[HuggingFaceEmbeddings] = None
        self._db: Optional[Chroma] = None
    def _get_embeddings(self) -> HuggingFaceEmbeddings:
        if self._embeddings is None:
            self._embeddings = HuggingFaceEmbeddings(model_name=settings.EMBEDDING_MODEL)
        return self._embeddings
    def _get_db(self) -> Chroma:
        if self._db is None:
            self._db = Chroma(persist_directory=settings.CHROMA_PERSIST_DIR, embedding_function=self._get_embeddings(), collection_name="semester_v")
        return self._db
    def _load_documents(self, module_filter: Optional[str] = None):
        from langchain_core.documents import Document
        kb = Path(settings.KNOWLEDGE_BASE_DIR)
        docs = []
        for mod_id, meta in MODULES.items():
            if module_filter and module_filter != "all" and mod_id != module_filter:
                continue
            f = kb / meta["file"]
            if not f.exists():
                continue
            text = f.read_text(encoding="utf-8")
            parts = re.split(r"(?m)^#{1,3}\s+", text)
            for part in parts:
                part = part.strip()
                if len(part) < 80:
                    continue
                docs.append(Document(page_content=part[:6000], metadata={"module": mod_id, "code": meta["code"], "title": meta["title"], "source": meta["file"]}))
        splitter = RecursiveCharacterTextSplitter(chunk_size=settings.CHUNK_SIZE, chunk_overlap=settings.CHUNK_OVERLAP)
        return splitter.split_documents(docs)
    def ingest(self, force: bool = False, module_filter: Optional[str] = None) -> int:
        import shutil
        if force and Path(settings.CHROMA_PERSIST_DIR).exists():
            shutil.rmtree(settings.CHROMA_PERSIST_DIR, ignore_errors=True)
            self._db = None
        chunks = self._load_documents(module_filter)
        if not chunks:
            return 0
        db = self._get_db()
        try:
            db.delete_collection()
        except Exception:
            pass
        self._db = None
        db = self._get_db()
        db.add_documents(chunks)
        try:
            db.persist()
        except Exception:
            pass
        return len(chunks)
    def ensure_ingested(self) -> None:
        try:
            db = self._get_db()
            if db._collection.count() == 0:
                self.ingest(force=False)
        except Exception:
            try:
                self.ingest(force=False)
            except Exception:
                pass
    def retrieve(self, query: str, module: str = "all", k: Optional[int] = None):
        self.ensure_ingested()
        k = k or settings.TOP_K
        db = self._get_db()
        if module and module != "all":
            return db.similarity_search(query, k=k, filter={"module": module})
        return db.similarity_search(query, k=k)
    def _gemini_available(self) -> bool:
        return bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY != "your-gemini-api-key-here")
    def _generate_with_gemini(self, prompt: str) -> str:
        from langchain_google_genai import ChatGoogleGenerativeAI
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", google_api_key=settings.GEMINI_API_KEY, temperature=0.3)
        return llm.invoke(prompt).content
    def _extractive_fallback(self, question: str, docs) -> str:
        if not docs:
            return ("I could not find that in the Semester V knowledge base. Try selecting a specific module or rephrasing (e.g. 'Explain FIR vs IIR with a table').")
        lines = [f"## Answer (knowledge-base extract, {len(docs)} passages)\n"]
        for i, d in enumerate(docs, 1):
            meta = d.metadata or {}
            lines.append(f"### {i}. [{meta.get('code','')}] `{meta.get('source','')}`\n\n{d.page_content.strip()[:1200]}\n")
        lines.append("\n> Tip: add your `GEMINI_API_KEY` in `backend/.env` for full generative answers with LaTeX, tables and Mermaid.")
        return "\n".join(lines)
    def answer(self, question: str, module: str = "all"):
        docs = self.retrieve(question, module=module)
        contexts = [d.page_content for d in docs]
        sources = [{"module": (d.metadata or {}).get("module"), "code": (d.metadata or {}).get("code"), "title": (d.metadata or {}).get("title"), "source": (d.metadata or {}).get("source")} for d in docs]
        if self._gemini_available():
            try:
                return self._generate_with_gemini(_build_prompt(question, contexts)), sources
            except Exception as exc:
                return self._extractive_fallback(question, docs) + f"\n\n*Generator note: {exc}*", sources
        return self._extractive_fallback(question, docs), sources
    async def answer_stream(self, question: str, module: str = "all"):
        text, _ = self.answer(question, module)
        for word in text.split(" "):
            yield word + " "
_engine = None
def get_engine() -> "RagEngine":
    global _engine
    if _engine is None:
        _engine = RagEngine()
    return _engine

