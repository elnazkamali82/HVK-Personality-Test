from __future__ import annotations

import json
from typing import Any, TypeVar

import httpx
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


def _resolved_mode() -> str:
    mode = settings.llm_api_mode
    if mode != "auto":
        return mode
    base = settings.llm_base_url.lower()
    if "kie.ai" in base:
        return "responses"
    return "chat"


def _chat_url() -> str:
    base = settings.llm_base_url.rstrip("/")
    if base.endswith("/chat/completions"):
        return base
    return f"{base}/chat/completions"


def _responses_url() -> str:
    base = settings.llm_base_url.rstrip("/")
    if base.endswith("/openai/v1/responses"):
        return base
    if base.endswith("/openai/v1"):
        return f"{base}/responses"
    if base.endswith("/v1"):
        return f"{base[: -len('/v1')]}/openai/v1/responses"
    return f"{base}/openai/v1/responses"


def _schema_hint() -> str:
    match = {"name": "string", "why": "string"}
    return json.dumps(
        {
            "overview": "string",
            "domainTexts": [{"id": "E|A|C|N|O", "name": "string", "text": "string"}],
            "interactions": ["string"],
            "qualitative": ["string"],
            "groupBehavior": "string",
            "difficulty": "string",
            "learning": "string",
            "strengths": ["string"],
            "challenges": ["string"],
            "suggestions": ["string"],
            "fun": {
                "voice": "string",
                "animal": match,
                "character": match,
                "food": match,
                "career": match,
                "place": match,
            },
        },
        ensure_ascii=False,
        indent=2,
    )


def _system_with_schema(system: str) -> str:
    return (
        f"{system}\n\n"
        "پاسخ را فقط به صورت یک آبجکت JSON معتبر برگردان. "
        "هیچ متنی بیرون از JSON ننویس.\n"
        f"شکل خروجی:\n{_schema_hint()}"
    )


def _extract_chat_text(payload: dict[str, Any]) -> str:
    choices = payload.get("choices")
    if not choices:
        raise LlmRequestFailed("LLM chat response had empty choices.")
    message = choices[0].get("message") if isinstance(choices[0], dict) else None
    content = message.get("content") if isinstance(message, dict) else None
    if not isinstance(content, str) or not content.strip():
        raise LlmRequestFailed("LLM chat response had empty message content.")
    return content.strip()


def _extract_output_text(payload: dict[str, Any]) -> str:
    if isinstance(payload.get("output_text"), str) and payload["output_text"].strip():
        return payload["output_text"].strip()

    chunks: list[str] = []
    for item in payload.get("output") or []:
        if not isinstance(item, dict):
            continue
        item_type = item.get("type")
        if item_type == "message":
            for part in item.get("content") or []:
                if not isinstance(part, dict):
                    continue
                if part.get("type") in {"output_text", "text"} and isinstance(part.get("text"), str):
                    chunks.append(part["text"])
        elif item_type in {"output_text", "text"} and isinstance(item.get("text"), str):
            chunks.append(item["text"])
        elif isinstance(item.get("content"), str):
            chunks.append(item["content"])

    text = "\n".join(chunk.strip() for chunk in chunks if chunk and chunk.strip())
    if text:
        return text

    for key in ("content", "result", "text", "message"):
        value = payload.get(key)
        if isinstance(value, str) and value.strip():
            return value.strip()
    raise LlmRequestFailed("LLM response did not include output text.")


def _provider_error(payload: dict[str, Any]) -> str | None:
    code = payload.get("code")
    if code is not None and code != 200:
        msg = payload.get("msg") or payload.get("message") or "provider error"
        return f"LLM provider error ({code}): {msg}"
    err = payload.get("error")
    if isinstance(err, dict):
        return f"LLM provider error: {err.get('message') or err}"
    if isinstance(err, str):
        return f"LLM provider error: {err}"
    status = payload.get("status")
    if isinstance(status, str) and status.lower() in {"failed", "cancelled", "incomplete"}:
        return f"LLM provider status: {status}"
    return None


def _strip_json_fence(text: str) -> str:
    cleaned = text.strip()
    if cleaned.startswith("```"):
        cleaned = cleaned.removeprefix("```json").removeprefix("```").strip()
        if cleaned.endswith("```"):
            cleaned = cleaned[: -3].strip()
    return cleaned


def _build_request(system: str, user: str) -> tuple[str, dict[str, Any]]:
    mode = _resolved_mode()
    instructions = _system_with_schema(system)
    if mode == "chat":
        body = {
            "model": settings.llm_model,
            "temperature": settings.llm_temperature,
            "response_format": {"type": "json_object"},
            "messages": [
                {"role": "system", "content": instructions},
                {"role": "user", "content": user},
            ],
        }
        return _chat_url(), body

    body = {
        "model": settings.llm_model,
        "stream": False,
        "instructions": instructions,
        "input": user,
        "temperature": settings.llm_temperature,
        "reasoning": {"effort": "low"},
    }
    return _responses_url(), body


async def complete_json(
    *,
    system: str,
    user: str,
    schema: type[T],
) -> T:
    """Call chat completions or Responses API and validate JSON into ``schema``."""
    url, body = _build_request(system, user)
    headers = {
        "Authorization": f"Bearer {_require_key()}",
        "Content-Type": "application/json",
    }

    try:
        async with httpx.AsyncClient(
            timeout=settings.llm_timeout_seconds,
            trust_env=False,
        ) as client:
            response = await client.post(url, headers=headers, json=body)
    except httpx.TimeoutException as exc:
        raise LlmRequestFailed(
            f"LLM timed out after {settings.llm_timeout_seconds:.0f}s"
        ) from exc
    except httpx.HTTPError as exc:
        raise LlmRequestFailed(f"LLM network error: {exc!s}") from exc

    try:
        payload = response.json()
    except ValueError as exc:
        raise LlmRequestFailed(
            f"LLM returned non-JSON (HTTP {response.status_code}): {response.text[:400]}"
        ) from exc

    if not isinstance(payload, dict):
        raise LlmRequestFailed("LLM returned a non-object JSON payload.")

    provider_error = _provider_error(payload)
    if provider_error:
        raise LlmRequestFailed(provider_error)

    if response.status_code >= 400:
        raise LlmRequestFailed(
            f"LLM HTTP {response.status_code}: {payload.get('msg') or payload.get('message') or payload}"
        )

    mode = _resolved_mode()
    raw_text = _extract_chat_text(payload) if mode == "chat" else _extract_output_text(payload)
    content = _strip_json_fence(raw_text)

    try:
        parsed = json.loads(content)
        return schema.model_validate(parsed)
    except (json.JSONDecodeError, ValidationError) as exc:
        raise LlmRequestFailed(f"LLM JSON did not match schema: {exc}") from exc
