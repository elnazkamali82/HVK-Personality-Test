import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { TestRunner } from "@/components/TestRunner";

export const metadata: Metadata = { title: "آزمون | پنج‌رخ" };

export default function TestPage() {
  return (
    <main className="wrap">
      <SiteHeader />
      <TestRunner />
    </main>
  );
}
