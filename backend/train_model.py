"""
train_model.py

Trains the Random Forest classifier used by the Student Placement
Prediction System.

Pipeline:
    1. Load data/students.csv
    2. Clean data / handle missing values
    3. Separate features (X) and target (y)
    4. Train/test split (stratified)
    5. Train RandomForestClassifier
    6. Evaluate (accuracy, precision, recall, F1, ROC-AUC, confusion matrix)
    7. Save model.pkl + feature_config.pkl via joblib

Run:
    python train_model.py
"""

import os
import json
import joblib
import numpy as np
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report,
)

DATA_PATH = os.path.join("data", "students.csv")
MODEL_DIR = "model"
MODEL_PATH = os.path.join(MODEL_DIR, "placement_model.pkl")
FEATURE_CONFIG_PATH = os.path.join(MODEL_DIR, "feature_config.pkl")
METRICS_PATH = os.path.join(MODEL_DIR, "metrics.json")

# The exact, ordered list of feature columns the model is trained on.
# This SAME order must be used at prediction time. Stored in feature_config.pkl
# so the backend can never accidentally drift from it.
SKILL_COLUMNS = [
    "python_skill",
    "java_skill",
    "cpp_skill",
    "javascript_skill",
    "react_skill",
    "sql_skill",
    "machine_learning_skill",
    "data_science_skill",
    "django_skill",
    "fastapi_skill",
    "nodejs_skill",
    "git_skill",
    "aws_skill",
    "docker_skill",
]

FEATURE_COLUMNS = [
    "cgpa",
    "tenth_percentage",
    "twelfth_percentage",
    "backlogs",
    "internships",
    "certifications",
    *SKILL_COLUMNS,
    "communication_score",
    "aptitude_score",
    "projects",
    "coding_score",
    "attendance",
    "extracurricular",
]

TARGET_COLUMN = "placed"


def load_and_clean_data(path):
    df = pd.read_csv(path)

    # Drop exact duplicate rows
    df = df.drop_duplicates()

    # Handle missing values: numeric columns -> median imputation
    for col in FEATURE_COLUMNS:
        if df[col].isnull().any():
            df[col] = df[col].fillna(df[col].median())

    # Drop rows with a missing target (can't train on those)
    df = df.dropna(subset=[TARGET_COLUMN])

    return df


def train():
    print("=" * 60)
    print("STUDENT PLACEMENT PREDICTION - MODEL TRAINING")
    print("=" * 60)

    if not os.path.exists(DATA_PATH):
        raise FileNotFoundError(
            f"Dataset not found at {DATA_PATH}. Run generate_dataset.py first."
        )

    df = load_and_clean_data(DATA_PATH)
    print(f"\nLoaded {len(df)} records after cleaning.")

    # NOTE ON DATA LEAKAGE:
    # Only features known BEFORE placement decisions are used. Columns such as
    # "company", "offer_received" or "package" are intentionally NOT present
    # in this dataset / feature list.
    X = df[FEATURE_COLUMNS].copy()
    y = df[TARGET_COLUMN].astype(int)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    print(f"Train size: {len(X_train)} | Test size: {len(X_test)}")

    model = RandomForestClassifier(
        n_estimators=200,
        random_state=42,
        class_weight="balanced",
    )

    model.fit(X_train, y_train)

    # ---- Evaluation ----
    y_pred = model.predict(X_test)
    y_proba = model.predict_proba(X_test)[:, 1]

    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred, zero_division=0)
    recall = recall_score(y_test, y_pred, zero_division=0)
    f1 = f1_score(y_test, y_pred, zero_division=0)
    roc_auc = roc_auc_score(y_test, y_proba)
    cm = confusion_matrix(y_test, y_pred)

    print("\n" + "-" * 60)
    print("MODEL EVALUATION (on held-out test set)")
    print("-" * 60)
    print(f"Accuracy : {accuracy:.4f}")
    print(f"Precision: {precision:.4f}")
    print(f"Recall   : {recall:.4f}")
    print(f"F1 Score : {f1:.4f}")
    print(f"ROC-AUC  : {roc_auc:.4f}")
    print("\nConfusion Matrix:")
    print(cm)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, zero_division=0))

    # ---- Feature importance ----
    importances = pd.Series(model.feature_importances_, index=FEATURE_COLUMNS)
    importances = importances.sort_values(ascending=False)
    print("Top 10 Feature Importances:")
    print(importances.head(10))

    # ---- Save artifacts ----
    os.makedirs(MODEL_DIR, exist_ok=True)
    joblib.dump(model, MODEL_PATH)

    feature_config = {
        "feature_columns": FEATURE_COLUMNS,
        "skill_columns": SKILL_COLUMNS,
        "target_column": TARGET_COLUMN,
    }
    joblib.dump(feature_config, FEATURE_CONFIG_PATH)

    metrics = {
        "accuracy": round(float(accuracy), 4),
        "precision": round(float(precision), 4),
        "recall": round(float(recall), 4),
        "f1_score": round(float(f1), 4),
        "roc_auc": round(float(roc_auc), 4),
        "confusion_matrix": cm.tolist(),
        "train_size": len(X_train),
        "test_size": len(X_test),
        "feature_importances": {
            k: round(float(v), 4) for k, v in importances.items()
        },
        "note": (
            "Metrics computed on a held-out test split of a SYNTHETIC / DEMO "
            "dataset. These numbers describe how well the model fits this "
            "synthetic data and are not a claim about real-world accuracy."
        ),
    }
    with open(METRICS_PATH, "w") as f:
        json.dump(metrics, f, indent=2)

    print(f"\nSaved model            -> {MODEL_PATH}")
    print(f"Saved feature config    -> {FEATURE_CONFIG_PATH}")
    print(f"Saved metrics           -> {METRICS_PATH}")
    print("\nDone.")


if __name__ == "__main__":
    train()
