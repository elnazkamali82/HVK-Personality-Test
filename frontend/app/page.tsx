import { SiteHeader } from "@/components/SiteHeader";
import { StartForm } from "@/components/StartForm";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="wrap">
      <SiteHeader />
      <p className="kicker">خودشناسی · ۱۸ سال به بالا · نسخه ۰.۱</p>
      <h1>پنج‌رخ</h1>
      <p className="lead">
        یک نیمرخ توصیفی از پنج عامل شخصیت، با ۳۶ سؤال کوتاه. هدف، طبقه‌بندی شما در یک تیپ نیست؛
        دیدن این است که معاشرت، همراهی، پیگیری، حساسیت هیجانی و گشودگی در پاسخ‌های خودتان چطور کنار هم
        می‌نشینند.
      </p>
      <ul className="facts">
        <li>
          <strong>۳۶ سؤال</strong>
          <span className="muted">۳۰ سؤال نمره‌دار و ۶ سؤال کیفی</span>
        </li>
        <li>
          <strong>۸ تا ۱۲ دقیقه</strong>
          <span className="muted">یک سؤال در هر صفحه</span>
        </li>
        <li>
          <strong>پنج عامل</strong>
          <span className="muted">بدون برچسب تیپ شخصیتی</span>
        </li>
      </ul>
      <div className="notice">
        <p>
          سؤال‌ها برای بزرگسالان نوشته شده‌اند. پاسخ درست وجود ندارد. رفتار معمول چند ماه اخیر را ملاک
          بگذار، نه حال امروز و نه شخصیتی که دوست داری باشی. این نسخه هنوز روی نمونه واقعی بررسی نشده و
          ابزار تشخیص یا تصمیم‌گیری درباره دیگران نیست.
        </p>
      </div>
      <StartForm />
      <p>
        <Link href="/basis">مبانی علمی و محدودیت‌ها</Link>
        {" · "}
        <Link href="/sample">نمونه گزارش یک پاسخ‌دهنده فرضی</Link>
      </p>
    </main>
  );
}
