from __future__ import annotations

import json
from typing import TypeVar

from openai import APIError, AsyncOpenAI, OpenAIError
from pydantic import BaseModel, ValidationError

from app.core.config import settings

T = TypeVar("T", bound=BaseModel)


class LlmNotConfigured(Exception):
    """Raised when the OpenAI-compatible endpoint is missing credentials."""


class LlmRequestFailed(Exception):
    """Raised when the provider call or JSON parse fails."""


def _require_key() -> str:
    if not settings.llm_api_key.strip():
        raise LlmNotConfigured(
            "PANJRAKH_LLM_API_KEY is empty. Set it for the OpenAI-compatible provider."
        )
    return settings.llm_api_key


def get_client() -> AsyncOpenAI:
    return AsyncOpenAI(
        api_key=_require_key(),
        base_url=settings.llm_base_url,
        timeout=settings.llm_timeout_seconds,
    )


async def complete_json(
    *,
    system: str,
    user: str,
    schema: type[T],
) -> T:
    """Call an OpenAI-compatible chat API and validate JSON into ``schema``."""
    client = get_client()
    schema_hint = json.dumps(
        schema.model_json_schema(by_alias=True),
        ensure_ascii=False,
        indent=2,
    )
    system_with_schema = (
        f"{system}\n\n"
        "پاسخ را فقط به صورت یک آبجکت JSON معتبر برگردان. "
        "هیچ متنی بیرون از JSON ننویس.\n"
        f"JSON Schema:\n{schema_hint}"
    )

    try:
        response = await client.chat.completions.create(
            model=settings.llm_model,
            temperature=settings.llm_temperature,
            response_format={"type": "json_object"},
            messages=[
                {"role": "system", "content": system_with_schema},
                {"role": "user", "content": user},
            ],
        )
    except (APIError, OpenAIError) as exc:
        raise LlmRequestFailed(f"LLM provider error: {exc}") from exc

    content = response.choices[0].message.content
    if not content:
        raise LlmRequestFailed("LLM returned an empty message.")

    try:
        payload = json.loads(content)
        return schema.model_validate(payload)
    except (json.JSONDecodeError, ValidationError) as exc:
        raise LlmRequestFailed(f"LLM JSON did not match schema: {exc}") from exc
