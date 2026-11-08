import type { Metadata } from "next";
import { ResultView } from "@/components/ResultView";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = { title: "نیمرخ | پنج‌رخ" };

export default function ResultPage() {
  return (
    <main className="wrap wrap-wide">
      <SiteHeader />
      <ResultView />
    </main>
  );
}
