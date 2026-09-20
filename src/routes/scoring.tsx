import { createFileRoute, Link } from "@tanstack/react-router";

import { Page, PageHeader, Prose, SectionTitle, SubTitle } from "@/components/ui/page";
import { CATEGORY_WEIGHTS, OTHER_CATEGORY_WEIGHT } from "@/lib/scoring";

export const Route = createFileRoute("/scoring")({
  head: () => ({
    meta: [
      { title: "How the Sovereignty Score Works — SovereignGate" },
      {
        name: "description",
        content:
          "The full SovereignGate rubric: risk weights, category weights, why jurisdiction and data sensitivity matter, and how bands are set.",
      },
      { property: "og:title", content: "How the Sovereignty Score Works — SovereignGate" },
      {
        property: "og:description",
        content:
          "The full SovereignGate rubric: risk weights, category weights, why jurisdiction and data sensitivity matter, and how bands are set.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ScoringPage,
});

function ScoringPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="Methodology"
        title="How scoring works"
        intro="A sovereignty score is only useful if you can argue with it. Here is the whole rubric: what we weigh, why we weigh it that way, and where the judgement calls sit."
      />

      <Prose>
        <SubTitle>The unit of measurement is a tool, not a vendor promise</SubTitle>
        <p>
          Every entry in our reference dataset carries a risk weight between 0.05 and 0.95. That number is a
          judgement about how much of the tool&apos;s control sits outside the European Union: who owns the
          operating company, who runs the control plane and the encryption keys, where the processing actually
          happens, and which legal orders can reach the provider regardless of the datacentre address. A tool
          scores <strong>(1 − risk weight) × 100</strong>. A German self-hosted platform scores 95; a US
          hyperscaler scores 10.
        </p>
        <p>
          We deliberately do not treat &ldquo;has an EU region&rdquo; as sovereignty. A region is a location;
          sovereignty is about control. A provider incorporated in a third country can be compelled through its
          parent entity even when the bytes never leave Frankfurt. Conversely, an open-source tool from outside
          the EU that you host yourself on European infrastructure scores far better, because you hold the
          operational control.
        </p>

        <SectionTitle>Category weights</SectionTitle>
        <p>
          Not every dependency carries the same consequence. Losing access to a project-tracking tool is
          disruptive; losing control of your compute layer or your model provider is existential. The overall
          score is a weighted average of the categories present in your list:
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
          Cloud carries the most weight because everything else usually runs on top of it: migrating your CRM
          is meaningless if the CRM is hosted on the same infrastructure you were trying to leave. AI and large
          language models come second because they are the newest and least governed flow of internal content
          out of the organisation — contracts, code and customer records are pasted into assistants daily by
          people who never went through a procurement review. Email, communications and CRM share the
          remainder: each holds a durable archive of who your company talks to and what it says.
        </p>
        <p>
          Categories absent from your list are simply not counted, and the remaining weights are renormalised
          to sum to 100%. A company that lists only cloud and AI tools is scored on cloud and AI, not penalised
          for silence.
        </p>

        <SectionTitle>Why jurisdiction and data sensitivity matter</SectionTitle>
        <p>
          Jurisdiction determines who can lawfully compel disclosure, who can change the terms under which you
          operate, and who you can realistically litigate against. A provider under EU or EEA control answers
          to legal orders your own counsel can read and your own regulator supervises. A provider controlled
          from a third country answers to at least two — and the one you did not sign is the one that can
          override your contract. That is why our dataset records the jurisdiction of corporate control rather
          than the marketing location of a region.
        </p>
        <p>
          Data sensitivity is the multiplier. The same provider is a mild dependency when it stores a public
          marketing site and a serious one when it processes payroll, patient data, legal files or unpublished
          source code. The category weights are our proxy for that: the categories that typically carry the
          most sensitive content are weighted most heavily. Where a country sits outside the EU but under an
          adequacy decision — Switzerland, Norway, New Zealand and others — we score it better than an
          unmitigated third country, but not as well as EU control, because adequacy is a political
          determination that can be revisited.
        </p>

        <SectionTitle>How this connects to European sovereignty policy</SectionTitle>
        <p>
          European policy on cloud and AI keeps converging on the same three questions, whatever the specific
          instrument: who controls the infrastructure, who performs and supervises the data processing, and how
          much exposure exists to third-country law. Assurance frameworks in this space are typically expressed
          as levels rather than a pass or fail — a basic level concerned with technical security, a
          substantial level adding operational and contractual guarantees, and a high level that additionally
          requires immunity from non-EU legal reach for the most critical workloads.
        </p>
        <p>
          Our score is designed to sit alongside that thinking rather than imitate a formal certification. A
          score of 70 or above means most of your weighted stack is under European control and you could
          credibly argue a high-assurance posture for your critical systems. A score between 40 and 69 means
          your operations depend materially on providers outside the EU legal order — usually manageable, but
          you should know exactly which ones and why. Below 40 means the question is no longer about residual
          risk but about whether your organisation could continue operating if a key provider relationship
          changed on terms you do not control.
        </p>

        <SectionTitle>What the score deliberately does not do</SectionTitle>
        <p>
          It does not read your systems, inspect contracts, or examine your data processing agreements. It does
          not know whether you encrypt with your own keys, whether you negotiated EU-only processing terms, or
          whether a given deployment is self-hosted. Those factors can move a real assessment substantially in
          either direction. Treat the output as a prioritised starting point for a conversation with your DPO,
          your CISO and your counsel — not as a compliance verdict.
        </p>
        <p>
          <Link to="/scan" className="font-semibold text-accent underline underline-offset-4">
            Run a scan
          </Link>{" "}
          to see the rubric applied to your own stack, with every intermediate number visible.
        </p>
      </Prose>
    </Page>
  );
}
