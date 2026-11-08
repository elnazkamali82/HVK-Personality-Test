import { fa } from "@/lib/format";
import type { DomainScore } from "@/lib/scoring";

const SIZE = 320;
const CENTER = SIZE / 2;
const RADIUS = 112;

function polar(index: number, total: number, value: number) {
  const angle = (-Math.PI / 2) + (index / total) * Math.PI * 2;
  const r = (value / 100) * RADIUS;
  return {
    x: CENTER + Math.cos(angle) * r,
    y: CENTER + Math.sin(angle) * r,
  };
}

function ringPath(level: number, total: number) {
  return Array.from({ length: total }, (_, index) => {
    const point = polar(index, total, level);
    return `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`;
  }).join(" ") + " Z";
}

export function RadarChart({ domains }: { domains: DomainScore[] }) {
  const total = domains.length;
  const points = domains.map((domain, index) => polar(index, total, domain.index));
  const area = points
    .map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ") + " Z";

  return (
    <div className="radar-wrap">
      <svg
        className="radar-svg"
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        role="img"
        aria-label="نمودار رادار پنج عامل شخصیت"
      >
        <defs>
          <linearGradient id="radarFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00b3a8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#1d6a9a" stopOpacity="0.28" />
          </linearGradient>
        </defs>
        {[25, 50, 75, 100].map((level) => (
          <path key={level} className="radar-ring" d={ringPath(level, total)} />
        ))}
        {domains.map((_, index) => {
          const tip = polar(index, total, 100);
          return (
            <line
              key={`axis-${index}`}
              className="radar-axis"
              x1={CENTER}
              y1={CENTER}
              x2={tip.x}
              y2={tip.y}
            />
          );
        })}
        <path className="radar-area" d={area} />
        {points.map((point, index) => (
          <circle
            key={domains[index].id}
            className="radar-point"
            cx={point.x}
            cy={point.y}
            r="5"
          >
            <title>
              {domains[index].name}: {fa(domains[index].index)} از ۱۰۰
            </title>
          </circle>
        ))}
        {domains.map((domain, index) => {
          const label = polar(index, total, 128);
          return (
            <text
              key={`label-${domain.id}`}
              className="radar-label"
              x={label.x}
              y={label.y}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {domain.name}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
