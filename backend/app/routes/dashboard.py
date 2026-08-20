"""
routes/dashboard.py

GET /api/dashboard/stats
GET /api/dashboard/analysis

Stats are computed from the (synthetic/demo) training dataset,
data/students.csv. If the dataset is unavailable, sensible demo
fallback numbers are used instead of crashing the endpoint.
"""

import os
import pandas as pd
from fastapi import APIRouter

from app.services.prediction_service import prediction_service

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])

DATA_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "students.csv"
)

_df_cache = None


def _load_dataset():
    global _df_cache
    if _df_cache is not None:
        return _df_cache
    if os.path.exists(DATA_PATH):
        _df_cache = pd.read_csv(DATA_PATH)
    else:
        _df_cache = None
    return _df_cache


@router.get("/stats")
async def dashboard_stats():
    df = _load_dataset()

    if df is None:
        # Fallback demo numbers if dataset isn't present on this deployment
        return {
            "total_students_analyzed": 900,
            "placement_rate": 52.6,
            "average_cgpa": 7.5,
            "average_placement_probability": 55.2,
            "is_demo_data": True,
        }

    return {
        "total_students_analyzed": int(len(df)),
        "placement_rate": round(float(df["placed"].mean()) * 100, 1),
        "average_cgpa": round(float(df["cgpa"].mean()), 2),
        "average_placement_probability": round(float(df["placed"].mean()) * 100, 1),
        "is_demo_data": True,
    }


@router.get("/analysis")
async def dashboard_analysis():
    df = _load_dataset()
    metrics = prediction_service.load_metrics()

    if df is None:
        return {
            "placed_vs_not_placed": {"placed": 470, "not_placed": 430},
            "avg_cgpa_by_placement": {"placed": 7.9, "not_placed": 7.1},
            "coding_score_by_placement": {"placed": 74.0, "not_placed": 55.0},
            "internships_by_placement": [],
            "attendance_by_placement": {"placed": 88.0, "not_placed": 82.0},
            "model_metrics": metrics,
            "is_demo_data": True,
        }

    placed_df = df[df["placed"] == 1]
    not_placed_df = df[df["placed"] == 0]

    internships_grouped = (
        df.groupby(["internships", "placed"]).size().reset_index(name="count")
    )
    internships_by_placement = internships_grouped.to_dict(orient="records")

    return {
        "placed_vs_not_placed": {
            "placed": int(len(placed_df)),
            "not_placed": int(len(not_placed_df)),
        },
        "avg_cgpa_by_placement": {
            "placed": round(float(placed_df["cgpa"].mean()), 2),
            "not_placed": round(float(not_placed_df["cgpa"].mean()), 2),
        },
        "coding_score_by_placement": {
            "placed": round(float(placed_df["coding_score"].mean()), 1),
            "not_placed": round(float(not_placed_df["coding_score"].mean()), 1),
        },
        "internships_by_placement": internships_by_placement,
        "attendance_by_placement": {
            "placed": round(float(placed_df["attendance"].mean()), 1),
            "not_placed": round(float(not_placed_df["attendance"].mean()), 1),
        },
        "model_metrics": metrics,
        "is_demo_data": True,
    }
