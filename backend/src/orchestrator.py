import uuid
import json
import os
import tempfile
from typing import Dict, Any, List
import asyncio
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import glob

from resume_agent import extract_text_from_pdf

app = FastAPI()

# Enable CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CandidateInfo(BaseModel):
    name: str
    College: str
    Tech_skills: List[str]
    Soft_skills: List[str]
    CGPA: str = "N/A"
    score: int

class OrchestratorResponse(BaseModel):
    candidate_info: CandidateInfo
    onboarding_plan: str
    policy_answers: Dict[str, str]

def save_resume_text(resume_text: str) -> str:
    """Save extracted resume text to read_pdfs folder with auto-incrementing filename."""
    read_pdfs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../read_pdfs"))
    
    # Create directory if it doesn't exist
    os.makedirs(read_pdfs_dir, exist_ok=True)
    
    # Find the next available file number
    existing_files = glob.glob(os.path.join(read_pdfs_dir, "resume_text_*.txt"))
    if existing_files:
        # Extract numbers from filenames and find the max
        numbers = []
        for file in existing_files:
            try:
                num = int(os.path.basename(file).replace("resume_text_", "").replace(".txt", ""))
                numbers.append(num)
            except ValueError:
                continue
        next_num = max(numbers) + 1 if numbers else 1
    else:
        next_num = 1
    
    # Save the file
    filename = f"resume_text_{next_num}.txt"
    filepath = os.path.join(read_pdfs_dir, filename)
    
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(resume_text)
    
    return filename

@app.post("/orchestrate", response_model=OrchestratorResponse)
async def orchestrate_workflow(
    pdf_file: UploadFile = File(...),
    job_role: str = Form(...),
    policy_questions: str = Form("[]"),
):
    session_id = str(uuid.uuid4())
    memory = {"policy": []}

    temp_path = None
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as temp_file:
            temp_file.write(await pdf_file.read())
            temp_path = temp_file.name

        resume_text = extract_text_from_pdf(temp_path)
        saved_filename = save_resume_text(resume_text)
    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, port=9000)
