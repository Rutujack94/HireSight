"""
recommendation_service.py

Rule-based (NOT model-based) recommendations. The placement prediction
itself always comes from the Random Forest model; this module only adds
human-readable, actionable suggestions based on simple thresholds.
"""

from typing import List


def generate_recommendations(student_data) -> List[str]:
    recs: List[str] = []

    if student_data.coding_score < 60:
        recs.append(
            "Improve Coding Skills: Your coding score is below the recommended "
            "level. Practice DSA and solve coding problems regularly."
        )

    if student_data.communication_score < 60:
        recs.append(
            "Improve Communication: Work on speaking, presentation, and "
            "interview communication skills."
        )

    if student_data.internships == 0:
        recs.append(
            "Gain Practical Experience: Consider completing an internship or "
            "a real-world project."
        )

    if student_data.projects < 2:
        recs.append(
            "Build More Projects: Add 1-2 strong projects to your resume."
        )

    if student_data.attendance < 75:
        recs.append(
            "Improve Attendance: Try to maintain attendance above 75%."
        )

    if student_data.certifications == 0:
        recs.append(
            "Add Relevant Certifications: Consider completing certifications "
            "related to your target role."
        )

    if student_data.backlogs > 0:
        recs.append(
            "Clear Pending Backlogs: Focus on clearing backlogs, as they can "
            "affect eligibility for many recruiters."
        )

    if student_data.aptitude_score < 60:
        recs.append(
            "Practice Aptitude: Work through quantitative aptitude and "
            "logical reasoning practice sets regularly."
        )

    if len(student_data.technical_skills) < 3:
        recs.append(
            "Broaden Your Skill Set: Learn a few more in-demand technical "
            "skills relevant to your target role."
        )

    if not recs:
        recs.append(
            "Continue Improving: Keep strengthening your coding skills and "
            "maintain your strong overall academic and technical performance."
        )
        recs.append("Maintain strong academic performance across all areas.")

    return recs
