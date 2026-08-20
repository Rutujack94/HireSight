"""
prediction_service.py

Loads the trained Random Forest model + feature configuration and
exposes a predict() function used by the /api/predict route.
"""

import os
import joblib
import pandas as pd

from app.utils.preprocessing import build_feature_dataframe

MODEL_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "model")
MODEL_PATH = os.path.join(MODEL_DIR, "placement_model.pkl")
FEATURE_CONFIG_PATH = os.path.join(MODEL_DIR, "feature_config.pkl")
METRICS_PATH = os.path.join(MODEL_DIR, "metrics.json")


class PredictionService:
    def __init__(self):
        self.model = None
        self.feature_columns = None
        self.skill_columns = None
        self._load_artifacts()

    def _load_artifacts(self):
        if not os.path.exists(MODEL_PATH) or not os.path.exists(FEATURE_CONFIG_PATH):
            # Do not crash the whole app on import; routes will report
            # a clear 503 error instead of a raw stack trace.
            self.model = None
            self.feature_columns = None
            self.skill_columns = None
            return

        self.model = joblib.load(MODEL_PATH)
        feature_config = joblib.load(FEATURE_CONFIG_PATH)
        self.feature_columns = feature_config["feature_columns"]
        self.skill_columns = feature_config["skill_columns"]

    def is_ready(self) -> bool:
        return self.model is not None and self.feature_columns is not None

    def predict(self, student_data):
        if not self.is_ready():
            raise RuntimeError(
                "Prediction model is not loaded. Run train_model.py to "
                "generate model artifacts."
            )

        X = build_feature_dataframe(student_data, self.feature_columns)

        prediction = int(self.model.predict(X)[0])
        probabilities = self.model.predict_proba(X)[0]  # [P(not placed), P(placed)]

        placement_probability = round(float(probabilities[1]) * 100, 1)
        not_placed_probability = round(float(probabilities[0]) * 100, 1)

        return {
            "prediction": prediction,
            "placement_probability": placement_probability,
            "not_placed_probability": not_placed_probability,
        }

    def get_feature_importance(self, top_n: int = 8):
        if not self.is_ready():
            return []

        importances = self.model.feature_importances_
        pairs = list(zip(self.feature_columns, importances))
        pairs.sort(key=lambda x: x[1], reverse=True)
        top = pairs[:top_n]

        total = sum(v for _, v in top) or 1.0
        results = []
        for name, value in top:
            results.append(
                {
                    "feature": _humanize_feature_name(name),
                    "importance": round(float(value), 4),
                    "importance_percent": round(float(value) / total * 100, 1),
                }
            )
        return results

    def load_metrics(self):
        if os.path.exists(METRICS_PATH):
            import json

            with open(METRICS_PATH) as f:
                return json.load(f)
        return None


def _humanize_feature_name(name: str) -> str:
    overrides = {
        "cgpa": "CGPA",
        "tenth_percentage": "10th Percentage",
        "twelfth_percentage": "12th Percentage",
        "backlogs": "Backlogs",
        "internships": "Internships",
        "certifications": "Certifications",
        "communication_score": "Communication Score",
        "aptitude_score": "Aptitude Score",
        "projects": "Projects",
        "coding_score": "Coding Score",
        "attendance": "Attendance",
        "extracurricular": "Extracurricular Activities",
    }
    if name in overrides:
        return overrides[name]
    if name.endswith("_skill"):
        return name.replace("_skill", "").replace("_", " ").title() + " Skill"
    return name.replace("_", " ").title()


# Singleton instance used across the app
prediction_service = PredictionService()
