import { scoreBand, type RiskLevel } from "@/lib/scoring";

const TONE_VAR: Record<RiskLevel, string> = {
  low: "var(--sage)",
  medium: "var(--amber)",
  high: "var(--brick)",
};

export function ScoreGauge({ score, size = 220 }: { score: number; size?: number }) {
  const band = scoreBand(score);
  const stroke = 16;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = (Math.min(Math.max(score, 0), 100) / 100) * c;
  const color = TONE_VAR[band.tone];

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Sovereignty score ${score} out of 100`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontSize={size * 0.3}
          fontWeight={600}
          fill="var(--foreground)"
        >
          {score}
        </text>
        <text
          x="50%"
          y="64%"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize={13}
          letterSpacing={2}
          fill="var(--muted-foreground)"
        >
          OUT OF 100
        </text>
      </svg>
      <span
        className="mt-4 rounded-full px-4 py-1.5 text-meta font-bold tracking-wide"
        style={{ backgroundColor: `color-mix(in oklab, ${color} 14%, transparent)`, color }}
      >
        {band.label.toUpperCase()}
      </span>
    </div>
  );
}
