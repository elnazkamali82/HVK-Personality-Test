import { fa } from "@/lib/format";
import type { DomainScore } from "@/lib/scoring";

const SIZE = 280;
const CX = SIZE / 2;
const CY = SIZE / 2;
const MAX_R = 92;
const RINGS = [20, 40, 60, 80, 100];

function polar(r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CX + r * Math.cos(rad),
    y: CY + r * Math.sin(rad),
  };
}

function ringPath(r: number, count: number) {
  return (
    Array.from({ length: count }, (_, i) => {
      const p = polar((r / 100) * MAX_R, (360 / count) * i);
      return `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    }).join(" ") + " Z"
  );
}

function polygonPoints(values: number[], count: number) {
  return values
    .map((value, i) => {
      const clamped = Math.max(0, Math.min(100, value));
      const p = polar((clamped / 100) * MAX_R, (360 / count) * i);
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    })
    .join(" ");
}

export function RadarChart({
  domains,
  activeId,
  onSelect,
}: {
  domains: DomainScore[];
  activeId?: string | null;
  onSelect?: (id: string) => void;
}) {
  const count = domains.length;
  if (count < 3) return null;

  const values = domains.map((d) => d.index);

  return (
    <div className="radar-wrap">
      <div className="radar-stage">
        <svg
          className="radar"
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label="نمودار پنج‌بعدی نیمرخ شخصیت"
        >
          {RINGS.map((ring) => (
            <path
              key={ring}
              className={`radar-ring${ring === 50 ? " radar-ring-mid" : ""}`}
              d={ringPath(ring, count)}
            />
          ))}
          {domains.map((_, i) => {
            const tip = polar(MAX_R, (360 / count) * i);
            return (
              <line
                key={`axis-${i}`}
                className="radar-axis"
                x1={CX}
                y1={CY}
                x2={tip.x}
                y2={tip.y}
              />
            );
          })}
          <polygon className="radar-area" points={polygonPoints(values, count)} />
          {domains.map((domain, i) => {
            const tip = polar((domain.index / 100) * MAX_R, (360 / count) * i);
            const active = activeId === domain.id;
            return (
              <circle
                key={domain.id}
                className={`radar-dot radar-dot-${domain.pole}${active ? " is-active" : ""}`}
                cx={tip.x}
                cy={tip.y}
                r={active ? 6.5 : 5}
              />
            );
          })}
        </svg>

        {domains.map((domain, i) => {
          const label = polar(MAX_R + 28, (360 / count) * i);
          const active = activeId === domain.id;
          const style = {
            left: `${(label.x / SIZE) * 100}%`,
            top: `${(label.y / SIZE) * 100}%`,
          } as const;

          if (!onSelect) {
            return (
              <span key={domain.id} className="radar-label is-static" style={style}>
                <span>{domain.name}</span>
                <strong>{fa(domain.index)}</strong>
              </span>
            );
          }

          return (
            <button
              key={domain.id}
              type="button"
              className={`radar-label${active ? " is-active" : ""}`}
              style={style}
              onClick={() => onSelect(domain.id)}
              aria-pressed={active}
            >
              <span>{domain.name}</span>
              <strong>{fa(domain.index)}</strong>
            </button>
          );
        })}
      </div>
      <p className="radar-note muted">حلقه کهربایی ≈ مرکز مقیاس پاسخ (۵۰)، نه میانگین جامعه</p>
    </div>
  );
}
