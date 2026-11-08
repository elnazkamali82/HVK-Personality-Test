"use client";

import { useState } from "react";
import { RadarChart } from "@/components/RadarChart";
import { DomainScoreRow } from "@/components/ScoreChart";
import { fa } from "@/lib/format";
import type { Report } from "@/lib/interpret";
import type { Pole } from "@/lib/scoring";

type Mode = "summary" | "full";

const POLE_LABEL: Record<Pole, string> = {
  high: "متمایل به بالا",
  low: "متمایل به پایین",
  mid: "نزدیک مرکز",
};

const TOC = [
  { id: "dash-overview", label: "نمای کلی" },
  { id: "domains", label: "عامل‌ها" },
  { id: "interactions", label: "ترکیب", fullOnly: true },
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
  const ranked = [...report.domains].sort((a, b) => b.index - a.index);
  const top = ranked[0];
  const bottom = ranked[ranked.length - 1];

  return (
    <article className="dashboard">
      <header className="dash-header">
        <div>
          <p className="kicker">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="notice-compact">
            برای خودشناسی است؛ تشخیص روان‌شناختی یا مبنای استخدام و تحصیل نیست.
          </p>
        </div>
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
      </header>

      <nav className="report-toc no-print" aria-label="بخش‌های گزارش">
        {toc.map((item) => (
          <a key={item.id} href={`#${item.id}`}>
            {item.label}
          </a>
        ))}
      </nav>

      <section className="kpi-strip" aria-label="نمره پنج عامل">
        {report.domains.map((domain) => (
          <div className={`kpi-tile kpi-${domain.pole}`} key={domain.id}>
            <span className="kpi-name">{domain.name}</span>
            <strong className="kpi-value">{fa(domain.index)}</strong>
            <span className="kpi-pole">{POLE_LABEL[domain.pole]}</span>
          </div>
        ))}
      </section>

      <section id="dash-overview" className="dash-grid report-section">
        <div className="dash-card dash-radar">
          <h2>نقشه پنج عامل</h2>
          <p className="muted dash-card-note">
            شکل رادار فقط الگوی نمره‌های همین پاسخ است؛ فاصله از مرکز مقیاس را نشان می‌دهد نه رتبه در
            جامعه.
          </p>
          <RadarChart domains={report.domains} />
          <div className="dash-highlights">
            <div>
              <span className="muted">پررنگ‌ترین</span>
              <strong>
                {top.name} · {fa(top.index)}
              </strong>
            </div>
            <div>
              <span className="muted">کم‌رنگ‌ترین</span>
              <strong>
                {bottom.name} · {fa(bottom.index)}
              </strong>
            </div>
          </div>
        </div>

        <div className="dash-card dash-overview">
          <h2>تصویر کلی</h2>
          <p className="report-overview">{report.overview}</p>
        </div>
      </section>

      <section id="domains" className="report-section">
        <div className="section-head">
          <h2>پنج عامل</h2>
          <p className="muted">نمره و توصیف هر عامل در یک کارت.</p>
        </div>
        <div className="domain-grid">
          {report.domainTexts.map((domain) => {
            const score = report.domains.find((item) => item.id === domain.id);
            if (!score) return null;
            return (
              <section className={`domain-card domain-card-${score.pole}`} key={domain.id}>
                <DomainScoreRow domain={score} compact />
                <p className="domain-copy">{domain.text}</p>
              </section>
            );
          })}
        </div>
      </section>

      {mode === "full" && (
        <>
          <section id="interactions" className="report-section dash-card">
            <h2>وقتی نمره‌ها کنار هم خوانده می‌شوند</h2>
            {report.interactions.length > 0 ? (
              <ul className="plain-list insight-list">
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

          <section id="qualitative" className="report-section dash-card dash-card-accent">
            <h2>برداشت‌های کیفی، خارج از نمره</h2>
            <p className="muted">این شش پاسخ در میانگین پنج عامل نیامده‌اند.</p>
            <ul className="plain-list insight-list">
              {report.qualitative.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section id="contexts" className="report-section">
            <div className="section-head">
              <h2>موقعیت‌ها</h2>
            </div>
            <div className="context-grid">
              <article className="dash-card">
                <h3>کار گروهی</h3>
                <p>{report.groupBehavior}</p>
              </article>
              <article className="dash-card">
                <h3>موقعیت دشوار</h3>
                <p>{report.difficulty}</p>
              </article>
              <article className="dash-card">
                <h3>یادگیری و تجربه تازه</h3>
                <p>{report.learning}</p>
              </article>
            </div>
          </section>
        </>
      )}

      <section id="balance" className="report-section">
        <div className="split">
          <section className="dash-card dash-card-positive">
            <h2>امکان‌های محتمل</h2>
            {report.strengths.length > 0 ? (
              <ul className="insight-list">
                {report.strengths.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            ) : (
              <p>نمره‌ها به اندازه کافی از مرکز مقیاس فاصله نگرفته‌اند که امکانی از آن‌ها استخراج شود.</p>
            )}
          </section>
          <section className="dash-card dash-card-caution">
            <h2>دشواری‌های محتمل</h2>
            {report.challenges.length > 0 ? (
              <ul className="insight-list">
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

      <section id="suggestions" className="report-section dash-card dash-card-focus">
        <h2>برای خودشناسی</h2>
        <ol className="suggestion-steps">
          {report.suggestions.map((item, index) => (
            <li key={item}>
              <span className="step-index">{fa(index + 1)}</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
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
