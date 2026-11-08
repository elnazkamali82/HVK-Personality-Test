import type { Metadata } from "next";
import { ReportResult } from "@/components/ReportResult";
import { SiteHeader } from "@/components/SiteHeader";
import { sampleReport } from "@/lib/sample";

export const metadata: Metadata = { title: "نمونه گزارش | پنج‌رخ" };

export default function SamplePage() {
  return (
    <main className="wrap wrap-wide">
      <SiteHeader />
      <ReportResult report={sampleReport()} source="llm" />
    </main>
  );
}
