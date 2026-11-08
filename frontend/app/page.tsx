import { SiteHeader } from "@/components/SiteHeader";
import { StartForm } from "@/components/StartForm";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="wrap home">
      <SiteHeader />
      <section className="home-hero">
        <h1 className="home-brand">پنج‌رخ</h1>
        <p className="home-ai">
          بعد از پاسخ‌ها، یک هوش مصنوعی متخصص نیمرخت را برایت روایت می‌کند.
        </p>
        <p className="home-welcome">
          جایی برای دیدن خودت — نه برای گذاشتن در یک تیپ.
        </p>
        <p className="home-meta muted">حدود ده دقیقه · پاسخ درست یا غلطی در کار نیست</p>
        <StartForm />
      </section>
      <p className="home-links muted">
        <Link href="/basis">مبانی</Link>
        {" · "}
        <Link href="/sample">نمونه گزارش</Link>
      </p>
    </main>
  );
}
