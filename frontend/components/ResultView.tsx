"use client";

import Link from "next/link";
import { useIsClient } from "@/components/use-is-client";
import { ProfileReport } from "@/components/ProfileReport";
import { buildReport, type Report } from "@/lib/interpret";
import { scoreProfile } from "@/lib/scoring";
import { ANSWERS_KEY } from "@/lib/storage";

function reportFromStorage(): Report | null {
  const saved = sessionStorage.getItem(ANSWERS_KEY);
  if (!saved) return null;
  try {
    const answers = JSON.parse(saved) as Record<string, number>;
    return buildReport(scoreProfile(answers));
  } catch {
    return null;
  }
}

export function ResultView() {
  const isClient = useIsClient();
  if (!isClient) return <p>در حال ساختن نیمرخ…</p>;

  const report = reportFromStorage();
  if (!report) return <EmptyResult />;

  return (
    <>
      <ProfileReport report={report} eyebrow="گزارش خودتوصیفی" title="نیمرخ شما" />
      <p className="no-print">
        <button type="button" className="button button-ghost" onClick={() => window.print()}>
          چاپ یا ذخیره
        </button>
      </p>
      <p className="no-print">
        <Link href="/method">یادداشت فنی نمره‌گذاری</Link>
      </p>
    </>
  );
}

function EmptyResult() {
  return (
    <div>
      <h1>نیمرخی ذخیره نشده است</h1>
      <p>برای دیدن گزارش، آزمون را تا پایان پاسخ بده.</p>
      <Link className="button button-primary" href="/">
        بازگشت
      </Link>
    </div>
  );
}
