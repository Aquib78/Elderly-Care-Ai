from fastapi import FastAPI
from routes.user import router as user_router
from routes.reports import router as report_router

app = FastAPI()

app.include_router(user_router)
app.include_router(report_router)