"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useIsClient } from "@/components/use-is-client";
import { ReportResult } from "@/components/ReportResult";
import { ApiError, fetchLlmReport } from "@/lib/api";
import { buildReport, type Report } from "@/lib/interpret";
import { IncompleteAnswers, scoreProfile } from "@/lib/scoring";
import { ANSWERS_KEY } from "@/lib/storage";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; report: Report; source: "llm" | "local"; fallbackReason?: string }
  | { status: "empty" }
  | { status: "error"; message: string };

function answersFromStorage(): Record<string, number> | null {
  const saved = sessionStorage.getItem(ANSWERS_KEY);
  if (!saved) return null;
  try {
    return JSON.parse(saved) as Record<string, number>;
  } catch {
    return null;
  }
}

export function ResultView() {
  const isClient = useIsClient();
  const [state, setState] = useState<LoadState>({ status: "loading" });

  useEffect(() => {
    if (!isClient) return;

    const answers = answersFromStorage();
    if (!answers) {
      setState({ status: "empty" });
      return;
    }

    let cancelled = false;

    async function load() {
      try {
        const profile = scoreProfile(answers!);
        try {
          const report = await fetchLlmReport(profile);
          if (!cancelled) setState({ status: "ready", report, source: "llm" });
        } catch (error) {
          const local = buildReport(profile);
          if (!cancelled) {
            setState({
              status: "ready",
              report: local,
              source: "local",
              fallbackReason:
                error instanceof ApiError
                  ? error.message
                  : "سرویس تفسیر در دسترس نبود.",
            });
          }
        }
      } catch (error) {
        if (cancelled) return;
        const message =
          error instanceof IncompleteAnswers
            ? error.message
            : "خواندن پاسخ‌ها ممکن نشد.";
        setState({ status: "error", message });
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [isClient]);

  if (!isClient || state.status === "loading") {
    return <LoadingReport />;
  }
  if (state.status === "empty") return <EmptyResult />;
  if (state.status === "error") {
    return (
      <div>
        <h1>گزارش ساخته نشد</h1>
        <p>{state.message}</p>
        <Link className="button button-primary" href="/">
          بازگشت
        </Link>
      </div>
    );
  }

  return (
    <ReportResult
      report={state.report}
      source={state.source}
      fallbackReason={state.fallbackReason}
    />
  );
}

function LoadingReport() {
  return (
    <div className="result-status" aria-busy="true" aria-live="polite">
      <p className="kicker">در حال آماده‌سازی</p>
      <h1>نیمرخ شما</h1>
      <p className="muted">در حال ساخت داشبورد ابعاد و نوشتن تحلیل…</p>
      <div className="skeleton-board" aria-hidden="true">
        <div className="skeleton-radar" />
        <div className="skeleton-tiles">
          <div className="skeleton-line wide" />
          <div className="skeleton-bar" />
          <div className="skeleton-line mid" />
          <div className="skeleton-bar" />
          <div className="skeleton-line wide" />
          <div className="skeleton-bar" />
        </div>
      </div>
    </div>
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
