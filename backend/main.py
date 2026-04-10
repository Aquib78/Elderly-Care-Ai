from fastapi import FastAPI
from routes.user import router as user_router
from routes.reports import router as report_router
from routes.analyze import router as analyze_router

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Elderly Care AI Backend is running!"}

app.include_router(user_router)
app.include_router(report_router)
app.include_router(analyze_router)