from fastapi import APIRouter, UploadFile, File
from fastapi.responses import FileResponse
from database.mongo import db
from datetime import datetime
from bson import ObjectId
import shutil
import os
import uuid

router = APIRouter()

# Use absolute path (IMPORTANT)
UPLOAD_DIR = os.path.abspath("uploads")

@router.post("/upload-report")
async def upload_report(file: UploadFile = File(...)):
    # Ensure upload directory exists
    os.makedirs(UPLOAD_DIR, exist_ok=True)

    # Generate unique filename (avoid overwrite)
    unique_filename = f"{uuid.uuid4()}_{file.filename}"

    file_path = os.path.join(UPLOAD_DIR, unique_filename)

    # Save file
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Store metadata in DB
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


# =========================
# 📥 GET SINGLE REPORT (DOWNLOAD/VIEW)
# =========================
@router.get("/get-report/{report_id}")
def get_report(report_id: str):
    try:
        report = db.reports.find_one({"_id": ObjectId(report_id)})

        if not report:
            return {"error": "Report not found"}

        file_path = report["file_path"]

        if not os.path.exists(file_path):
            return {"error": "File missing on server"}

        return FileResponse(
            path=file_path,
            filename=report["file_name"],
            media_type="application/octet-stream"
        )

    except Exception as e:
        return {"error": str(e)}


@router.get("/reports")
def get_all_reports():
    try:
        reports = list(db.reports.find())

        for r in reports:
            r["_id"] = str(r["_id"])

        return reports

    except Exception as e:
        return {"error": str(e)}