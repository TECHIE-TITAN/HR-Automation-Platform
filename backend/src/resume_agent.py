from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import HTMLResponse
import uvicorn
import os
import requests
import json
import pdfplumber
import pytesseract
from PIL import Image
import re
import google.generativeai as genai
import ast
import shutil
from pymongo import MongoClient
import urllib.parse
from dotenv import load_dotenv
from pathlib import Path

app = FastAPI()

HTML_FORM = """
<html>
    <body>
        <h2>Upload Resume PDF</h2>
        <form action="/upload_resume/" enctype="multipart/form-data" method="post">
            <input name="pdf_file" type="file" accept=".pdf"/>
            <input type="submit"/>
        </form>
    </body>
</html>
"""

JOB_ROLE_FORM = """
<html>
    <body>
        <h2>Enter Desired Job Role</h2>
        <form action="/analyze_resume/" method="post">
            <input name="job_role" type="text" placeholder="Job Role"/>
            <input type="submit"/>
        </form>
    </body>
</html>
"""

READ_PDFS_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../read_pdfs"))

def extract_text_from_pdf(pdf_path):
    text = ""
    tesseract_available = shutil.which("tesseract") is not None
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            page_text = page.extract_text() or ""
            ocr_text = ""
            if tesseract_available:
                img = page.to_image(resolution=200).original.convert("L")
                img = img.point(lambda x: 0 if x < 180 else 255, '1')
                try:
                    ocr_text = pytesseract.image_to_string(img)
                except pytesseract.TesseractNotFoundError:
                    ocr_text = ""
            combined = page_text + "\n" + ocr_text
            text += combined
    return text

@app.post("/upload_resume/", response_class=HTMLResponse)
async def upload_resume(pdf_file: UploadFile = File(...)):
    # Save PDF and extract text
    pdf_path = f"temp_{pdf_file.filename}"
    with open(pdf_path, "wb") as f:
        f.write(await pdf_file.read())
    resume_text = extract_text_from_pdf(pdf_path)
    os.remove(pdf_path)

    # Store extracted text in numbered .txt file
    os.makedirs(READ_PDFS_PATH, exist_ok=True)
    existing_files = [f for f in os.listdir(READ_PDFS_PATH) if f.startswith("resume_text_") and f.endswith(".txt")]
    next_num = len(existing_files) + 1
    output_path = os.path.join(READ_PDFS_PATH, f"resume_text_{next_num}.txt")
    with open(output_path, "w", encoding="utf-8") as f2:
        f2.write(resume_text)

    # After upload, ask for job role
    html = JOB_ROLE_FORM
    return HTMLResponse(content=html)