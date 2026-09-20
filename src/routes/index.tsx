import { createFileRoute, Link } from "@tanstack/react-router";
import { ListChecks, Gauge, Stamp, ArrowRight, Scale, Server, Brain } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SovereignGate — Score your stack for EU digital sovereignty" },
      {
        name: "description",
        content:
          "List the tools your company uses and get a sovereignty score out of 100, an AI assurance report and a formal certificate.",
      },
      { property: "og:title", content: "SovereignGate — Score your stack for EU digital sovereignty" },
      {
        property: "og:description",
        content:
          "List the tools your company uses and get a sovereignty score out of 100, an AI assurance report and a formal certificate.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const STEPS = [
  {
    icon: ListChecks,
    title: "List your tools",
    body: "Type or paste the software your company actually runs on — cloud, email, AI assistants, messaging, CRM. No account, no connection to your systems.",
  },
  {
    icon: Gauge,
    title: "Get your score",
    body: "Each tool is matched against our curated jurisdiction dataset and weighted by category to produce a sovereignty score out of 100, with the maths shown in full.",
  },
  {
    icon: Stamp,
    title: "Get your certificate",
    body: "Receive a written assurance report naming your three priority migrations, plus a dated certificate you can export and circulate internally.",
  },
];

function Home() {
  return (
    <>
      <main>
        <section className="border-b border-border bg-surface px-6 py-20 lg:px-16 lg:py-28">
          <div className="mx-auto w-full max-w-4xl">
            <p className="eyebrow">Digital sovereignty assurance</p>
            <h1 className="mt-4 font-display text-[40px] leading-[1.05] font-semibold text-foreground lg:text-[48px]">
              Find out how much of your company runs on infrastructure you don&apos;t control.
            </h1>
            <p className="mt-6 max-w-2xl text-[18px] leading-relaxed text-muted-foreground">
              SovereignGate reads the list of tools your team uses, scores your exposure to non-EU
              jurisdictions out of 100, writes a plain-language assurance report on what to migrate first, and
              issues a dated Digital Sovereignty Assurance Certificate.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                to="/scan"
                className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3.5 text-[15px] font-semibold text-accent-foreground transition-opacity hover:opacity-90"
              >
                Run a Free Scan
                <ArrowRight className="size-4" />
              </Link>
              <Link
                to="/scoring"
                className="text-[15px] font-semibold text-foreground underline underline-offset-4 hover:text-accent"
              >
                See how the score is calculated
              </Link>
            </div>
          </div>
        </section>

        <section className="px-6 py-16 lg:px-16 lg:py-20">
          <div className="mx-auto w-full max-w-5xl">
            <h2 className="font-display text-[30px] leading-tight font-semibold">How it works</h2>
            <p className="mt-3 max-w-2xl text-body text-muted-foreground">
              Three steps, no integration, no sales call. A scan takes under a minute.
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <div key={step.title} className="surface-card p-6">
                  <span className="flex size-10 items-center justify-center rounded-md bg-accent-soft text-accent">
                    <step.icon className="size-5" />
                  </span>
                  <p className="mt-5 text-meta font-bold tracking-widest text-muted-foreground">
                    STEP {i + 1}
                  </p>
                  <h3 className="mt-1 text-[21px] font-bold">{step.title}</h3>
                  <p className="mt-2 text-body text-muted-foreground">{step.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-surface px-6 py-16 lg:px-16 lg:py-20">
          <div className="mx-auto grid w-full max-w-5xl gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="eyebrow">Why this matters now</p>
              <h2 className="mt-3 font-display text-[30px] leading-tight font-semibold">
                Sovereignty stopped being a philosophical question and became a procurement question.
              </h2>
              <div className="mt-5 space-y-4 text-body text-muted-foreground">
                <p>
                  The overwhelming majority of European companies run their core operations — compute, mail,
                  documents, customer records and now their AI assistants — on platforms headquartered outside
                  the European Union. Choosing an EU datacentre region does not change who ultimately controls
                  the company operating it, nor which legal orders that company must answer to.
                </p>
                <p>
                  European institutions and national regulators are actively legislating and consulting on this
                  exact gap: cloud certification and assurance levels, rules on where data is processed and by
                  whom, obligations around switching providers and portability, and an emerging expectation
                  that high-sensitivity AI workloads should be traceable to infrastructure under European
                  control. The direction of travel is consistent even where the final texts are not yet settled.
                </p>
                <p>
                  Boards, public-sector buyers and enterprise customers are already asking suppliers to state
                  their position. Having an honest, dated answer is cheaper than improvising one during a
                  tender or an audit.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {[
                {
                  icon: Server,
                  title: "Infrastructure control",
                  body: "Who owns and operates the machines, the control plane and the keys — not merely where the rack sits.",
                },
                {
                  icon: Scale,
                  title: "Third-country exposure",
                  body: "Which non-EU legal orders can compel access to your data through the provider's parent company.",
                },
                {
                  icon: Brain,
                  title: "AI processing",
                  body: "Where prompts, documents and source code go the moment an employee pastes them into an assistant.",
                },
              ].map((item) => (
                <div key={item.title} className="surface-card flex gap-4 p-5">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md bg-sage-soft text-sage">
                    <item.icon className="size-4" />
                  </span>
                  <div>
                    <h3 className="text-[19px] font-bold">{item.title}</h3>
                    <p className="mt-1 text-body text-muted-foreground">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-16 lg:px-16">
          <div className="surface-card mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-6 p-8">
            <div>
              <h2 className="font-display text-[30px] leading-tight font-semibold">
                Get your score in about a minute.
              </h2>
              <p className="mt-2 text-body text-muted-foreground">
                Nothing is connected to your systems. You paste a list of tool names, we do the rest.
              </p>
            </div>
            <Link
              to="/scan"
              className="inline-flex items-center gap-2 rounded-md bg-accent px-6 py-3.5 text-[15px] font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              Run a Free Scan
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-surface px-6 py-10 lg:px-16">
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-4">
          <p className="text-meta text-muted-foreground">
            SovereignGate — decision-support for European teams. Not legal advice.
          </p>
          <nav className="flex gap-6 text-meta font-semibold">
            <Link to="/about" className="hover:text-accent">
              About
            </Link>
            <Link to="/privacy" className="hover:text-accent">
              Privacy Policy
            </Link>
            <Link to="/scoring" className="hover:text-accent">
              How Scoring Works
            </Link>
          </nav>
        </div>
      </footer>
    </>
  );
}
