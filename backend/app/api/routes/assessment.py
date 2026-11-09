from fastapi import APIRouter, HTTPException, status

from app.schemas.assessment import (
    AnswerSubmission,
    AssessmentInfo,
    ProfileSubmission,
)
from app.schemas.report import AssessmentReport
from app.services.interpret import build_llm_report
from app.services.llm import LlmNotConfigured, LlmRequestFailed
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


@router.post(
    "/report",
    response_model=AssessmentReport,
    response_model_by_alias=True,
)
async def report(payload: ProfileSubmission) -> AssessmentReport:
    """Turn a scored profile into a structured Persian narrative via LLM."""
    try:
        return await build_llm_report(payload)
    except LlmNotConfigured as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    except LlmRequestFailed as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc
