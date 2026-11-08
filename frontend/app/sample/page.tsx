import type { Metadata } from "next";
import { ProfileReport } from "@/components/ProfileReport";
import { SiteHeader } from "@/components/SiteHeader";
import { sampleReport } from "@/lib/sample";

export const metadata: Metadata = { title: "نمونه گزارش | پنج‌رخ" };

export default function SamplePage() {
  return (
    <main className="wrap wrap-wide">
      <SiteHeader />
      <ProfileReport
        report={sampleReport()}
        eyebrow="پاسخ‌دهنده فرضی · شخص واقعی نیست"
        title="نمونه نیمرخ"
      />
    </main>
  );
}
