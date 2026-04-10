from fastapi import APIRouter, UploadFile, File
from services.ai import simplify_medical_text

router = APIRouter()

@router.post("/analyze-report/")
async def analyze_report(file: UploadFile = File(...)):
    try:
        contents = await file.read()

        text, simplified = simplify_medical_text(contents)

        return {
            "text": text,
            "simplified": simplified
        }

    except Exception as e:
        print("❌ ERROR:", str(e))
        return {"error": str(e)}