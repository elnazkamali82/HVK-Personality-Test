import { ScoreChart } from "@/components/ScoreChart";
import type { Report } from "@/lib/interpret";

export function ProfileReport({
  report,
  eyebrow,
  title,
}: {
  report: Report;
  eyebrow: string;
  title: string;
}) {
  const leaning = report.domains.filter((domain) => domain.pole !== "mid");

  return (
    <article>
      <p className="kicker">{eyebrow}</p>
      <h1>{title}</h1>
      <div className="notice">
        <p>
          این خروجی برای خودشناسی است. تشخیص روان‌شناختی نمی‌دهد، رفتار آینده را پیش‌بینی قطعی نمی‌کند،
          و برای تصمیم استخدام، تحصیلی یا بالینی ساخته نشده است.
        </p>
      </div>
      <h2>تصویر کلی</h2>
      <p>{report.overview}</p>
      <h2>پنج عامل</h2>
      <ScoreChart domains={report.domains} />
      {report.domainTexts.map((domain) => (
        <section key={domain.id}>
          <h3>{domain.name}</h3>
          <p className="domain-copy">{domain.text}</p>
        </section>
      ))}
      <h2>وقتی نمره‌ها کنار هم خوانده می‌شوند</h2>
      {report.interactions.length > 0 ? (
        <ul className="plain-list">
          {report.interactions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : (
        <p>
          {leaning.length < 2
            ? "کمتر از دو عامل به اندازه نیم واحد از مرکز مقیاس فاصله گرفته‌اند، پس جمله ترکیبی جداگانه‌ای ساخته نشده است."
            : "برای این ترکیب، جمله جداگانه‌ای جز توصیف هر عامل نوشته نشده است."}
        </p>
      )}
      <section className="qualitative">
        <h2>برداشت‌های کیفی، خارج از نمره</h2>
        <p>
          این شش پاسخ الگوی رفتاری در همان موقعیت‌ها هستند. کلید تجربی برای تبدیلشان به نمره شخصیت وجود
          ندارد، پس در میانگین پنج عامل نیامده‌اند.
        </p>
        <ul className="plain-list">
          {report.qualitative.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
      <h2>کار گروهی</h2>
      <p>{report.groupBehavior}</p>
      <h2>موقعیت دشوار</h2>
      <p>{report.difficulty}</p>
      <h2>یادگیری و تجربه تازه</h2>
      <p>{report.learning}</p>
      <div className="split">
        <section className="panel">
          <h2>امکان‌های محتمل</h2>
          {report.strengths.length > 0 ? (
            <ul>
              {report.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>نمره‌ها به اندازه کافی از مرکز مقیاس فاصله نگرفته‌اند که امکانی از آن‌ها استخراج شود.</p>
          )}
        </section>
        <section className="panel">
          <h2>دشواری‌های محتمل</h2>
          {report.challenges.length > 0 ? (
            <ul>
              {report.challenges.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : (
            <p>نمره‌ها به اندازه کافی از مرکز مقیاس فاصله نگرفته‌اند که دشواری مشخصی از آن‌ها استخراج شود.</p>
          )}
        </section>
      </div>
      <h2>برای خودشناسی</h2>
      <ul className="plain-list">
        {report.suggestions.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <h2>حد این گزارش</h2>
      <p>
        جمله‌هایی که از فاصله تا مرکز مقیاس ساخته شده‌اند قاعده نگارش همین نسخه‌اند، نه آستانه کم و متوسط
        و زیاد در جامعه. نمره زیرعامل نمایش داده نمی‌شود، چون هر زیرعامل فقط دو گویه دارد و برای قضاوت
        درباره یک نفر ناپایدار است. خودتوصیفی هم تحت تأثیر حال همان روز، مطلوب‌نمایی و دقت حافظه است.
      </p>
    </article>
  );
}
