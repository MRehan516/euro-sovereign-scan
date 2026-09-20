import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";

import { Page, PageHeader } from "@/components/ui/page";
import { ScoreGauge } from "@/components/ScoreGauge";
import { runScan } from "@/lib/scan.functions";
import { setScanResult, useScanSession } from "@/lib/scan-store";
import { CATEGORY_WEIGHTS, OTHER_CATEGORY_WEIGHT, riskLabel, type RiskLevel } from "@/lib/scoring";

export const Route = createFileRoute("/scan")({
  head: () => ({
    meta: [
      { title: "Run a Sovereignty Scan — SovereignGate" },
      {
        name: "description",
        content:
          "Paste the tools your company uses and get a live sovereignty score, category breakdown and per-tool jurisdiction analysis.",
      },
      { property: "og:title", content: "Run a Sovereignty Scan — SovereignGate" },
      {
        property: "og:description",
        content:
          "Paste the tools your company uses and get a live sovereignty score, category breakdown and per-tool jurisdiction analysis.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScanPage,
});

const RISK_STYLE: Record<RiskLevel, string> = {
  low: "bg-sage-soft text-sage",
  medium: "bg-amber-soft text-amber",
  high: "bg-brick-soft text-brick",
};

const BAR_COLOR: Record<RiskLevel, string> = {
  low: "var(--sage)",
  medium: "var(--amber)",
  high: "var(--brick)",
};

function barTone(score: number): RiskLevel {
  if (score >= 70) return "low";
  if (score >= 40) return "medium";
  return "high";
}

function ScanPage() {
  const session = useScanSession();
  const result = session?.result ?? null;
  const [value, setValue] = useState("");
  const [pending, setPending] = useState(false);
  const scan = useServerFn(runScan);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || pending) return;
    setPending(true);
    try {
      const res = await scan({ data: { tools: value } });
      setScanResult(res);
      if (res.matched.length === 0) {
        toast.error("None of those tools are in the reference dataset yet.");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "The scan could not be completed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Page>
      <PageHeader
        eyebrow="Assurance scan"
        title="Run an assurance scan"
        intro="Type or paste a comma-separated list of the tools your company uses. Each one is matched against our jurisdiction reference dataset and scored live — nothing is pre-filled and nothing is connected to your systems."
      />

      <form onSubmit={onSubmit} className="surface-card p-6">
        <label htmlFor="tools" className="block text-[15px] font-semibold text-foreground">
          Your tool stack
        </label>
        <p className="mt-1 text-meta text-muted-foreground">
          For example: AWS, Slack, Google Workspace, HubSpot, ChatGPT
        </p>
        <textarea
          id="tools"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          placeholder="AWS, Slack, Google Workspace, HubSpot"
          className="mt-4 w-full resize-y rounded-md border border-input bg-background px-4 py-3 text-body text-foreground outline-none placeholder:text-muted-foreground/70 focus:border-accent focus:ring-2 focus:ring-accent/25"
        />
        <button
          type="submit"
          disabled={pending || value.trim().length === 0}
          className="mt-4 inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-[15px] font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : null}
          {pending ? "Scoring your stack…" : "Run Assurance Scan"}
        </button>
      </form>

      {result ? (
        <div className="mt-12 space-y-10">
          <section className="surface-card grid gap-8 p-8 md:grid-cols-[auto_1fr] md:items-center">
            <ScoreGauge score={result.score} />
            <div>
              <h2 className="font-display text-[30px] leading-tight font-semibold">Your sovereignty score</h2>
              <p className="mt-3 text-body text-muted-foreground">
                Computed from {result.matched.length} matched{" "}
                {result.matched.length === 1 ? "tool" : "tools"} across {result.categories.length}{" "}
                {result.categories.length === 1 ? "category" : "categories"} on{" "}
                {new Date(result.createdAt).toLocaleString("en-GB")}. A higher score means more of your stack
                sits under European control.
              </p>
              {result.unmatched.length > 0 ? (
                <p className="mt-3 text-meta text-muted-foreground">
                  Not yet in the reference dataset and therefore excluded from the score:{" "}
                  {result.unmatched.join(", ")}.
                </p>
              ) : null}
              {result.matched.length > 0 ? (
                <Link
                  to="/certificate"
                  className="mt-6 inline-flex items-center gap-2 rounded-md bg-accent px-5 py-3 text-[15px] font-semibold text-accent-foreground transition-opacity hover:opacity-90"
                >
                  Generate assurance report &amp; certificate
                  <ArrowRight className="size-4" />
                </Link>
              ) : null}
            </div>
          </section>

          {result.categories.length > 0 ? (
            <section className="surface-card p-8">
              <h2 className="font-display text-[30px] leading-tight font-semibold">Category breakdown</h2>
              <p className="mt-2 text-body text-muted-foreground">
                Each bar is the average sovereignty of the tools you listed in that category.
              </p>
              <div className="mt-7 space-y-5">
                {result.categories.map((c) => {
                  const tone = barTone(c.score);
                  return (
                    <div key={c.category}>
                      <div className="flex items-baseline justify-between">
                        <span className="text-[15px] font-semibold text-foreground">{c.category}</span>
                        <span className="text-meta text-muted-foreground">
                          {c.score}/100 · weight {Math.round(c.weight * 100)}% · {c.toolCount}{" "}
                          {c.toolCount === 1 ? "tool" : "tools"}
                        </span>
                      </div>
                      <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-secondary">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${c.score}%`, backgroundColor: BAR_COLOR[tone] }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ) : null}

          <section className="surface-card p-8">
            <h2 className="font-display text-[30px] leading-tight font-semibold">The formula, in the open</h2>
            <div className="mt-4 space-y-4 text-body text-muted-foreground">
              <p>
                Every tool in the reference dataset carries a risk weight between 0.05 and 0.95, reflecting how
                much of its control plane, corporate ownership and data processing sits outside the EU. A
                tool&apos;s own score is <strong className="text-foreground">(1 − risk weight) × 100</strong>.
              </p>
              <p>
                A category score is the plain average of the tool scores you listed in that category. The
                overall score is the weighted average of the categories actually present in your list, using
                these weights:
              </p>
              <ul className="grid gap-2 sm:grid-cols-2">
                {Object.entries(CATEGORY_WEIGHTS).map(([cat, w]) => (
                  <li key={cat} className="rounded-md bg-secondary px-4 py-2 text-[15px] text-foreground">
                    {cat} — {Math.round(w * 100)}%
                  </li>
                ))}
                <li className="rounded-md bg-secondary px-4 py-2 text-[15px] text-foreground">
                  Any other category — {Math.round(OTHER_CATEGORY_WEIGHT * 100)}%
                </li>
              </ul>
              <p>
                If a category is missing from your list, its weight is not counted; the remaining weights are
                renormalised so they still sum to 100%. Tools we cannot match are listed separately and never
                silently averaged in. Bands: 70 and above is assured, 40–69 is exposed, below 40 is critically
                exposed.
              </p>
            </div>
          </section>

          {result.matched.length > 0 ? (
            <section className="surface-card overflow-hidden">
              <div className="p-8 pb-4">
                <h2 className="font-display text-[30px] leading-tight font-semibold">Tool-by-tool findings</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[820px] border-collapse text-left">
                  <thead>
                    <tr className="border-y border-border bg-secondary/60">
                      {["Tool", "Category", "Jurisdiction", "Risk", "Suggested EU alternative"].map((h) => (
                        <th key={h} className="px-6 py-3 text-meta font-bold tracking-wide text-muted-foreground">
                          {h.toUpperCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.matched.map((tool) => (
                      <tr key={tool.input} className="border-b border-border last:border-0 align-top">
                        <td className="px-6 py-4">
                          <span className="text-[15px] font-semibold text-foreground">{tool.tool_name}</span>
                          <span className="mt-1 block max-w-[22rem] text-meta text-muted-foreground">
                            {tool.source_note}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[15px] text-muted-foreground">{tool.category}</td>
                        <td className="px-6 py-4 text-[15px] text-muted-foreground">{tool.jurisdiction}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-meta font-bold ${RISK_STYLE[tool.risk]}`}
                          >
                            {riskLabel(tool.risk)}
                          </span>
                          <span className="mt-1 block text-meta text-muted-foreground">
                            {tool.toolScore}/100
                          </span>
                        </td>
                        <td className="px-6 py-4 text-[15px] text-muted-foreground">{tool.eu_alternative}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}
        </div>
      ) : null}
    </Page>
  );
}
