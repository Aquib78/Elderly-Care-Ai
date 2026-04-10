from fastapi import APIRouter
from database.mongo import db
from bson import ObjectId

router = APIRouter()


@router.get("/get-audio-result/{audio_id}")
def get_audio_result(audio_id: str):
    try:
        print("🔍 Searching for:", audio_id)

        result = db["result of audio"].find_one({
            "original_audio_id": ObjectId(audio_id)
        })

        if not result:
            print("❌ No result found")
            return {"message": "Result not found yet"}

        print("✅ Found result:", result)

        return {
            "filename": result.get("filename"),
            "disease": result.get("disease"),
            "accuracy": result.get("accuracy")
        }

    except Exception as e:
        print("❌ ERROR:", str(e))
        return {"error": str(e)}