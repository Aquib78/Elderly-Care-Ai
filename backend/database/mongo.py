import os
import certifi
from pymongo import MongoClient
from dotenv import load_dotenv

current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(current_dir)
load_dotenv(os.path.join(root_dir, ".env"))

MONGO_URL = os.getenv("MONGO_URL")

client = MongoClient(MONGO_URL, tlsCAFile=certifi.where())

db = client["elderly_care"]