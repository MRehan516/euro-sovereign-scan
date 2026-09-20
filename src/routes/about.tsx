import { createFileRoute, Link } from "@tanstack/react-router";

import { Page, PageHeader, Prose, SectionTitle } from "@/components/ui/page";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About SovereignGate" },
      {
        name: "description",
        content:
          "Who builds SovereignGate, why it exists, and an honest account of what the tool can and cannot tell you.",
      },
      { property: "og:title", content: "About SovereignGate" },
      {
        property: "og:description",
        content:
          "Who builds SovereignGate, why it exists, and an honest account of what the tool can and cannot tell you.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="About"
        title="Built because the question kept coming up and nobody had a quick answer"
        intro="SovereignGate is an independent side project by a small group of European software and infrastructure practitioners who kept being asked the same question by clients, boards and procurement teams."
      />

      <Prose>
        <p>
          The question was always some version of: <em>how dependent are we, actually?</em> Everyone had an
          instinct — usually &ldquo;quite dependent&rdquo; — and nobody had a number, a list, or a defensible
          method. Answering it properly meant a consulting engagement, several weeks and a bill. Answering it
          badly meant a slide with three logos on it. SovereignGate exists to fill the gap in between: a
          five-minute, transparent, arguable first pass that anyone in the organisation can run before the
          serious work starts.
        </p>
        <p>
          We built it around three principles. The method is published rather than hidden behind a
          proprietary score, so you can disagree with a specific weight and still use the output. The tool
          asks for nothing but a list of software names — no account, no integration, no access to your
          systems. And every recommendation names a concrete European alternative that actually exists and is
          in production somewhere, rather than telling you to &ldquo;consider sovereign options&rdquo;.
        </p>

        <SectionTitle>Scope and limitations, stated plainly</SectionTitle>
        <p>
          The reference dataset is curated by hand. It currently covers the tools we see most often in European
          companies — cloud and hosting, email and productivity, AI assistants, communications, CRM, payments,
          analytics, HR, finance and support — and it will grow over time. If a tool you use is not in it, the
          scan will say so explicitly and exclude it from the score rather than guess.
        </p>
        <p>
          Risk weights are informed judgements, not measurements. Two careful people can reasonably disagree
          about whether a particular provider deserves 0.65 or 0.75, and that disagreement will move your
          score by a few points. What the score is good at is ranking: telling you which dependency deserves
          attention first, and roughly how large the gap is between your current posture and a European one.
        </p>
        <p>
          SovereignGate is a decision-support tool. It is not legal advice, it is not a regulatory
          certification, and the certificate it issues is a point-in-time self-assessment record rather than an
          accredited audit result. It cannot see your contracts, your data processing agreements, your key
          management, or whether a tool is self-hosted in your own datacentre. Any consequential decision
          should involve your data protection officer, your security lead and qualified counsel.
        </p>
        <p>
          Corrections and additions to the dataset are the most useful thing you can send us. If a jurisdiction
          is wrong, an ownership structure has changed, or a European alternative deserves to be listed, we
          want to know — the value of the tool is entirely in the quality of that dataset.
        </p>
        <p>
          <Link to="/scoring" className="font-semibold text-accent underline underline-offset-4">
            Read the full scoring methodology
          </Link>{" "}
          or{" "}
          <Link to="/privacy" className="font-semibold text-accent underline underline-offset-4">
            see exactly what we store
          </Link>
          .
        </p>
      </Prose>
    </Page>
  );
}
