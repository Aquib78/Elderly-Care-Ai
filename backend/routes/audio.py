from fastapi import APIRouter, UploadFile, File
from database.mongo import db
from datetime import datetime
from bson.binary import Binary   # ✅ IMPORTANT

router = APIRouter()


@router.post("/upload-audio/")
async def upload_audio(file: UploadFile = File(...)):
    try:
        print("📩 Received file:", file.filename)

        # ✅ Read file bytes
        audio_bytes = await file.read()

        # ✅ Convert to MongoDB Binary
        encoded_audio = Binary(audio_bytes)

        # ✅ Extract file info
        filename = file.filename
        file_size = len(audio_bytes)

        file_format = filename.split(".")[-1] if "." in filename else "unknown"

        duration_seconds = 0  # placeholder

        # ✅ YOUR REQUIRED STRUCTURE
        audio_metadata = {
            "filename": filename,
            "file_url": "in_memory",
            "file_size_bytes": file_size,
            "format": file_format,
            "duration_seconds": duration_seconds,
            "uploaded_by": "user_789",
            "tags": ["heartbeat", "raw", "test"],
            "status": "pending_analysis",
            "audioData": encoded_audio,   # 🔥 REAL BINARY
            "created_at": datetime.utcnow()
        }

        # ✅ Insert into MongoDB
        result = db.raw_audio_files.insert_one(audio_metadata)

        print("✅ Stored in DB:", result.inserted_id)

        return {
            "message": "Audio stored in required format",
            "audio_id": str(result.inserted_id)
        }

    except Exception as e:
        print("❌ ERROR:", str(e))
        return {"error": str(e)}