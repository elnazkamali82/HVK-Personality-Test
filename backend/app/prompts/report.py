from __future__ import annotations

import json

from app.schemas.assessment import ProfileSubmission

SYSTEM_PROMPT = """\
تو نویسندهٔ گزارش خودتوصیفی فارسی برای ابزار پنج‌رخ هستی.
خروجی فقط JSON ساخت‌یافته است؛ تشخیص بالینی، پیش‌بینی قطعی، یا توصیهٔ استخدام/تحصیلی نده.

قواعد:
- فقط بر اساس اعداد و برچسب‌های کیفی داده‌شده بنویس؛ چیزی اختراع نکن.
- index تبدیل خطی میانگین ۱–۵ به ۰–۱۰۰ است، نه percentile و نه رتبه نسبت به دیگران.
- سؤال‌های qualitative داخل نمرهٔ پنج عامل نیستند؛ جدا تفسیرشان کن.
- pole: high یعنی میانگین ≥ ۳٫۵، low یعنی ≤ ۲٫۵، mid نزدیک مرکز.
- لحن دقیق، کوتاه، و بدون اغراق. فارسی معیار بنویس.
- برای هر دامنه دقیقاً یک domainTexts بنویس و id/name را از ورودی کپی کن.
- strengths و challenges حداکثر ۴ مورد، فقط برای دامنهٔ غیر mid، ترجیحاً دورترین‌ها از مرکز.
- suggestions بین ۱ تا ۴ مورد عملی برای خودشناسی.
- interactions فقط اگر ترکیب قطب‌ها معنای روشنی دارد؛ وگرنه آرایه خالی.
"""


def build_user_prompt(profile: ProfileSubmission) -> str:
    payload = {
        "instrument_version": profile.instrument_version,
        "domains": [d.model_dump() for d in profile.domains],
        "qualitative": [
            q.model_dump(by_alias=True) for q in profile.qualitative
        ],
    }
    return (
        "بر اساس این پروفایل اسکور‌شده، فیلدهای روایی گزارش را پر کن.\n\n"
        f"{json.dumps(payload, ensure_ascii=False, indent=2)}"
    )
