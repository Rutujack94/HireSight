"""
routes/prediction.py

POST /api/predict
"""

from fastapi import APIRouter, HTTPException

from app.schemas import StudentData, PredictionResponse
from app.services.prediction_service import prediction_service
from app.services.recommendation_service import generate_recommendations

router = APIRouter(prefix="/api", tags=["prediction"])


@router.post("/predict", response_model=PredictionResponse)
async def predict_placement(student_data: StudentData):
    if not prediction_service.is_ready():
        raise HTTPException(
            status_code=503,
            detail=(
                "Prediction model is not available on the server. "
                "Please run train_model.py to generate the model artifacts."
            ),
        )

    try:
        result = prediction_service.predict(student_data)
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception:
        # Never leak internal stack traces to the client
        raise HTTPException(
            status_code=500,
            detail="An error occurred while generating the prediction. Please try again.",
        )

    recommendations = generate_recommendations(student_data)
    top_factors = prediction_service.get_feature_importance(top_n=8)

    result_label = "Placed" if result["prediction"] == 1 else "Not Placed"

    return PredictionResponse(
        prediction=result["prediction"],
        result=result_label,
        placement_probability=result["placement_probability"],
        not_placed_probability=result["not_placed_probability"],
        recommendations=recommendations,
        top_factors=top_factors,
    )
