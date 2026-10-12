import os
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).resolve().parent.parent / ".env")

class Settings:
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    CHROMA_PERSIST_DIR: str = os.getenv("CHROMA_PERSIST_DIR", "./chroma_db")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "all-MiniLM-L6-v2")
    CHUNK_SIZE: int = int(os.getenv("CHUNK_SIZE", "1000"))
    CHUNK_OVERLAP: int = int(os.getenv("CHUNK_OVERLAP", "200"))
    TOP_K: int = int(os.getenv("TOP_K", "5"))
    KNOWLEDGE_BASE_DIR: str = str(Path(__file__).resolve().parent / "knowledge_base")

settings = Settings()
