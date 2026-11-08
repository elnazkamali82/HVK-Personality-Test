"use client";

import { useMemo, useState } from "react";
import { DomainScoreRow, ScoreChart } from "@/components/ScoreChart";
import { RadarChart } from "@/components/RadarChart";
import { fa } from "@/lib/format";
import type { FunMatch, FunReport, Report } from "@/lib/interpret";
import type { DomainScore, Pole } from "@/lib/scoring";

type Mode = "dashboard" | "details";

const POLE_LABEL: Record<Pole, string> = {
  high: "متمایل به بالا",
  low: "متمایل به پایین",
  mid: "نزدیک مرکز",
};

export function ProfileReport({
  report,
  eyebrow,
  title,
  source = "llm",
}: {
  report: Report;
  eyebrow: string;
  title: string;
  source?: "llm" | "local";
}) {
  const peak = useMemo(() => {
    return [...report.domains].sort((a, b) => b.index - a.index)[0];
  }, [report.domains]);

  const [mode, setMode] = useState<Mode>("dashboard");
  const [activeId, setActiveId] = useState<string>(peak?.id ?? report.domains[0]?.id ?? "E");
  const leaning = report.domains.filter((domain) => domain.pole !== "mid");

  const activeScore = useMemo(
    () => report.domains.find((d) => d.id === activeId) ?? report.domains[0],
    [report.domains, activeId],
  );
  const activeText = useMemo(
    () => report.domainTexts.find((d) => d.id === activeId) ?? report.domainTexts[0],
    [report.domainTexts, activeId],
  );

  return (
    <article className="report report-dashboard">
      <header className="report-head">
        <p className="kicker">{eyebrow}</p>
        <h1>{title}</h1>
      </header>

      <div className="report-toolbar no-print">
        <div className="report-mode" role="group" aria-label="حالت نمایش گزارش">
          <button
            type="button"
            aria-pressed={mode === "dashboard"}
            onClick={() => setMode("dashboard")}
          >
            داشبورد
          </button>
          <button
            type="button"
            aria-pressed={mode === "details"}
            onClick={() => setMode("details")}
          >
            جزئیات نمره
          </button>
        </div>
      </div>

      {mode === "dashboard" ? (
        <div className="dashboard-view">
          <section className="dashboard-board" aria-label="ابعاد شخصیت">
            <div className="dashboard-radar">
              <RadarChart
                domains={report.domains}
                activeId={activeId}
                onSelect={setActiveId}
              />
            </div>

            <div className="dashboard-dims">
              {report.domains.map((domain) => (
                <DomainTile
                  key={domain.id}
                  domain={domain}
                  active={domain.id === activeId}
                  onSelect={() => setActiveId(domain.id)}
                />
              ))}
            </div>
          </section>

          {peak && (
            <p className="dashboard-peak muted">
              بالاترین بعد در این نیمرخ: <strong>{peak.name}</strong> ({fa(peak.index)} از ۱۰۰)
            </p>
          )}

          <section
            className={`ai-answer${source === "local" ? " ai-answer-local" : ""}`}
            aria-label="پاسخ تحلیل هوش مصنوعی"
          >
            <div className="ai-answer-banner">
              <span className="ai-answer-badge">
                {source === "llm" ? "پاسخ هوش مصنوعی" : "تفسیر محلی"}
              </span>
              <p className="ai-answer-banner-text">
                {source === "llm"
                  ? "روایت شخصی نیمرخ تو، از روی نمره‌هایت."
                  : "سرویس نوشتاری در دسترس نبود؛ متن جایگزین محلی."}
              </p>
            </div>

            <FunPanel fun={report.fun} embedded />

            <div className="ai-answer-block ai-answer-overview">
              <p className="kicker">روایت نیمرخ</p>
              <h2>خوانش کلی</h2>
              <p className="ai-answer-lead">{report.overview}</p>
            </div>

            {activeScore && activeText && (
              <div className="ai-answer-block dashboard-focus" aria-live="polite">
                <div className="dashboard-focus-head">
                  <div>
                    <p className="kicker">خوانش بُعد</p>
                    <h2>{activeText.name}</h2>
                    <p className="muted">{activeScore.brief}</p>
                  </div>
                  <div className="dashboard-focus-score">
                    <strong>{fa(activeScore.index)}</strong>
                    <span>از ۱۰۰</span>
                    <span className={`pole-chip pole-chip-${activeScore.pole}`}>
                      {POLE_LABEL[activeScore.pole]}
                    </span>
                  </div>
                </div>
                <div
                  className="bar dashboard-focus-bar"
                  dir="ltr"
                  role="img"
                  aria-label={`${activeScore.name}: ${fa(activeScore.index)} از ۱۰۰`}
                >
                  <span
                    className={`bar-fill bar-fill-${activeScore.pole}`}
                    style={{ width: `${activeScore.index}%` }}
                  />
                  <span className="bar-mid" title="مرکز مقیاس پاسخ" />
                </div>
                <p className="dashboard-focus-copy ai-answer-copy">{activeText.text}</p>
              </div>
            )}
          </section>

          <div className="report-secondary">
            <p className="report-secondary-label muted">تحلیل‌های تکمیلی</p>

            {(report.strengths.length > 0 || report.challenges.length > 0) && (
              <section className="report-section analysis-balance">
                <div className="split">
                  {report.strengths.length > 0 && (
                    <section className="panel panel-quiet">
                      <h2>امکان‌های محتمل</h2>
                      <ul>
                        {report.strengths.slice(0, 3).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  )}
                  {report.challenges.length > 0 && (
                    <section className="panel panel-quiet">
                      <h2>دشواری‌های محتمل</h2>
                      <ul>
                        {report.challenges.slice(0, 3).map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </section>
                  )}
                </div>
              </section>
            )}

            <section className="report-section suggestion-list suggestion-list-quiet">
              <h2>پیشنهادها</h2>
              <ul className="plain-list">
                {report.suggestions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      ) : (
        <div className="details-view">
          <section id="overview" className="report-hero report-section">
            <h2>نمره‌ها</h2>
            <ScoreChart domains={report.domains} />
          </section>

          <section id="domains" className="report-section">
            <h2>پنج عامل</h2>
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

          <FunPanel fun={report.fun} embedded={false} />

          <details className="report-limits">
            <summary>حد این گزارش</summary>
            <p>
              جمله‌هایی که از فاصله تا مرکز مقیاس ساخته شده‌اند قاعده نگارش همین نسخه‌اند، نه آستانه کم و
              متوسط و زیاد در جامعه. نمره زیرعامل نمایش داده نمی‌شود، چون هر زیرعامل فقط دو گویه دارد و
              برای قضاوت درباره یک نفر ناپایدار است. خودتوصیفی هم تحت تأثیر حال همان روز، مطلوب‌نمایی و دقت
              حافظه است.
            </p>
          </details>
        </div>
      )}
    </article>
  );
}

function FunPanel({ fun, embedded = false }: { fun: FunReport; embedded?: boolean }) {
  const cards: Array<{ label: string; match: FunMatch }> = [
    { label: "همزاد جانوری", match: fun.animal },
    { label: "نقش روی پرده", match: fun.character },
    { label: "غذای تو", match: fun.food },
    { label: "مسیر شغلی", match: fun.career },
    { label: "جای زندگی", match: fun.place },
  ];

  return (
    <section
      className={`fun-panel report-section${embedded ? " fun-panel-embedded" : ""}`}
      aria-label="همزاد تو در جهان"
    >
      <div className="fun-panel-head">
        <h2>همزاد تو در جهان</h2>
        <p className="fun-voice">{fun.voice}</p>
      </div>
      <div className="fun-grid">
        {cards.map((card) => (
          <article className="fun-card" key={card.label}>
            <p className="fun-card-label">{card.label}</p>
            <h3>{card.match.name}</h3>
            <p>{card.match.why}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function DomainTile({
  domain,
  active,
  onSelect,
}: {
  domain: DomainScore;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`domain-tile domain-tile-${domain.pole}${active ? " is-active" : ""}`}
      onClick={onSelect}
      aria-pressed={active}
    >
      <div className="domain-tile-top">
        <strong>{domain.name}</strong>
        <span className="domain-tile-score">{fa(domain.index)}</span>
      </div>
      <div
        className="bar domain-tile-bar"
        dir="ltr"
        aria-hidden="true"
      >
        <span
          className={`bar-fill bar-fill-${domain.pole}`}
          style={{ width: `${domain.index}%` }}
        />
        <span className="bar-mid" />
      </div>
      <span className={`pole-chip pole-chip-${domain.pole}`}>{POLE_LABEL[domain.pole]}</span>
    </button>
  );
}
