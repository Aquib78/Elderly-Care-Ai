from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.audio import router as audio_router
from routes.audio_result import router as audio_result_router
from routes.reminder import router as reminder_router




app = FastAPI()
app.include_router(audio_result_router)
app.include_router(reminder_router)

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

app.include_router(audio_router)