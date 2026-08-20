"""
generate_dataset.py

Generates a SYNTHETIC / DEMO student placement dataset for the
Student Placement Prediction System.

IMPORTANT: This dataset is entirely synthetically generated using
statistical distributions (informed by realistic ranges for CGPA,
percentages, scores, etc.) combined with a hand-designed placement
probability function. It does NOT represent real students or real
placement records. It exists purely to train a demonstration ML
model for this educational / portfolio project.

Run:
    python generate_dataset.py
Output:
    data/students.csv
"""

import numpy as np
import pandas as pd
import os

np.random.seed(42)

N_RECORDS = 900

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

# Base probability that a given skill is known by a random student.
# (Some skills like Python / Git are more common than niche ones like Docker/AWS)
SKILL_BASE_PROB = {
    "python_skill": 0.55,
    "java_skill": 0.35,
    "cpp_skill": 0.40,
    "javascript_skill": 0.45,
    "react_skill": 0.30,
    "sql_skill": 0.50,
    "machine_learning_skill": 0.30,
    "data_science_skill": 0.25,
    "django_skill": 0.15,
    "fastapi_skill": 0.12,
    "nodejs_skill": 0.28,
    "git_skill": 0.60,
    "aws_skill": 0.18,
    "docker_skill": 0.15,
}


def generate_dataset(n=N_RECORDS):
    rows = []

    for i in range(n):
        student_id = 1000 + i

        # Academic features - informed by realistic engineering-college ranges
        cgpa = np.clip(np.random.normal(7.5, 0.9), 4.5, 10.0)
        tenth_percentage = np.clip(np.random.normal(84, 8), 45, 100)
        twelfth_percentage = np.clip(np.random.normal(80, 9), 40, 100)
        backlogs = np.random.choice(
            [0, 1, 2, 3, 4, 5], p=[0.55, 0.20, 0.12, 0.07, 0.04, 0.02]
        )
        attendance = np.clip(np.random.normal(85, 9), 50, 100)

        # Technical profile
        internships = np.random.choice(
            [0, 1, 2, 3, 4], p=[0.30, 0.32, 0.22, 0.11, 0.05]
        )
        certifications = np.random.choice(
            range(0, 9), p=[0.15, 0.18, 0.18, 0.15, 0.12, 0.09, 0.07, 0.04, 0.02]
        )
        projects = np.random.choice(
            range(0, 8), p=[0.08, 0.14, 0.20, 0.20, 0.16, 0.12, 0.06, 0.04]
        )
        coding_score = np.clip(np.random.normal(65, 18), 0, 100)

        # Skills: higher coding_score slightly increases chance of knowing more skills
        skill_boost = (coding_score - 50) / 200  # -0.25 .. +0.25 roughly
        skills = {}
        skill_count = 0
        for skill in SKILL_COLUMNS:
            p = np.clip(SKILL_BASE_PROB[skill] + skill_boost, 0.02, 0.95)
            has_skill = 1 if np.random.rand() < p else 0
            skills[skill] = has_skill
            skill_count += has_skill

        # Soft skills
        communication_score = np.clip(np.random.normal(70, 14), 0, 100)
        aptitude_score = np.clip(np.random.normal(68, 15), 0, 100)
        extracurricular = np.random.choice([0, 1, 2, 3], p=[0.25, 0.35, 0.28, 0.12])

        rows.append(
            {
                "student_id": student_id,
                "cgpa": round(cgpa, 2),
                "tenth_percentage": round(tenth_percentage, 2),
                "twelfth_percentage": round(twelfth_percentage, 2),
                "backlogs": int(backlogs),
                "internships": int(internships),
                "certifications": int(certifications),
                **skills,
                "communication_score": round(communication_score, 1),
                "aptitude_score": round(aptitude_score, 1),
                "projects": int(projects),
                "coding_score": round(coding_score, 1),
                "attendance": round(attendance, 1),
                "extracurricular": int(extracurricular),
            }
        )

    df = pd.DataFrame(rows)

    # ---- Build the placement target using a hand-designed logistic function ----
    # This intentionally weights the factors that most influence real-world
    # placement outcomes, then adds noise so the problem is not trivially separable.
    skill_count_series = df[SKILL_COLUMNS].sum(axis=1)

    z = (
        -1.75
        + 0.55 * (df["cgpa"] - 7.5)
        + 0.02 * (df["coding_score"] - 65)
        + 0.35 * df["internships"]
        + 0.18 * df["projects"]
        + 0.12 * df["certifications"]
        + 0.015 * (df["aptitude_score"] - 65)
        + 0.012 * (df["communication_score"] - 65)
        + 0.10 * skill_count_series
        + 0.02 * (df["attendance"] - 80)
        + 0.10 * df["extracurricular"]
        - 0.45 * df["backlogs"]
        + 0.01 * (df["tenth_percentage"] - 80)
        + 0.01 * (df["twelfth_percentage"] - 78)
    )

    prob = 1 / (1 + np.exp(-z))
    noise = np.random.normal(0, 0.06, size=len(df))
    prob_noisy = np.clip(prob + noise, 0.01, 0.99)

    df["placed"] = (np.random.rand(len(df)) < prob_noisy).astype(int)

    return df


if __name__ == "__main__":
    df = generate_dataset()
    os.makedirs("data", exist_ok=True)
    out_path = os.path.join("data", "students.csv")
    df.to_csv(out_path, index=False)

    print(f"Generated {len(df)} synthetic student records -> {out_path}")
    print(f"Placement rate: {df['placed'].mean() * 100:.1f}%")
    print("\nNOTE: This is a SYNTHETIC / DEMO dataset generated for educational")
    print("purposes. It does not represent real students or real placement data.")
