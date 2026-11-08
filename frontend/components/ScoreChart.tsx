import { fa } from "@/lib/format";
import type { DomainScore, Pole } from "@/lib/scoring";

const POLE_LABEL: Record<Pole, string> = {
  high: "متمایل به بالا",
  low: "متمایل به پایین",
  mid: "نزدیک مرکز",
};

export function DomainScoreRow({
  domain,
  compact = false,
}: {
  domain: DomainScore;
  compact?: boolean;
}) {
  return (
    <div className={compact ? "score-row score-row-compact" : "score-row"}>
      <div className="score-head">
        <div>
          <strong>{domain.name}</strong>
          {!compact && <div className="muted">{domain.brief}</div>}
          <div className="score-meta">
            <span className={`pole-chip pole-chip-${domain.pole}`}>{POLE_LABEL[domain.pole]}</span>
            {!compact && (
              <span className="muted">میانگین {fa(domain.mean, 2)} از ۵</span>
            )}
          </div>
        </div>
        <p className="score-num">
          <strong>{fa(domain.index)}</strong>
          <span className="muted"> از ۱۰۰</span>
        </p>
      </div>
      <div
        className="bar"
        dir="ltr"
        role="img"
        aria-label={`${domain.name}: ${fa(domain.index)} از ۱۰۰، ${POLE_LABEL[domain.pole]}، میانگین ${fa(domain.mean, 2)} از ۵`}
      >
        <span
          className={`bar-fill bar-fill-${domain.pole}`}
          style={{ width: `${domain.index}%` }}
        />
        <span className="bar-mid" title="مرکز مقیاس پاسخ، نه میانگین جامعه" />
      </div>
    </div>
  );
}

export function ScoreChart({ domains }: { domains: DomainScore[] }) {
  return (
    <div>
      {domains.map((domain) => (
        <DomainScoreRow key={domain.id} domain={domain} />
      ))}
      <p className="muted">
        خط نارنجی‌فام مرکز مقیاس پاسخ است. ۵۰ در این نمودار میانگین جامعه نیست.
      </p>
    </div>
  );
}
