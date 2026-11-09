from __future__ import annotations

from app.prompts.report import build_user_prompt, get_system_prompt
from app.schemas.assessment import ProfileSubmission
from app.schemas.report import AssessmentReport, NarrativeReport
from app.services.llm import complete_json


async def build_llm_report(profile: ProfileSubmission) -> AssessmentReport:
    narrative = await complete_json(
        system=get_system_prompt(),
        user=build_user_prompt(profile),
        schema=NarrativeReport,
    )
    return AssessmentReport(
        overview=narrative.overview,
        domains=profile.domains,
        domain_texts=narrative.domain_texts,
        interactions=narrative.interactions,
        qualitative=narrative.qualitative,
        group_behavior=narrative.group_behavior,
        difficulty=narrative.difficulty,
        learning=narrative.learning,
        strengths=narrative.strengths,
        challenges=narrative.challenges,
        suggestions=narrative.suggestions,
        fun=narrative.fun,
        source="llm",
    )
