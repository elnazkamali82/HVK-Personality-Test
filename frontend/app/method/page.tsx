import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { DOMAINS, FACETS } from "@/lib/domains";
import { fa } from "@/lib/format";
import { ITEMS } from "@/lib/instrument";

export const metadata: Metadata = { title: "نمره‌گذاری | پنج‌رخ" };

const FORMAT: Record<string, string> = {
  agreement: "موافقت",
  frequency: "فراوانی",
  situational: "موقعیت",
  preference: "ترجیح",
};

export default function MethodPage() {
  return (
    <main className="wrap wrap-wide">
      <SiteHeader />
      <p className="kicker">کلید تصحیح · فقط برای پیاده‌سازی</p>
      <h1>الگوریتم نمره‌گذاری</h1>
      <div className="notice">
        <p>
          اگر هنوز آزمون را نداده‌ای، این صفحه را نخوان. دانستن جهت گویه‌ها پاسخ را عوض می‌کند. پنج‌رخ
          ابزار پرخطر نیست، ولی کلید را جدا از متن سؤال‌های اجرایی نگه دار.
        </p>
      </div>
      <p>
        نمره هر عامل مستقل است. فقط سی گویه موافقت و فراوانی وارد میانگین می‌شوند. مقدار خام هر گزینه
        از ۱ تا ۵ است. گویه معکوس پیش از میانگین‌گیری با فرمول ۶ منهای مقدار خام برمی‌گردد. چهار موقعیت
        و دو ترجیح برچسب کیفی دارند و در هیچ میانگینی نیستند.
      </p>
      <div className="formula">
        <p>نمره کلیدخورده = اگر معکوس باشد، ۶ − خام؛ وگرنه همان خام.</p>
        <p>میانگین عامل = جمع شش نمره کلیدخورده همان عامل ÷ ۶.</p>
        <p>شاخص نمایشی = گردشده ((میانگین − ۱) ÷ ۴ × ۱۰۰).</p>
        <p>
          متن گزارش وقتی میانگین حداقل ۳٫۵ یا حداکثر ۲٫۵ باشد از مرکز مقیاس فاصله می‌گیرد. این دو عدد
          آستانه هنجار نیستند.
        </p>
      </div>
      <h2>پنج عامل</h2>
      <ul className="plain-list">
        {DOMAINS.map((domain) => (
          <li key={domain.id}>
            {domain.id} · {domain.name}: {domain.brief}
          </li>
        ))}
      </ul>
      <h2>کلید سؤال‌ها</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>شماره</th>
              <th>متن</th>
              <th>قالب</th>
              <th>عامل</th>
              <th>زیرعامل</th>
              <th>معکوس</th>
              <th>در نمره</th>
            </tr>
          </thead>
          <tbody>
            {ITEMS.map((item) => (
              <tr key={item.id}>
                <td>{fa(item.order)}</td>
                <td>{item.prompt}</td>
                <td>{FORMAT[item.format]}</td>
                <td>{item.domain ?? "—"}</td>
                <td>{item.facet ? FACETS[item.facet].name : "—"}</td>
                <td>{item.scored ? (item.reverse ? "بله" : "خیر") : "—"}</td>
                <td>{item.scored ? "بله" : "خیر"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        گزینه‌های کیفی، به ترتیب مقدار ۱ تا ۴ یا ۱ تا ۲، فقط برای متن گزارش برچسب دارند. برچسب‌ها در کد
        منبع کنار همان سؤال ذخیره شده‌اند و به نمره عامل اضافه نمی‌شوند.
      </p>
      <p>
        <Link href="/basis">بازگشت به مبانی</Link>
      </p>
    </main>
  );
}
