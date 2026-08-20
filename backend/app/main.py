"""
main.py

FastAPI application entrypoint for the Student Placement Prediction System.
"""

import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.routes import prediction, dashboard
from app.services.prediction_service import prediction_service
from app.schemas import HealthResponse

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

app = FastAPI(
    title="Student Placement Prediction API",
    description=(
        "ML-powered API that predicts a student's likelihood of placement "
        "using a Random Forest model trained on a synthetic/demo dataset."
    ),
    version="1.0.0",
)

# CORS configuration - allowed origin(s) configurable via FRONTEND_URL env var
allowed_origins = [FRONTEND_URL]
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    # Ensure no raw Python stack traces ever reach the client
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected server error occurred. Please try again later."},
    )


@app.get("/")
async def root():
    return {"message": "Student Placement Prediction API is running"}


@app.get("/api/health", response_model=HealthResponse)
async def health_check():
    return HealthResponse(status="ok", model_loaded=prediction_service.is_ready())


app.include_router(prediction.router)
app.include_router(dashboard.router)
