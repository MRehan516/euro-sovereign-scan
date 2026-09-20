CREATE TABLE public.tools_reference (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  jurisdiction TEXT NOT NULL,
  eu_alternative TEXT NOT NULL,
  risk_weight NUMERIC(3,2) NOT NULL,
  source_note TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.tools_reference TO anon;
GRANT SELECT ON public.tools_reference TO authenticated;
GRANT ALL ON public.tools_reference TO service_role;

ALTER TABLE public.tools_reference ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reference dataset is publicly readable"
ON public.tools_reference FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submitted_tools TEXT[] NOT NULL,
  computed_score INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT INSERT ON public.submissions TO anon;
GRANT INSERT ON public.submissions TO authenticated;
GRANT ALL ON public.submissions TO service_role;

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone may log an anonymous submission"
ON public.submissions FOR INSERT TO anon, authenticated WITH CHECK (true);

INSERT INTO public.tools_reference (tool_name, category, jurisdiction, eu_alternative, risk_weight, source_note) VALUES
('AWS','Cloud','United States','OVHcloud / Scaleway',0.90,'US-headquartered hyperscaler; parent company subject to the US CLOUD Act.'),
('Amazon Web Services','Cloud','United States','OVHcloud / Scaleway',0.90,'US-headquartered hyperscaler; parent company subject to the US CLOUD Act.'),
('Microsoft Azure','Cloud','United States','IONOS Cloud / Open Telekom Cloud',0.90,'US-headquartered hyperscaler; EU regions do not remove third-country legal reach.'),
('Azure','Cloud','United States','IONOS Cloud / Open Telekom Cloud',0.90,'US-headquartered hyperscaler; EU regions do not remove third-country legal reach.'),
('Google Cloud','Cloud','United States','Scaleway / Exoscale',0.90,'US-headquartered hyperscaler; control plane operated by a US parent.'),
('GCP','Cloud','United States','Scaleway / Exoscale',0.90,'US-headquartered hyperscaler; control plane operated by a US parent.'),
('DigitalOcean','Cloud','United States','Hetzner Cloud',0.75,'US provider with EU datacentres but US corporate control.'),
('Cloudflare','Cloud','United States','Bunny.net (SI) / Fastly EU edge',0.65,'US provider; global edge network with US corporate control.'),
('Vercel','Cloud','United States','Netlify EU regions / Scaleway Serverless',0.75,'US platform provider built on US hyperscaler infrastructure.'),
('Netlify','Cloud','United States','Scaleway Serverless',0.70,'US platform provider.'),
('Heroku','Cloud','United States','Clever Cloud (FR)',0.80,'US platform owned by Salesforce, running on AWS.'),
('OVHcloud','Cloud','France','Already EU-sovereign',0.05,'French provider; infrastructure and corporate control inside the EU.'),
('Scaleway','Cloud','France','Already EU-sovereign',0.05,'French provider, part of Iliad Group.'),
('Hetzner','Cloud','Germany','Already EU-sovereign',0.05,'German provider with DE/FI datacentres.'),
('Hetzner Cloud','Cloud','Germany','Already EU-sovereign',0.05,'German provider with DE/FI datacentres.'),
('IONOS','Cloud','Germany','Already EU-sovereign',0.05,'German provider, part of United Internet.'),
('Exoscale','Cloud','Switzerland','Scaleway / OVHcloud for strict EU-only',0.25,'Swiss provider; adequacy decision in place but outside the EU legal order.'),
('UpCloud','Cloud','Finland','Already EU-sovereign',0.05,'Finnish provider with EU datacentres.'),
('Elastx','Cloud','Sweden','Already EU-sovereign',0.05,'Swedish provider focused on sovereign hosting.'),
('Gmail','Email','United States','Infomaniak Mail (CH) / mailbox.org (DE)',0.85,'US-operated mailbox service; content processed under US corporate control.'),
('Google Workspace','Email','United States','Infomaniak kSuite / OpenDesk',0.85,'US productivity suite covering mail, docs and storage.'),
('Microsoft 365','Email','United States','OpenDesk / Nextcloud + mailbox.org',0.85,'US productivity suite; several EU public bodies have raised sovereignty concerns.'),
('Outlook','Email','United States','mailbox.org / Infomaniak Mail',0.85,'US-operated mailbox service.'),
('Mailchimp','Email','United States','Brevo (FR) / Mailjet (FR)',0.75,'US marketing email platform holding contact data.'),
('SendGrid','Email','United States','Brevo (FR) / Mailjet (FR)',0.75,'US transactional email provider owned by Twilio.'),
('Brevo','Email','France','Already EU-sovereign',0.05,'French email and marketing platform.'),
('Mailjet','Email','France','Already EU-sovereign',0.10,'French email platform, part of Sinch.'),
('Proton Mail','Email','Switzerland','Tuta (DE) for strict EU-only',0.20,'Swiss provider with strong encryption; outside the EU legal order.'),
('Tutanota','Email','Germany','Already EU-sovereign',0.05,'German encrypted mail provider.'),
('Tuta','Email','Germany','Already EU-sovereign',0.05,'German encrypted mail provider.'),
('mailbox.org','Email','Germany','Already EU-sovereign',0.05,'German business mail provider.'),
('OpenAI','AI/LLM','United States','Mistral AI (FR) / Aleph Alpha (DE)',0.90,'US model provider; prompts and outputs processed under US jurisdiction.'),
('ChatGPT','AI/LLM','United States','Mistral Le Chat (FR)',0.90,'US assistant product; staff often paste internal content into it.'),
('Anthropic','AI/LLM','United States','Mistral AI (FR)',0.90,'US model provider.'),
('Claude','AI/LLM','United States','Mistral Le Chat (FR)',0.90,'US assistant product.'),
('Google Gemini','AI/LLM','United States','Mistral AI (FR) / Aleph Alpha (DE)',0.90,'US model provider.'),
('Copilot','AI/LLM','United States','Mistral Codestral (FR) / Continue with EU-hosted models',0.85,'US coding assistant processing source code.'),
('GitHub Copilot','AI/LLM','United States','Mistral Codestral (FR)',0.85,'US coding assistant processing source code.'),
('Mistral AI','AI/LLM','France','Already EU-sovereign',0.05,'French model provider with EU-hosted inference.'),
('Mistral','AI/LLM','France','Already EU-sovereign',0.05,'French model provider with EU-hosted inference.'),
('Aleph Alpha','AI/LLM','Germany','Already EU-sovereign',0.05,'German model provider focused on sovereign deployments.'),
('Hugging Face','AI/LLM','United States','Self-hosted models on EU infrastructure',0.55,'US-incorporated with French roots; self-hosting reduces exposure.'),
('Slack','Communications','United States','Element / Matrix (EU-hosted) / Rocket.Chat (DE)',0.85,'US messaging platform owned by Salesforce; full message history stored.'),
('Microsoft Teams','Communications','United States','Element / Nextcloud Talk',0.85,'US collaboration platform.'),
('Zoom','Communications','United States','Whereby (NO) / Visio (FR) / Jitsi on EU hosting',0.80,'US meeting platform.'),
('Google Meet','Communications','United States','Whereby (NO) / Nextcloud Talk',0.80,'US meeting platform.'),
('Discord','Communications','United States','Element / Matrix (EU-hosted)',0.85,'US consumer messaging platform.'),
('WhatsApp','Communications','United States','Threema (CH) / Wire (DE)',0.80,'US-owned messenger; metadata processed by Meta.'),
('Element','Communications','European Union','Already EU-sovereign',0.10,'Matrix-based messaging widely deployed by EU public administrations.'),
('Matrix','Communications','European Union','Already EU-sovereign',0.10,'Open protocol; sovereignty depends on where the homeserver runs.'),
('Rocket.Chat','Communications','Germany','Already EU-sovereign',0.15,'Self-hostable team messaging with EU hosting options.'),
('Nextcloud Talk','Communications','Germany','Already EU-sovereign',0.05,'German self-hosted collaboration suite.'),
('Threema','Communications','Switzerland','Wire (DE) for strict EU-only',0.20,'Swiss messenger; outside the EU legal order.'),
('Wire','Communications','Germany','Already EU-sovereign',0.10,'German secure messaging provider.'),
('Whereby','Communications','Norway','Already EEA-sovereign',0.10,'Norwegian meeting provider inside the EEA.'),
('HubSpot','CRM','United States','Efficy (BE) / Odoo (BE)',0.85,'US CRM holding customer and prospect records.'),
('Salesforce','CRM','United States','Efficy (BE) / SuiteCRM on EU hosting',0.85,'US CRM holding customer and pipeline data.'),
('Pipedrive','CRM','Estonia','Already EU-sovereign',0.25,'Estonian-founded CRM, now under US private-equity ownership.'),
('Zoho CRM','CRM','India','Efficy (BE) / Odoo (BE)',0.65,'Indian provider; third country without an EU adequacy decision.'),
('Odoo','CRM','Belgium','Already EU-sovereign',0.05,'Belgian business suite with EU hosting.'),
('Efficy','CRM','Belgium','Already EU-sovereign',0.05,'Belgian CRM vendor.'),
('SuiteCRM','CRM','United Kingdom','Odoo (BE) / Efficy (BE)',0.35,'UK open-source CRM; self-hosting in the EU removes most exposure.'),
('Notion','Productivity','United States','Nextcloud (DE) / Outline on EU hosting',0.80,'US workspace tool often holding internal documentation.'),
('Airtable','Productivity','United States','Baserow (NL) / NocoDB',0.80,'US database-as-a-workspace tool.'),
('Dropbox','Productivity','United States','Nextcloud (DE) / Infomaniak kDrive (CH)',0.80,'US file storage provider.'),
('Google Drive','Productivity','United States','Nextcloud (DE) / kDrive (CH)',0.85,'US file storage provider.'),
('Nextcloud','Productivity','Germany','Already EU-sovereign',0.05,'German self-hosted file and collaboration platform.'),
('Baserow','Productivity','Netherlands','Already EU-sovereign',0.05,'Dutch open-source database platform.'),
('Jira','Productivity','Australia','OpenProject (DE) / Tuleap (FR)',0.60,'Australian vendor hosting largely on US hyperscaler infrastructure.'),
('Asana','Productivity','United States','OpenProject (DE)',0.75,'US work management platform.'),
('Trello','Productivity','Australia','OpenProject (DE) / Kanboard',0.60,'Australian vendor, Atlassian-owned.'),
('GitHub','Productivity','United States','GitLab self-hosted (EU) / Codeberg (DE)',0.75,'US code hosting owned by Microsoft.'),
('GitLab','Productivity','United States','GitLab self-managed on EU infrastructure',0.55,'US-incorporated; self-managed EU deployment is materially lower risk.'),
('Stripe','Payments','United States','Mollie (NL) / Adyen (NL)',0.70,'US payments provider processing transaction data.'),
('PayPal','Payments','United States','Mollie (NL) / Adyen (NL)',0.70,'US payments provider.'),
('Mollie','Payments','Netherlands','Already EU-sovereign',0.05,'Dutch payment service provider.'),
('Adyen','Payments','Netherlands','Already EU-sovereign',0.05,'Dutch payment service provider.'),
('Klarna','Payments','Sweden','Already EU-sovereign',0.10,'Swedish payments provider.'),
('Google Analytics','Analytics','United States','Matomo (DE/FR) / Plausible (EE)',0.85,'US analytics service; several EU DPAs have challenged its use.'),
('Matomo','Analytics','Germany','Already EU-sovereign',0.05,'German analytics platform, self-hostable.'),
('Plausible','Analytics','Estonia','Already EU-sovereign',0.05,'Estonian privacy-focused analytics, EU-hosted.'),
('Mixpanel','Analytics','United States','Matomo (DE/FR)',0.80,'US product analytics provider.'),
('Amplitude','Analytics','United States','Matomo (DE/FR) / PostHog EU Cloud',0.80,'US product analytics provider.'),
('PostHog','Analytics','United States','PostHog EU Cloud / self-hosted in the EU',0.45,'US company offering an EU-hosted cloud region.'),
('Personio','HR','Germany','Already EU-sovereign',0.05,'German HR platform.'),
('Workday','HR','United States','Personio (DE) / HR Works (DE)',0.80,'US HR platform holding employee records.'),
('BambooHR','HR','United States','Personio (DE)',0.80,'US HR platform holding employee records.'),
('DATEV','Finance','Germany','Already EU-sovereign',0.05,'German accounting and payroll cooperative.'),
('QuickBooks','Finance','United States','DATEV (DE) / Pennylane (FR)',0.75,'US accounting platform.'),
('Xero','Finance','New Zealand','DATEV (DE) / Pennylane (FR)',0.65,'New Zealand provider; third country with adequacy.'),
('Pennylane','Finance','France','Already EU-sovereign',0.05,'French accounting platform.'),
('Zendesk','Support','United States','Crisp (FR) / Zammad (DE)',0.80,'US support desk holding customer conversations.'),
('Intercom','Support','United States','Crisp (FR)',0.80,'US support and messaging platform.'),
('Crisp','Support','France','Already EU-sovereign',0.05,'French customer messaging platform.'),
('Zammad','Support','Germany','Already EU-sovereign',0.05,'German open-source helpdesk.');