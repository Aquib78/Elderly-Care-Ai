from fastapi import APIRouter
from database.mongo import db
from bson import ObjectId
import pytesseract
from PIL import Image
from pdf2image import convert_from_path
from services.ai import simplify_medical_text
import os

router = APIRouter()

# Set Tesseract path (adjust if needed)
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"


@router.post("/analyze-report/{report_id}")
def analyze_report(report_id: str):
    print("[INFO] ANALYZE API HIT")

    try:
        # 🔍 Fetch report from DB
        report = db.reports.find_one({"_id": ObjectId(report_id)})

        if not report:
            return {"error": "Report not found"}

        file_path = report["file_path"]

        if not os.path.exists(file_path):
            return {"error": "File not found"}

        extracted_text = ""

        # =========================
        # 📄 HANDLE PDF
        # =========================
        if file_path.lower().endswith(".pdf"):
            print("[INFO] Processing PDF...")

            images = convert_from_path(
                file_path,
                poppler_path=r"D:\poppler\poppler-25.12.0\Library\bin"
            )

            for i, img in enumerate(images):
                print(f"Processing page {i+1}")
                text = pytesseract.image_to_string(img)
                extracted_text += text + "\n"

        # =========================
        # 🖼️ HANDLE IMAGE
        # =========================
        elif file_path.lower().endswith((".png", ".jpg", ".jpeg")):
            print("[INFO] Processing Image...")
            image = Image.open(file_path)
            extracted_text = pytesseract.image_to_string(image)

        else:
            return {"error": "Unsupported file type"}

        # =========================
        # 🧠 AI SIMPLIFICATION
        # =========================
        print("[INFO] Simplifying text with AI...")
        print(f"[DEBUG] Extracted text length: {len(extracted_text)} chars")
        print(f"[DEBUG] Extracted text preview: {extracted_text[:200]}")
        simplified_text = simplify_medical_text(extracted_text)
        print(f"[DEBUG] Simplified text preview: {simplified_text[:200]}")
        print("[DEBUG] Calling GPT...")

        # =========================
        # 💾 UPDATE DATABASE
        # =========================
        db.reports.update_one(
            {"_id": ObjectId(report_id)},
            {
                "$set": {
                    "raw_text": extracted_text,
                    "simplified_text": simplified_text,
                    "status": "completed"
                }
            }
        )

        return {
            "message": "Analysis complete",
            "raw_text_length": len(extracted_text),
            "simplified_text": simplified_text
        }

    except Exception as e:
        return {"error": str(e)}