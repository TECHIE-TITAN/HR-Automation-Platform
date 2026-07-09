
import uuid
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List, Dict
import json
import requests
import os
from dotenv import load_dotenv
from pathlib import Path


policy_documents_path = Path(__file__).resolve().parent / "data" / "policy_documents.json"
with open(policy_documents_path, encoding="utf-8") as f:
    POLICY_DOCS = json.load(f)

app = FastAPI()
SESSIONS: Dict[str, List[Dict]] = {}

class QARequest(BaseModel):
    session_id: str = None
    questions: List[str]

class QAResponse(BaseModel):
    session_id: str
    answers: List[str]
    memory: List[Dict]
    retrieved_contexts: List[List[str]]

def retrieve_context(question: str, top_k: int = 3) -> List[str]:
    scores = []
    q_words = set(question.lower().split())
    for doc in POLICY_DOCS:
        doc_words = set(doc["text"].lower().split())
        score = len(q_words & doc_words)
        scores.append((score, doc["text"]))
    scores.sort(reverse=True)
    return [text for score, text in scores[:top_k] if score > 0]

def build_prompt(question: str, context: List[str], memory: List[Dict], role: str = "employee") -> str:
    prompt = (
        f"You are a helpful HR assistant answering as a {role}.\n"
        "Use the following policy context to answer the user's question as accurately as possible.\n"
        f"Policy Context:\n{chr(10).join(context) if context else 'N/A'}\n"
        "Conversation History:\n"
        + "\n".join([f"Q: {m['question']} A: {m['answer']}" for m in memory])
        + f"\nUser Question: {question}\n"
        "Answer:"
    )
    return prompt
