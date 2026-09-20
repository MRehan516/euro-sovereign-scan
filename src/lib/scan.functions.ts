import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";

import { computeScan, normaliseToolList, type ScanResult, type ToolRow } from "./scoring";

function serverSupabase() {
  const url = process.env["SUPABASE_URL"]!;
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const ScanInput = z.object({ tools: z.string().min(1).max(2000) });

export const runScan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ScanInput.parse(input))
  .handler(async ({ data }): Promise<ScanResult> => {
    const inputs = normaliseToolList(data.tools);
    if (inputs.length === 0) throw new Error("Please enter at least one tool.");

    const supabase = serverSupabase();
    const { data: rows, error } = await supabase
      .from("tools_reference")
      .select("tool_name, category, jurisdiction, eu_alternative, risk_weight, source_note");

    if (error) throw new Error("The reference dataset could not be read. Please try again.");

    const result = computeScan(inputs, (rows ?? []) as unknown as ToolRow[]);

    let submissionId: string | null = null;
    if (result.matched.length > 0) {
      const id = crypto.randomUUID();
      const { error: insertError } = await supabase
        .from("submissions")
        .insert({ id, submitted_tools: inputs, computed_score: result.score });
      if (!insertError) submissionId = id;
    }

    return { ...result, submissionId, createdAt: new Date().toISOString() };
  });

const ReportInput = z.object({
  score: z.number(),
  tools: z.array(
    z.object({
      tool_name: z.string(),
      category: z.string(),
      jurisdiction: z.string(),
      eu_alternative: z.string(),
      risk: z.string(),
    }),
  ),
  categories: z.array(z.object({ category: z.string(), score: z.number() })),
});

export const generateReport = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ReportInput.parse(input))
  .handler(async ({ data }): Promise<{ report: string }> => {
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("The report service is not configured.");

    const prompt = [
      `Overall sovereignty score: ${data.score}/100.`,
      `Category scores: ${data.categories.map((c) => `${c.category} ${c.score}/100`).join(", ")}.`,
      "Tool inventory:",
      ...data.tools.map(
        (t) =>
          `- ${t.tool_name} (${t.category}), jurisdiction ${t.jurisdiction}, ${t.risk} risk, EU alternative: ${t.eu_alternative}`,
      ),
      "",
      "Write a digital sovereignty assurance report for this European company.",
      "Structure: one short opening paragraph assessing the overall posture, then exactly three numbered priority migrations,",
      "each with a short heading and two to four sentences explaining what to move, why it matters legally and operationally,",
      "and what a realistic first step looks like. Close with one short paragraph on what is already working well.",
      "Voice: a calm, senior European advisor. No bullet lists of buzzwords, no invented statistics, no legal advice claims,",
      "no chatbot pleasantries, no markdown headings beyond the numbered items. Plain prose, around 350 words.",
    ].join("\n");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
        "X-Lovable-AIG-SDK": "fetch",
      },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        input: prompt,
        stream: true,
        reasoning: { effort: "low", summary: "auto" },
      }),
    });

    if (!res.ok || !res.body) {
      if (res.status === 429) throw new Error("The report service is busy. Please try again in a moment.");
      if (res.status === 402) throw new Error("AI credits are exhausted for this workspace.");
      throw new Error("The report could not be generated right now.");
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let text = "";

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data:")) continue;
        const payload = line.slice(5).trim();
        if (!payload || payload === "[DONE]") continue;
        try {
          const evt = JSON.parse(payload) as {
            type?: string;
            delta?: string;
            response?: { output_text?: string };
          };
          if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
            text += evt.delta;
          } else if (evt.type === "response.completed" && evt.response?.output_text && !text) {
            text = evt.response.output_text;
          }
        } catch {
          // ignore keep-alive and non-JSON frames
        }
      }
    }

    if (!text.trim()) throw new Error("The report came back empty. Please try again.");
    return { report: text.trim() };
  });
