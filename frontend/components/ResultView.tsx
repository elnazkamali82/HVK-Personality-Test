"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useIsClient } from "@/components/use-is-client";
import { ProfileReport } from "@/components/ProfileReport";
import { ApiError, fetchLlmReport } from "@/lib/api";
import { buildReport, type Report } from "@/lib/interpret";
import { IncompleteAnswers, scoreProfile } from "@/lib/scoring";
import { ANSWERS_KEY } from "@/lib/storage";

type LoadState =
  | { status: "loading" }
  | { status: "ready"; report: Report; source: "llm" | "local" }
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
            });
            if (error instanceof ApiError) {
              console.warn("LLM report unavailable, using local copy:", error.message);
            }
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
    return <p>در حال ساختن نیمرخ…</p>;
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
    <>
      <ProfileReport
        report={state.report}
        eyebrow={state.source === "llm" ? "گزارش خودتوصیفی (LLM)" : "گزارش خودتوصیفی"}
        title="نیمرخ شما"
      />
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
