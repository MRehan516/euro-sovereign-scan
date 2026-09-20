# Sovereign Shield

Build a web app called "SovereignGate" — an AI Digital Sovereignty Assurance tool for European companies.

DESIGN SYSTEM (do not use generic Lovable defaults — this must look intentional and distinctive):

- Light theme only.

- Color palette: deep ink-navy (#0B1E3D) for primary text and headers, a single confident accent color of cobalt-electric blue (#2454FF) for primary actions and key data highlights, a warm off-white background (#F7F5F0 — not pure white, not gray), and a muted sage-green (#4C7A6D) as a secondary accent used only for "positive/compliant" states. Use a warning amber (#B8752B) only for medium-risk states and a muted brick-red (#A83A32) only for high-risk states — never bright red.

- Typography: headline font is a distinctive serif (e.g. "Fraunces" or "Newsreader" from Google Fonts) for H1/H2 only, to feel authoritative and European rather than generic startup-sans. Body text and UI elements use a clean grotesk sans (e.g. "Inter" or "Manrope"). Type scale must clearly step down by section: H1 ~40-48px, H2 ~28-32px, H3 ~20-22px, body ~16px, small/meta text ~13px. Never use the same font size for a heading and its body copy.

- Layout: persistent left sidebar (not a top navbar) with sections: Home, Run a Scan, My Certificate, How Scoring Works, About, Privacy Policy. Sidebar has clear active-state highlighting, icons next to each label, and collapses to icon-only on smaller screens.

- No placeholder text, no lorem ipsum, no "Company Name" or "Lorem" anywhere — every page must ship with real, finished, professional copy about SovereignGate itself.

PAGES TO BUILD, FULLY COMPLETE, NO STUBS:

1. HOME / LANDING PAGE

   - Hero headline explaining the product in one sentence, subheadline explaining the mechanism (score + AI report + certificate), a single clear "Run a Free Scan" call-to-action button.

   - A three-step "How it works" section (List your tools → Get your score → Get your certificate) with icons.

   - A section citing why this matters, referencing that most European cloud infrastructure is run by non-EU hyperscalers and that the EU is actively legislating on cloud/AI sovereignty (write real, non-generic supporting copy — do not invent specific statistics, phrase it qualitatively).

   - Footer with links to About and Privacy Policy.

2. "RUN A SCAN" PAGE

   - A clean input where the user can type or paste a comma-separated list of tools their company uses (e.g. "AWS, Slack, Google Workspace, HubSpot").

   - A "Run Assurance Scan" button.

   - On submit, matches each tool against a reference dataset and shows: (a) an overall Sovereignty Score out of 100 as a large, clear radial/gauge visual, (b) a category breakdown (Cloud, Email, AI/LLM, Communications, CRM) as a horizontal bar chart, (c) a visible, readable explanation of the scoring formula (state the weights plainly, do not hide the math), (d) a per-tool list showing each tool, its detected jurisdiction, its risk level (color-coded using the palette above), and its suggested EU alternative.

3. AI ASSURANCE REPORT / CERTIFICATE PAGE

   - After the scan, show a generated narrative report explaining, in plain language, the top 3 priority migrations and why, in the voice of a calm expert advisor — not a generic chatbot.

   - Display a formal "Digital Sovereignty Assurance Certificate" card: company/session identifier, score, date/time, and a short summary — styled like a real certificate (border, seal-style icon, serif headline), with a "Download as PDF" or "Export" action.

4. "HOW SCORING WORKS" PAGE

   - A fully written, non-generic explanation of the scoring rubric: what categories are weighted, why jurisdiction and data sensitivity matter, and a plain-language explanation connecting this to real EU sovereignty policy concepts (assurance levels based on control over infrastructure, data processing, and third-country exposure) — written as original explanatory copy, not copied text.

5. ABOUT PAGE

   - A real, finished paragraph explaining who built this, why, and the honest scope/limitations of the tool (e.g., "reference dataset is curated and will grow over time; this is a decision-support tool, not legal advice").

6. PRIVACY POLICY PAGE

   - A complete, real privacy policy appropriate for a tool that accepts a list of company tool names and may log anonymous submissions: what data is collected (the tool list, timestamp), that no personal or account data is required, that no data is sold or shared with third parties, and how someone can request their submission be deleted. Full, finished text — not a placeholder.

BACKEND:

- Use Supabase. Create a `tools_reference` table (tool_name, category, jurisdiction, eu_alternative, risk_weight, source_note) and a `submissions` table (id, submitted_tools, computed_score, created_at).

- Create a server-side Edge Function that takes the matched-tool payload and calls an LLM API to generate the narrative report — the API key must live server-side only, never in frontend code.

- The scoring logic must be real, computed from the matched database rows every time — never a static/fixed number.

Do not generate any fake "example results" pre-filled on the page. The scan should be genuinely empty/interactive until a real user runs it.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://euro-sovereign-scan.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0159001c-0945-4684-acd4-1009a817a2a0).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
