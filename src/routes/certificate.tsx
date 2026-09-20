import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Loader2, Printer, ShieldCheck } from "lucide-react";

import { Page, PageHeader } from "@/components/ui/page";
import { generateReport } from "@/lib/scan.functions";
import { setScanReport, useScanSession } from "@/lib/scan-store";
import { scoreBand } from "@/lib/scoring";

export const Route = createFileRoute("/certificate")({
  head: () => ({
    meta: [
      { title: "AI Assurance Report & Certificate — SovereignGate" },
      {
        name: "description",
        content:
          "Your written sovereignty assurance report with three priority migrations, plus an exportable Digital Sovereignty Assurance Certificate.",
      },
      { property: "og:title", content: "AI Assurance Report & Certificate — SovereignGate" },
      {
        property: "og:description",
        content:
          "Your written sovereignty assurance report with three priority migrations, plus an exportable Digital Sovereignty Assurance Certificate.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CertificatePage,
});

function CertificatePage() {
  const session = useScanSession();
  const result = session?.result ?? null;
  const report = session?.report ?? null;
  const [pending, setPending] = useState(false);
  const started = useRef(false);
  const write = useServerFn(generateReport);

  useEffect(() => {
    if (!result || report || started.current || result.matched.length === 0) return;
    started.current = true;
    const cancelled = false;
    setPending(true);
    write({
      data: {
        score: result.score,
        tools: result.matched.map((t) => ({
          tool_name: t.tool_name,
          category: t.category,
          jurisdiction: t.jurisdiction,
          eu_alternative: t.eu_alternative,
          risk: t.risk,
        })),
        categories: result.categories.map((c) => ({ category: c.category, score: c.score })),
      },
    })
      .then((res) => {
        if (!cancelled) setScanReport(res.report);
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          toast.error(error instanceof Error ? error.message : "The report could not be generated.");
        }
      })
      .finally(() => {
        if (!cancelled) setPending(false);
      });
  }, [result, report, write]);

  if (!result || result.matched.length === 0) {
    return (
      <Page>
        <PageHeader
          eyebrow="Assurance report"
          title="No scan in this session yet"
          intro="Your report and certificate are generated from a live scan. Run one and you will be brought straight back here."
        />
        <Link
          to="/scan"
          className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-[15px] font-semibold text-accent-foreground transition-opacity hover:opacity-90"
        >
          Run a scan
        </Link>
      </Page>
    );
  }

  const band = scoreBand(result.score);
  const issued = new Date(result.createdAt);
  const reference = (result.submissionId ?? "local-session").slice(0, 8).toUpperCase();
  const highRisk = result.matched.filter((t) => t.risk === "high").length;

  return (
    <Page>
      <PageHeader
        eyebrow="Assurance report"
        title="Your AI assurance report"
        intro="Written from the tools you listed, the jurisdictions they sit in and the weight each category carries in the score."
      />

      <section className="surface-card p-8">
        {pending && !report ? (
          <p className="flex items-center gap-3 text-body text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Writing your assurance report…
          </p>
        ) : report ? (
          <div className="max-w-3xl space-y-4 text-body text-foreground/85">
            {report.split(/\n{2,}/).map((para, i) => (
              <p key={i} className="whitespace-pre-line">
                {para.trim()}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-body text-muted-foreground">
            The report is not available right now. Your score, breakdown and certificate below remain valid —
            you can retry by running the scan again.
          </p>
        )}
      </section>

      <h2 className="mt-14 mb-4 font-display text-[30px] leading-tight font-semibold">
        Digital Sovereignty Assurance Certificate
      </h2>

      <article
        id="certificate"
        className="relative rounded-xl border-[3px] border-primary bg-surface p-10 shadow-sm print:border-2 print:shadow-none"
      >
        <div className="pointer-events-none absolute inset-3 rounded-lg border border-border" />
        <div className="relative text-center">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-accent text-accent">
            <ShieldCheck className="size-7" />
          </span>
          <p className="eyebrow mt-5">SovereignGate</p>
          <h3 className="mt-2 font-display text-[32px] leading-tight font-semibold text-foreground">
            Digital Sovereignty Assurance Certificate
          </h3>
          <p className="mx-auto mt-4 max-w-xl text-body text-muted-foreground">
            This certifies that the software inventory submitted under the reference below was assessed
            against the SovereignGate jurisdiction reference dataset and the published scoring rubric.
          </p>

          <div className="mx-auto mt-8 grid max-w-2xl gap-6 border-y border-border py-7 sm:grid-cols-3">
            <div>
              <p className="text-meta tracking-widest text-muted-foreground">SESSION REFERENCE</p>
              <p className="mt-1 text-[21px] font-bold">SG-{reference}</p>
            </div>
            <div>
              <p className="text-meta tracking-widest text-muted-foreground">SOVEREIGNTY SCORE</p>
              <p className="mt-1 font-display text-[32px] leading-none font-semibold">{result.score}/100</p>
              <p className="text-meta text-muted-foreground">{band.label}</p>
            </div>
            <div>
              <p className="text-meta tracking-widest text-muted-foreground">ISSUED</p>
              <p className="mt-1 text-[21px] font-bold">{issued.toLocaleDateString("en-GB")}</p>
              <p className="text-meta text-muted-foreground">
                {issued.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })} local time
              </p>
            </div>
          </div>

          <p className="mx-auto mt-7 max-w-2xl text-body text-foreground/85">
            {result.matched.length} tools were assessed across{" "}
            {result.categories.map((c) => c.category).join(", ")}.{" "}
            {highRisk > 0
              ? `${highRisk} ${highRisk === 1 ? "tool carries" : "tools carry"} high third-country exposure and should be prioritised for migration.`
              : "No assessed tool carries high third-country exposure."}{" "}
            This certificate records a point-in-time self-assessment and is decision-support, not a regulatory
            certification or legal advice.
          </p>

          <p className="mt-8 text-meta tracking-widest text-muted-foreground">
            ISSUED BY SOVEREIGNGATE · REFERENCE DATASET REVISION 2026.1
          </p>
        </div>
      </article>

      <div className="mt-6 flex flex-wrap gap-3 print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3 text-[15px] font-semibold text-accent-foreground transition-opacity hover:opacity-90"
        >
          <Printer className="size-4" />
          Download as PDF
        </button>
        <Link
          to="/scan"
          className="inline-flex items-center gap-2 rounded-md border border-border bg-surface px-6 py-3 text-[15px] font-semibold text-foreground hover:border-accent hover:text-accent"
        >
          Run another scan
        </Link>
      </div>
      <p className="mt-3 text-meta text-muted-foreground print:hidden">
        Choose “Save as PDF” as the destination in your browser&apos;s print dialog.
      </p>
    </Page>
  );
}
