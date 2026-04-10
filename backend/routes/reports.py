from fastapi import APIRouter, UploadFile, File
from database.mongo import db
from datetime import datetime
import shutil
import os

router = APIRouter()

UPLOAD_DIR = "uploads"

@router.post("/upload-report")
async def upload_report(file: UploadFile = File(...)):
    # Ensure uploads folder exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Store in DB
    report_data = {
        "file_name": file.filename,
        "file_path": file_path,
        "status": "uploaded",
        "created_at": datetime.utcnow()
    }

    result = db.reports.insert_one(report_data)

    return {
        "message": "Report uploaded successfully",
        "report_id": str(result.inserted_id)
    }