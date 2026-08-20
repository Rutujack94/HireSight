"""
preprocessing.py

Converts incoming StudentData (as sent by the frontend) into the exact
numeric feature vector the Random Forest model expects, in the exact
column order used during training (loaded from feature_config.pkl).
"""

from typing import List
import pandas as pd

# Maps the human-readable skill labels shown in the UI to the
# corresponding binary feature column used by the model.
SKILL_LABEL_TO_COLUMN = {
    "Python": "python_skill",
    "Java": "java_skill",
    "C++": "cpp_skill",
    "JavaScript": "javascript_skill",
    "React": "react_skill",
    "SQL": "sql_skill",
    "Machine Learning": "machine_learning_skill",
    "Data Science": "data_science_skill",
    "Django": "django_skill",
    "FastAPI": "fastapi_skill",
    "Node.js": "nodejs_skill",
    "Git/GitHub": "git_skill",
    "AWS": "aws_skill",
    "Docker": "docker_skill",
}


def skills_to_features(selected_skills: List[str]) -> dict:
    """Convert a list of selected skill labels into a dict of binary features."""
    features = {col: 0 for col in SKILL_LABEL_TO_COLUMN.values()}
    for skill in selected_skills:
        col = SKILL_LABEL_TO_COLUMN.get(skill)
        if col:
            features[col] = 1
    return features


def build_feature_dataframe(student_data, feature_columns: List[str]) -> pd.DataFrame:
    """
    Build a single-row DataFrame with columns in the EXACT order the model
    was trained on (feature_columns, loaded from feature_config.pkl).
    """
    skill_features = skills_to_features(student_data.technical_skills)

    row = {
        "cgpa": student_data.cgpa,
        "tenth_percentage": student_data.tenth_percentage,
        "twelfth_percentage": student_data.twelfth_percentage,
        "backlogs": student_data.backlogs,
        "internships": student_data.internships,
        "certifications": student_data.certifications,
        **skill_features,
        "communication_score": student_data.communication_score,
        "aptitude_score": student_data.aptitude_score,
        "projects": student_data.projects,
        "coding_score": student_data.coding_score,
        "attendance": student_data.attendance,
        "extracurricular": student_data.extracurricular,
    }

    # Reindex to guarantee exact column order expected by the model
    df = pd.DataFrame([row])
    df = df.reindex(columns=feature_columns, fill_value=0)
    return df
