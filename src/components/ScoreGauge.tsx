import { useEffect, useState } from "react";
import { scoreBand, type RiskLevel } from "@/lib/scoring";

const TONE_VAR: Record<RiskLevel, string> = {
  low: "var(--sage)",
  medium: "var(--amber)",
  high: "var(--brick)",
};

export function ScoreGauge({ score, size = 300 }: { score: number; size?: number }) {
  const band = scoreBand(score);
  const stroke = Math.round(size * 0.055);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const clamped = Math.min(Math.max(score, 0), 100);
  const target = (clamped / 100) * c;
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    // Double rAF so the zero-dash state paints first, then transitions in.
    const frame = requestAnimationFrame(() =>
      requestAnimationFrame(() => setDrawn(true)),
    );
    return () => cancelAnimationFrame(frame);
  }, []);

  const dash = drawn ? target : 0;
  const color = TONE_VAR[band.tone];

  return (
    <div
      className="flex flex-col items-center"
      style={{ animation: "gauge-enter 500ms ease-out both" }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`Sovereignty score ${score} out of 100`}
      >
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
          style={{ transition: "stroke-dasharray 900ms cubic-bezier(0.22, 1, 0.36, 1)" }}
        />
        <text
          x="50%"
          y="48%"
          textAnchor="middle"
          fontFamily="var(--font-display)"
          fontSize={size * 0.28}
          fontWeight={600}
          fill="var(--foreground)"
          style={{ opacity: drawn ? 1 : 0, transition: "opacity 500ms ease-out 300ms" }}
        >
          {score}
        </text>
        <text
          x="50%"
          y="64%"
          textAnchor="middle"
          fontFamily="var(--font-sans)"
          fontSize={Math.max(11, size * 0.045)}
          letterSpacing={2}
          fill="var(--muted-foreground)"
          style={{ opacity: drawn ? 1 : 0, transition: "opacity 500ms ease-out 400ms" }}
        >
          OUT OF 100
        </text>
      </svg>
      <span
        className="mt-4 rounded-full px-4 py-1.5 text-meta font-bold tracking-wide"
        style={{
          backgroundColor: `color-mix(in oklab, ${color} 14%, transparent)`,
          color,
          opacity: drawn ? 1 : 0,
          transition: "opacity 500ms ease-out 550ms",
        }}
      >
        {band.label.toUpperCase()}
      </span>
    </div>
  );
}
