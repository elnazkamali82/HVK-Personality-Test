"""Scoring boundary for a later API.

The live prototype scores in the Next.js app (`frontend/lib/scoring.ts`)
so this service stays unimplemented. When scoring moves here, keep these
rules:

- Score only the 30 core items (agreement and frequency).
- Situational and preference items stay qualitative.
- Reverse-keyed items transform as ``6 - raw`` on a 1–5 scale.
- Each domain is the mean of its own six items.
- The displayed index is ``(mean - 1) / 4 * 100``.
- That index is a linear rescale, not a percentile.
- Do not emit reliability or validity coefficients until a real sample exists.
"""

from app.schemas.assessment import AnswerSubmission


class ScoringNotReady(Exception):
    """Raised until the item bank and scorer move behind the API."""


def score_submission(_: AnswerSubmission) -> dict:
    raise ScoringNotReady(
        "Scoring is not served by the API yet. "
        "The current prototype scores in the frontend."
    )
