from fastapi import APIRouter
import json, os
from uuid import uuid4

router = APIRouter()
FILE = "reminders.json"

def load_data():
    if not os.path.exists(FILE):
        return []
    with open(FILE, "r") as f:
        return json.load(f)

def save_data(data):
    with open(FILE, "w") as f:
        json.dump(data, f, indent=4)

@router.post("/add-reminder/")
async def add_reminder(data: dict):
    reminders = load_data()

    new = {
        "id": str(uuid4()),
        "medicine": data["medicine"],
        "time": data["time"],
        "phone": data["phone"]
    }

    reminders.append(new)
    save_data(reminders)

    print("✅ Saved:", new)

    return {"message": "Saved"}

@router.get("/get-reminders/")
async def get_reminders():
    return load_data()

@router.delete("/delete-reminder/{id}")
async def delete_reminder(id: str):
    reminders = load_data()
    reminders = [r for r in reminders if r["id"] != id]
    save_data(reminders)
    return {"message": "Deleted"}