import { createFileRoute } from "@tanstack/react-router";

import { Page, PageHeader, Prose, SectionTitle } from "@/components/ui/page";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — SovereignGate" },
      {
        name: "description",
        content:
          "What SovereignGate collects when you run a scan, how long it is kept, who it is shared with, and how to have a submission deleted.",
      },
      { property: "og:title", content: "Privacy Policy — SovereignGate" },
      {
        property: "og:description",
        content:
          "What SovereignGate collects when you run a scan, how long it is kept, who it is shared with, and how to have a submission deleted.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <Page>
      <PageHeader
        eyebrow="Privacy"
        title="Privacy Policy"
        intro="Last updated 20 September 2026. A tool about data sovereignty has no business being vague about its own data handling, so this policy is short and specific."
      />

      <Prose>
        <SectionTitle>What we collect</SectionTitle>
        <p>
          When you run an assurance scan we store one record containing two things: the list of tool names you
          submitted, exactly as you typed it, and the numeric score computed from it, together with the
          timestamp of the submission. Nothing else is written to our database.
        </p>
        <p>
          We do not ask for and do not store your name, email address, company name, IP address, account
          credentials or payment details. There is no sign-up, no login and no user profile. Your score,
          report and certificate live in your browser&apos;s session storage and disappear when you close the
          tab.
        </p>

        <SectionTitle>Why we keep it</SectionTitle>
        <p>
          Stored submissions serve one purpose: improving the reference dataset. Seeing which tool names people
          enter — particularly ones we fail to match — tells us what to add next. Aggregate patterns may inform
          general, non-identifying statements about common dependency categories. Submissions are never used to
          profile a company or an individual, and because we hold no identifiers, we could not do so.
        </p>

        <SectionTitle>A note of caution on what you type</SectionTitle>
        <p>
          Please enter product names only. Do not paste internal hostnames, project codenames, customer names,
          credentials or any text containing personal data. If a submission does reach us containing personal
          data, we will delete it as soon as we become aware of it.
        </p>

        <SectionTitle>The report generation step</SectionTitle>
        <p>
          When you request the written assurance report, the matched tool names, their recorded jurisdictions
          and your category scores are sent to a large language model provider to produce the narrative text.
          Only that derived information is sent — never your raw input text, and never anything identifying
          you. The request is made from our server, not from your browser, and the provider is not permitted to
          use the content to train models. If you would rather not use this step, you can stop after the scan:
          the score, the breakdown and the per-tool findings are computed entirely on our own systems.
        </p>

        <SectionTitle>Who we share it with</SectionTitle>
        <p>
          Nobody. We do not sell data, we do not share it with advertisers, data brokers or partners, and we do
          not run third-party advertising or tracking scripts on this site. Our database and application
          hosting providers process data solely on our instructions as processors. We would disclose data only
          where legally compelled — and given what we hold, such a disclosure would consist of a list of
          software product names and a number.
        </p>

        <SectionTitle>How long we keep it</SectionTitle>
        <p>
          Submission records are retained for up to 24 months and then deleted. We may retain aggregate,
          non-reversible statistics derived from them beyond that period.
        </p>

        <SectionTitle>Having your submission deleted</SectionTitle>
        <p>
          Every scan produces a session reference shown on your certificate in the form SG-XXXXXXXX. Email that
          reference to <strong>privacy@sovereigngate.eu</strong> with the subject line &ldquo;Deletion
          request&rdquo; and we will delete the corresponding record and confirm within 30 days. No further
          proof is required, because the reference is the only link back to the submission. If you no longer
          have the reference, tell us the approximate date and the tool list you submitted and we will locate
          and remove any matching record.
        </p>

        <SectionTitle>Your rights</SectionTitle>
        <p>
          Where any of the data we hold constitutes personal data under the GDPR, you have the rights of
          access, rectification, erasure, restriction, objection and portability, and the right to lodge a
          complaint with your national supervisory authority. Because we collect no identifiers, we will
          usually need the session reference above to act on such a request. Contact us at{" "}
          <strong>privacy@sovereigngate.eu</strong>.
        </p>

        <SectionTitle>Changes to this policy</SectionTitle>
        <p>
          If we change what we collect or how we use it, we will update this page and the date at the top. We
          will not retroactively apply a broader use to submissions already stored under an earlier version of
          this policy.
        </p>
      </Prose>
    </Page>
  );
}
