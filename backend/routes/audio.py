from fastapi import APIRouter, UploadFile, File
from database.mongo import db
from datetime import datetime
from bson.binary import Binary
from bson import ObjectId

# ✅ ONE router only — having two overwrites the first
router = APIRouter()


@router.post("/upload-audio/")
async def upload_audio(file: UploadFile = File(...)):
    try:
        print("📩 Received file:", file.filename)

        audio_bytes = await file.read()
        encoded_audio = Binary(audio_bytes)

        filename = file.filename
        file_size = len(audio_bytes)
        file_format = filename.split(".")[-1] if "." in filename else "unknown"

        audio_metadata = {
            "filename": filename,
            "file_url": "in_memory",
            "file_size_bytes": file_size,
            "format": file_format,
            "duration_seconds": 0,
            "uploaded_by": "user_789",
            "tags": ["heartbeat", "raw", "test"],
            "status": "pending_analysis",
            "audioData": encoded_audio,
            "created_at": datetime.utcnow()
        }

        result = db.raw_audio_files.insert_one(audio_metadata)
        print("✅ Stored in DB:", result.inserted_id)

        return {
            "message": "Audio stored in required format",
            "audio_id": str(result.inserted_id)
        }

    except Exception as e:
        print("❌ ERROR:", str(e))
        return {"error": str(e)}


@router.get("/get-audio-result/{audio_id}")
def get_audio_result(audio_id: str):
    try:
        print("🔍 Searching for:", audio_id)

        result = db["result of audio"].find_one({
            "original_audio_id": ObjectId(audio_id)
        })

        if not result:
            print("❌ No result found yet")
            return {"status": "pending", "message": "Result not ready yet"}

        print("✅ Found result:", result)

        return {
            "status": "done",
            "filename": result.get("filename"),
            "disease": result.get("disease"),
            "accuracy": result.get("accuracy"),
        }

    except Exception as e:
        print("❌ ERROR:", str(e))
        return {"error": str(e)}