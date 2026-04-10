from fastapi import APIRouter
from database.mongo import db
from datetime import datetime

router = APIRouter()

@router.post("/users")
def create_user(user: dict):
    user["created_at"] = datetime.utcnow()
    result = db.users.insert_one(user)
    return {"id": str(result.inserted_id)}