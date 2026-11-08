from fastapi import APIRouter, HTTPException, status

from app.schemas.assessment import AnswerSubmission, AssessmentInfo
from app.services.scoring import ScoringNotReady, score_submission

router = APIRouter(prefix="/assessment", tags=["assessment"])


@router.get("/info", response_model=AssessmentInfo)
def assessment_info() -> AssessmentInfo:
    return AssessmentInfo()


@router.post("/score")
def score(payload: AnswerSubmission) -> dict:
    try:
        return score_submission(payload)
    except ScoringNotReady as exc:
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail=str(exc),
        ) from exc
