from fastapi import APIRouter
from database.mongo import db
from datetime import datetime

router = APIRouter()

@router.post("/add-reminder/")
async def add_reminder(data: dict):
    reminder = {
        "medicine": data["medicine"],
        "time": data["time"],
        "phone": data["phone"],
        "created_at": datetime.utcnow(),
        "status": "pending"
    }

    result = db.reminders.insert_one(reminder)

    return {"message": "Reminder saved", "id": str(result.inserted_id)}