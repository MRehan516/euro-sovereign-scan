export type RiskLevel = "low" | "medium" | "high";

export type ToolRow = {
  tool_name: string;
  category: string;
  jurisdiction: string;
  eu_alternative: string;
  risk_weight: number;
  source_note: string;
};

export type MatchedTool = ToolRow & {
  input: string;
  risk: RiskLevel;
  toolScore: number;
};

export type CategoryResult = {
  category: string;
  weight: number;
  score: number;
  toolCount: number;
};

export type ScanResult = {
  submissionId: string | null;
  score: number;
  createdAt: string;
  matched: MatchedTool[];
  unmatched: string[];
  categories: CategoryResult[];
};

export const CATEGORY_WEIGHTS: Record<string, number> = {
  Cloud: 0.3,
  "AI/LLM": 0.25,
  Email: 0.15,
  Communications: 0.15,
  CRM: 0.15,
};

export const OTHER_CATEGORY_WEIGHT = 0.1;

export const SCORED_CATEGORIES = ["Cloud", "Email", "AI/LLM", "Communications", "CRM"];

export function riskLevel(weight: number): RiskLevel {
  if (weight >= 0.7) return "high";
  if (weight >= 0.35) return "medium";
  return "low";
}

export function riskLabel(level: RiskLevel): string {
  return level === "high" ? "High risk" : level === "medium" ? "Medium risk" : "Low risk";
}

export function normaliseToolList(raw: string): string[] {
  return Array.from(
    new Set(
      raw
        .split(/[,\n;]+/)
        .map((t) => t.trim())
        .filter((t) => t.length > 0)
        .map((t) => t.replace(/\s+/g, " ")),
    ),
  ).slice(0, 40);
}

export function computeScan(inputs: string[], rows: ToolRow[]): Omit<ScanResult, "submissionId" | "createdAt"> {
  const index = new Map(rows.map((r) => [r.tool_name.toLowerCase(), r]));

  const matched: MatchedTool[] = [];
  const unmatched: string[] = [];

  for (const input of inputs) {
    const row = index.get(input.toLowerCase());
    if (!row) {
      unmatched.push(input);
      continue;
    }
    const weight = Number(row.risk_weight);
    matched.push({
      ...row,
      risk_weight: weight,
      input,
      risk: riskLevel(weight),
      toolScore: Math.round((1 - weight) * 100),
    });
  }

  const byCategory = new Map<string, MatchedTool[]>();
  for (const tool of matched) {
    const key = SCORED_CATEGORIES.includes(tool.category) ? tool.category : "Other";
    const list = byCategory.get(key) ?? [];
    list.push(tool);
    byCategory.set(key, list);
  }

  const present = Array.from(byCategory.entries()).map(([category, tools]) => {
    const weight = CATEGORY_WEIGHTS[category] ?? OTHER_CATEGORY_WEIGHT;
    const avgRisk = tools.reduce((sum, t) => sum + t.risk_weight, 0) / tools.length;
    return {
      category,
      weight,
      score: Math.round((1 - avgRisk) * 100),
      toolCount: tools.length,
    };
  });

  const weightSum = present.reduce((sum, c) => sum + c.weight, 0);
  const score =
    weightSum === 0 ? 0 : Math.round(present.reduce((sum, c) => sum + c.score * c.weight, 0) / weightSum);

  const order = [...SCORED_CATEGORIES, "Other"];
  present.sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));

  return { score, matched, unmatched, categories: present };
}

export function scoreBand(score: number): { label: string; tone: RiskLevel } {
  if (score >= 70) return { label: "Assured", tone: "low" };
  if (score >= 40) return { label: "Exposed", tone: "medium" };
  return { label: "Critically exposed", tone: "high" };
}
