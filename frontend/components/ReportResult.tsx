"use client";

import Link from "next/link";
import { ProfileReport } from "@/components/ProfileReport";
import type { Report } from "@/lib/interpret";

export function ReportResult({
  report,
  source,
  fallbackReason,
}: {
  report: Report;
  source: "llm" | "local";
  fallbackReason?: string;
}) {
  const eyebrow =
    source === "llm"
      ? "تحلیل هوش مصنوعی متخصص"
      : "تفسیر محلی · جایگزین موقت";

  return (
    <>
      {source === "local" && fallbackReason && (
        <p className="source-note notice">
          تفسیر محلی نشان داده شد؛ سرویس نوشتاری در دسترس نبود ({fallbackReason}).
        </p>
      )}
      <ProfileReport report={report} eyebrow={eyebrow} title="نیمرخ شما" />
      <div className="result-actions no-print">
        <button type="button" className="button button-ghost" onClick={() => window.print()}>
          چاپ یا ذخیره
        </button>
        <Link className="button button-ghost" href="/test">
          دوباره پاسخ بده
        </Link>
        <Link className="button button-ghost result-tech-link" href="/method">
          یادداشت فنی نمره‌گذاری
        </Link>
      </div>
    </>
  );
}
