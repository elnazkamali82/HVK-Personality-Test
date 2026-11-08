import { SiteHeader } from "@/components/SiteHeader";
import { StartForm } from "@/components/StartForm";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="home">
      <div className="hero-plane" aria-hidden="true">
        <div className="hero-glow hero-glow-a" />
        <div className="hero-glow hero-glow-b" />
        <svg className="hero-motif" viewBox="0 0 600 600" fill="none">
          <polygon
            points="300,70 520,230 440,480 160,480 80,230"
            stroke="currentColor"
            strokeWidth="1.5"
            opacity="0.35"
          />
          <polygon
            points="300,140 450,250 395,420 205,420 150,250"
            stroke="currentColor"
            strokeWidth="1.2"
            opacity="0.22"
          />
          <circle cx="300" cy="300" r="18" fill="currentColor" opacity="0.18" />
        </svg>
      </div>

      <div className="wrap wrap-wide home-shell">
        <SiteHeader tone="hero" />

        <section className="hero">
          <p className="kicker hero-kicker">خودشناسی · ۱۸ سال به بالا · نسخه ۰.۱</p>
          <h1 className="brand-hero">پنج‌رخ</h1>
          <p className="hero-lead">
            نیمرخ توصیفی پنج عامل شخصیت؛ نه تیپ‌بندی، بلکه دیدن الگوی پاسخ‌های خودت.
          </p>
          <StartForm variant="hero" />
        </section>

        <section className="home-below">
          <ul className="facts facts-modern">
            <li>
              <strong>۳۶ سؤال</strong>
              <span className="muted">۳۰ نمره‌دار و ۶ کیفی</span>
            </li>
            <li>
              <strong>۸ تا ۱۲ دقیقه</strong>
              <span className="muted">یک سؤال در هر صفحه</span>
            </li>
            <li>
              <strong>پنج عامل</strong>
              <span className="muted">بدون برچسب تیپ</span>
            </li>
          </ul>

          <div className="notice">
            <p>
              سؤال‌ها برای بزرگسالان نوشته شده‌اند. پاسخ درست وجود ندارد. رفتار معمول چند ماه اخیر را
              ملاک بگذار، نه حال امروز و نه شخصیتی که دوست داری باشی. این نسخه هنوز روی نمونه واقعی
              بررسی نشده و ابزار تشخیص یا تصمیم‌گیری درباره دیگران نیست.
            </p>
          </div>

          <p className="home-links">
            <Link href="/basis">مبانی علمی و محدودیت‌ها</Link>
            <span aria-hidden="true">·</span>
            <Link href="/sample">نمونه گزارش</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
