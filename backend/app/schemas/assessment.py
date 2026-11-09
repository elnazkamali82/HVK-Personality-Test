from typing import Literal

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: str
    service: str


class AssessmentInfo(BaseModel):
    instrument: str = "panjrakh-36"
    version: str = "0.1.1"
    audience: str = "adults_18_plus"
    language: str = "fa"
    model: str = "big_five_hierarchical"
    item_count: int = 36
    scored_item_count: int = 30
    status: str = "unvalidated_prototype"
    scoring: str = "not_served"
    narrative: str = "llm_structured"


DomainId = Literal["E", "A", "C", "N", "O"]
Pole = Literal["high", "low", "mid"]
ItemFormat = Literal["agreement", "frequency", "situational", "preference"]


class DomainScore(BaseModel):
    id: DomainId
    name: str
    brief: str
    mean: float = Field(ge=1, le=5)
    index: int = Field(ge=0, le=100)
    pole: Pole


class QualitativeAnswer(BaseModel):
    item_id: str = Field(alias="itemId")
    order: int
    format: ItemFormat
    tag: str
    label: str

    model_config = {"populate_by_name": True}


class AnswerSubmission(BaseModel):
    """Contract for a future scoring endpoint. Not accepted yet."""

    instrument_version: str = Field(examples=["0.1.1"])
    answers: dict[str, int] = Field(
        description="Map of item id (q01–q36) to the selected option value."
    )


class ProfileSubmission(BaseModel):
    """Scored profile from the current frontend scorer."""

    instrument_version: str = Field(default="0.1.1", examples=["0.1.1"])
    domains: list[DomainScore] = Field(min_length=5, max_length=5)
    qualitative: list[QualitativeAnswer] = Field(min_length=1)
