from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path

from app.schemas.assessment import ProfileSubmission

_PROMPT_FILE = Path(__file__).with_name("system_prompt.md")


@lru_cache(maxsize=1)
def load_system_prompt() -> str:
    """Load the markdown system prompt (cached for process lifetime)."""
    text = _PROMPT_FILE.read_text(encoding="utf-8").strip()
    if not text:
        raise RuntimeError(f"System prompt is empty: {_PROMPT_FILE}")
    return text


def get_system_prompt() -> str:
    return load_system_prompt()


def build_user_prompt(profile: ProfileSubmission) -> str:
    payload = {
        "instrument_version": profile.instrument_version,
        "domains": [d.model_dump() for d in profile.domains],
        "qualitative": [q.model_dump(by_alias=True) for q in profile.qualitative],
    }
    return (
        "بر اساس این پروفایل اسکور‌شده، گزارش دو‌لایه بساز:\n"
        "۱) لایهٔ همزاد (fun): همزاد جانوری، نقش روی پرده، غذای ایرانی، مسیر شغلی، جای زندگی "
        "(مطمئن و جذاب بنویس؛ نام راوی نساز؛ نگو شوخی یا حدس است)\n"
        "۲) لایهٔ تحلیلی: overview، domainTexts، و بقیهٔ فیلدهای روایی\n\n"
        "همه انتخاب‌های لایهٔ همزاد باید به الگوی نمره‌های همین فرد قلاب شوند.\n\n"
        f"{json.dumps(payload, ensure_ascii=False, indent=2)}"
    )
