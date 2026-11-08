from __future__ import annotations

import json
from pathlib import Path

from app.schemas.assessment import ProfileSubmission

_PROMPT_FILE = Path(__file__).with_name("system_prompt.md")
_prompt_mtime: float | None = None
_prompt_cache: str | None = None


def load_system_prompt() -> str:
    """Load markdown system prompt; refresh when the file changes on disk."""
    global _prompt_mtime, _prompt_cache
    mtime = _PROMPT_FILE.stat().st_mtime
    if _prompt_cache is not None and _prompt_mtime == mtime:
        return _prompt_cache
    text = _PROMPT_FILE.read_text(encoding="utf-8").strip()
    if not text:
        raise RuntimeError(f"System prompt is empty: {_PROMPT_FILE}")
    _prompt_cache = text
    _prompt_mtime = mtime
    return text


def get_system_prompt() -> str:
    return load_system_prompt()


def build_user_prompt(profile: ProfileSubmission) -> str:
    ranked = sorted(profile.domains, key=lambda d: d.index, reverse=True)
    ranking = [
        {
            "rank": i + 1,
            "id": d.id,
            "name": d.name,
            "index": d.index,
            "pole": d.pole,
            "mean": d.mean,
        }
        for i, d in enumerate(ranked)
    ]
    peak, low = ranked[0], ranked[-1]
    payload = {
        "instrument_version": profile.instrument_version,
        "domains": [d.model_dump() for d in profile.domains],
        "scoreRanking": ranking,
        "tensionHint": {
            "peak": {"id": peak.id, "name": peak.name, "index": peak.index},
            "low": {"id": low.id, "name": low.name, "index": low.index},
        },
        "qualitative": [q.model_dump(by_alias=True) for q in profile.qualitative],
    }
    return (
        "برای همین پروفایل یک گزارش دو‌لایهٔ تازه بساز. کپیِ الگوهای تکراری ممنوع.\n\n"
        "۱) لایهٔ همزاد (fun) را اول و کامل بنویس:\n"
        "- voice باید حداقل دو عدد مشخص از scoreRanking را ذکر کند.\n"
        "- animal/character/food/career/place را از ترکیب اوج+فرود+تنش بساز، نه فقط از یک بُعد.\n"
        "- عنوان شغلی تکی و مشخص؛ مکان تکی و مشخص؛ غذای ایرانی با جزئیات.\n"
        "- از لیست ممنوع‌های پرامپت سیستم دوری کن.\n\n"
        "۲) لایهٔ تحلیلی: overview، domainTexts، و بقیهٔ فیلدها — شخصی و کوتاه.\n\n"
        f"{json.dumps(payload, ensure_ascii=False, indent=2)}"
    )
