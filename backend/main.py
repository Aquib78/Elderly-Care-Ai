from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.analyze import router as analyze_router
from routes.audio import router as audio_router
from routes.reminder import router as reminder_router  # ✅ ADD THIS

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Backend running"}

# ✅ INCLUDE ROUTERS
app.include_router(analyze_router)
app.include_router(audio_router)
app.include_router(reminder_router)  # 🔥 THIS FIXES 404