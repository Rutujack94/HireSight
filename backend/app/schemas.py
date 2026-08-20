"""
schemas.py

Pydantic models used for request validation and response shaping.
"""

from typing import List, Optional
from pydantic import BaseModel, Field, field_validator

ALLOWED_SKILLS = [
    "Python",
    "Java",
    "C++",
    "JavaScript",
    "React",
    "SQL",
    "Machine Learning",
    "Data Science",
    "Django",
    "FastAPI",
    "Node.js",
    "Git/GitHub",
    "AWS",
    "Docker",
]


class StudentData(BaseModel):
    cgpa: float = Field(..., ge=0, le=10, description="CGPA on a 0-10 scale")
    tenth_percentage: float = Field(..., ge=0, le=100, description="10th grade percentage")
    twelfth_percentage: float = Field(..., ge=0, le=100, description="12th/Diploma percentage")
    backlogs: int = Field(..., ge=0, le=20, description="Number of active/historical backlogs")
    internships: int = Field(..., ge=0, le=10, description="Number of internships completed")
    certifications: int = Field(..., ge=0, le=20, description="Number of certifications earned")
    technical_skills: List[str] = Field(
        default_factory=list, description="List of technical skills the student knows"
    )
    communication_score: float = Field(..., ge=0, le=100)
    aptitude_score: float = Field(..., ge=0, le=100)
    projects: int = Field(..., ge=0, le=10)
    coding_score: float = Field(..., ge=0, le=100)
    attendance: float = Field(..., ge=0, le=100)
    extracurricular: int = Field(
        ..., ge=0, le=3, description="0=None, 1=Low, 2=Moderate, 3=High"
    )

    @field_validator("technical_skills")
    @classmethod
    def validate_skills(cls, skills: List[str]) -> List[str]:
        invalid = [s for s in skills if s not in ALLOWED_SKILLS]
        if invalid:
            raise ValueError(
                f"Unknown technical skill(s): {invalid}. "
                f"Allowed skills: {ALLOWED_SKILLS}"
            )
        return skills

    class Config:
        json_schema_extra = {
            "example": {
                "cgpa": 8.45,
                "tenth_percentage": 87,
                "twelfth_percentage": 82,
                "backlogs": 0,
                "internships": 2,
                "certifications": 4,
                "technical_skills": ["Python", "SQL", "Machine Learning", "React"],
                "communication_score": 82,
                "aptitude_score": 78,
                "projects": 3,
                "coding_score": 84,
                "attendance": 91,
                "extracurricular": 2,
            }
        }


class FeatureImportanceItem(BaseModel):
    feature: str
    importance: float
    importance_percent: float


class PredictionResponse(BaseModel):
    prediction: int
    result: str
    placement_probability: float
    not_placed_probability: float
    recommendations: List[str]
    top_factors: List[FeatureImportanceItem]


class HealthResponse(BaseModel):
    status: str
    model_loaded: bool


class DashboardStats(BaseModel):
    total_students_analyzed: int
    placement_rate: float
    average_cgpa: float
    average_placement_probability: float


class SkillPlacementRate(BaseModel):
    skill: str
    placement_rate: float


class DashboardAnalysis(BaseModel):
    placed_vs_not_placed: dict
    avg_cgpa_by_placement: dict
    coding_score_by_placement: dict
    internships_by_placement: List[dict]
    attendance_by_placement: dict
    model_metrics: Optional[dict] = None
