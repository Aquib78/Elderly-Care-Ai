from database.mongo import MONGO_URL
from database.mongo import db

print("mongo = ", MONGO_URL)

try:
    collections = db.list_collection_names()
    print("✅ Connected to MongoDB Atlas!")
    print("Collections:", collections)
except Exception as e:
    print("❌ Connection failed:", e)