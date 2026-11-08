from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

from app.schemas.assessment import DomainScore


class DomainNarrative(BaseModel):
    model_config = ConfigDict(populate_by_name=True, alias_generator=to_camel)

    id: str
    name: str
    text: str = Field(min_length=1)


class NarrativeReport(BaseModel):
    """LLM-produced narrative fields. Domains stay numeric from the scorer."""

    model_config = ConfigDict(populate_by_name=True, alias_generator=to_camel)

    overview: str = Field(min_length=1)
    domain_texts: list[DomainNarrative] = Field(min_length=5, max_length=5)
    interactions: list[str]
    qualitative: list[str]
    group_behavior: str = Field(min_length=1)
    difficulty: str = Field(min_length=1)
    learning: str = Field(min_length=1)
    strengths: list[str]
    challenges: list[str]
    suggestions: list[str] = Field(min_length=1)


class AssessmentReport(BaseModel):
    """Full report shape expected by the Next.js ProfileReport UI."""

    model_config = ConfigDict(populate_by_name=True, alias_generator=to_camel)

    overview: str
    domains: list[DomainScore]
    domain_texts: list[DomainNarrative]
    interactions: list[str]
    qualitative: list[str]
    group_behavior: str
    difficulty: str
    learning: str
    strengths: list[str]
    challenges: list[str]
    suggestions: list[str]
    source: str = "llm"
