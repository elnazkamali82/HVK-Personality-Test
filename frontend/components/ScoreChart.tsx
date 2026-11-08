import { fa } from "@/lib/format";
import type { DomainScore } from "@/lib/scoring";

export function ScoreChart({ domains }: { domains: DomainScore[] }) {
  return (
    <div>
      {domains.map((domain) => (
        <div className="score-row" key={domain.id}>
          <div className="score-head">
            <div>
              <strong>{domain.name}</strong>
              <div className="muted">{domain.brief}</div>
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
            aria-label={`${domain.name}: ${fa(domain.index)} از ۱۰۰، میانگین ${fa(domain.mean, 2)} از ۵`}
          >
            <span className="bar-fill" style={{ width: `${domain.index}%` }} />
            <span className="bar-mid" />
          </div>
          <div className="muted">میانگین {fa(domain.mean, 2)} از ۵</div>
        </div>
      ))}
      <p className="muted">
        خط نارنجی مرکز مقیاس پاسخ است. ۵۰ در این نمودار میانگین جامعه نیست.
      </p>
    </div>
  );
}
