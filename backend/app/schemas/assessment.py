from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    service: str


class AssessmentInfo(BaseModel):
    instrument: str = "panjrakh-36"
    version: str = "0.1.0"
    audience: str = "adults_18_plus"
    language: str = "fa"
    model: str = "big_five_hierarchical"
    item_count: int = 36
    scored_item_count: int = 30
    status: str = "unvalidated_prototype"
    scoring: str = "not_served"


class AnswerSubmission(BaseModel):
    """Contract for a future scoring endpoint. Not accepted yet."""

    instrument_version: str = Field(examples=["0.1.0"])
    answers: dict[str, int] = Field(
        description="Map of item id (q01–q36) to the selected option value."
    )
