"use client";

import { useState } from "react";
import { DomainScoreRow, ScoreChart } from "@/components/ScoreChart";
import type { Report } from "@/lib/interpret";

type Mode = "summary" | "full";

const TOC = [
  { id: "overview", label: "تصویر کلی" },
  { id: "domains", label: "پنج عامل" },
  { id: "interactions", label: "ترکیب نمره‌ها", fullOnly: true },
  { id: "qualitative", label: "کیفی", fullOnly: true },
  { id: "contexts", label: "موقعیت‌ها", fullOnly: true },
  { id: "balance", label: "امکان و دشواری" },
  { id: "suggestions", label: "پیشنهادها" },
] as const;

export function ProfileReport({
  report,
  eyebrow,
  title,
}: {
  report: Report;
  eyebrow: string;
  title: string;
}) {
  const [mode, setMode] = useState<Mode>("summary");
  const leaning = report.domains.filter((domain) => domain.pole !== "mid");
  const toc = TOC.filter((item) => mode === "full" || !("fullOnly" in item && item.fullOnly));

  return (
    <article className="report">
      <p className="kicker">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="notice-compact">
        برای خودشناسی است؛ تشخیص روان‌شناختی، پیش‌بینی قطعی رفتار، یا مبنای استخدام و تحصیل نیست.
      </p>

      <div className="report-toolbar no-print">
        <div className="report-mode" role="group" aria-label="حالت نمایش گزارش">
          <button
            type="button"
            aria-pressed={mode === "summary"}
            onClick={() => setMode("summary")}
          >
            خلاصه
          </button>
          <button type="button" aria-pressed={mode === "full"} onClick={() => setMode("full")}>
            کامل
          </button>
        </div>
      </div>

      <nav className="report-toc no-print" aria-label="بخش‌های گزارش">
        {toc.map((item) => (
          <a key={item.id} href={`#${item.id}`}>
            {item.label}
          </a>
        ))}
      </nav>

      <section id="overview" className="report-hero report-section">
        <h2>تصویر کلی</h2>
        <p className="report-overview">{report.overview}</p>
        <ScoreChart domains={report.domains} />
      </section>

      <section id="domains" className="report-section">
        <h2>پنج عامل</h2>
        <p className="muted">
          هر بلوک نمره همان عامل و توصیف فاصله‌اش از مرکز مقیاس را کنار هم می‌گذارد.
        </p>
        {report.domainTexts.map((domain) => {
          const score = report.domains.find((item) => item.id === domain.id);
          if (!score) return null;
          return (
            <section className="domain-card" key={domain.id}>
              <DomainScoreRow domain={score} compact />
              <p className="domain-copy">{domain.text}</p>
            </section>
          );
        })}
      </section>

      {mode === "full" && (
        <>
          <section id="interactions" className="report-section">
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
          </section>

          <section id="qualitative" className="qualitative report-section">
            <h2>برداشت‌های کیفی، خارج از نمره</h2>
            <p>
              این شش پاسخ الگوی رفتاری در همان موقعیت‌ها هستند و در میانگین پنج عامل نیامده‌اند.
            </p>
            <ul className="plain-list">
              {report.qualitative.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section id="contexts" className="report-section">
            <h2>موقعیت‌ها</h2>
            <div className="panel" style={{ marginBottom: "0.8rem" }}>
              <h3>کار گروهی</h3>
              <p>{report.groupBehavior}</p>
            </div>
            <div className="panel" style={{ marginBottom: "0.8rem" }}>
              <h3>موقعیت دشوار</h3>
              <p>{report.difficulty}</p>
            </div>
            <div className="panel">
              <h3>یادگیری و تجربه تازه</h3>
              <p>{report.learning}</p>
            </div>
          </section>
        </>
      )}

      <section id="balance" className="report-section">
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
      </section>

      <section id="suggestions" className="report-section suggestion-list">
        <h2>برای خودشناسی</h2>
        <ul className="plain-list">
          {report.suggestions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <details className="report-limits">
        <summary>حد این گزارش</summary>
        <p>
          جمله‌هایی که از فاصله تا مرکز مقیاس ساخته شده‌اند قاعده نگارش همین نسخه‌اند، نه آستانه کم و
          متوسط و زیاد در جامعه. نمره زیرعامل نمایش داده نمی‌شود، چون هر زیرعامل فقط دو گویه دارد و
          برای قضاوت درباره یک نفر ناپایدار است. خودتوصیفی هم تحت تأثیر حال همان روز، مطلوب‌نمایی و دقت
          حافظه است.
        </p>
      </details>
    </article>
  );
}
