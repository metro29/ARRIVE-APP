import type { EventPlan } from "@/types/event-plan";
import type { DiscoverEventType, RestaurantTag } from "@/types/restaurant";
import { CUISINE_OPTIONS } from "@/types/discover";

const EVENT_KEYWORDS: { type: DiscoverEventType; patterns: RegExp[] }[] = [
  { type: "birthday", patterns: [/\bbirthday\b/, /\bbday\b/, /\bcelebration\b/] },
  { type: "corporate", patterns: [/\bcorporate\b/, /\bbusiness\b/, /\bteam\b/, /\boffice\b/, /\bclient\b/] },
  { type: "party", patterns: [/\bparty\b/, /\bwedding\b/, /\breception\b/, /\blaunch\b/] },
  { type: "date_night", patterns: [/\bdate\s*night\b/, /\bromantic\b/, /\banniversary\b/, /\bcouples?\b/] },
  { type: "dinner", patterns: [/\bdinner\b/, /\bprivate\s*dining\b/, /\bmeal\b/] },
];

const VIBE_KEYWORDS: { tag: RestaurantTag; patterns: RegExp[] }[] = [
  { tag: "luxury", patterns: [/\bluxury\b/, /\bupscale\b/, /\bfancy\b/, /\belegant\b/, /\bhigh[- ]end\b/] },
  { tag: "romantic", patterns: [/\bromantic\b/, /\bintimate\b/, /\bquiet\b/] },
  { tag: "loud", patterns: [/\bloud\b/, /\blively\b/, /\benergetic\b/, /\bfun\b/] },
  { tag: "casual", patterns: [/\bcasual\b/, /\brelaxed\b/, /\blaid[- ]back\b/] },
  { tag: "corporate", patterns: [/\bprofessional\b/, /\bcorporate\b/] },
  { tag: "nightlife", patterns: [/\bnightlife\b/, /\brooftop\b/, /\bclub\b/, /\bcocktails?\b/] },
  { tag: "family-friendly", patterns: [/\bfamily\b/, /\bkids?\b/, /\bchildren\b/] },
  { tag: "private-dining-focused", patterns: [/\bprivate\b/, /\bsemi[- ]private\b/, /\bprivate\s*room\b/] },
];

const CUISINE_KEYWORDS: { cuisine: string; patterns: RegExp[] }[] = [
  { cuisine: "Steakhouse", patterns: [/\bsteak\b/, /\bsteakhouse\b/] },
  { cuisine: "Tex-Mex", patterns: [/\btex[- ]?mex\b/, /\bmexican\b/, /\btacos?\b/] },
  { cuisine: "Seafood", patterns: [/\bseafood\b/, /\bsushi\b/, /\bfish\b/] },
  { cuisine: "Italian", patterns: [/\bitalian\b/, /\bpasta\b/] },
  { cuisine: "Wine Bar", patterns: [/\bwine\b/] },
  { cuisine: "American", patterns: [/\bamerican\b/, /\bburger\b/] },
  { cuisine: "Southern", patterns: [/\bsouthern\b/] },
  { cuisine: "Contemporary", patterns: [/\bcontemporary\b/, /\bmodern\b/] },
];

function extractGuestCount(text: string): number {
  const patterns = [
    /(?:for|with|about|around)\s+(\d{1,3})\s*(?:people|guests|pax|persons|attendees)?/i,
    /(\d{1,3})\s*(?:people|guests|pax|persons|attendees)/i,
    /group\s+of\s+(\d{1,3})/i,
    /party\s+of\s+(\d{1,3})/i,
  ];
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const n = Number(match[1]);
      if (n >= 1 && n <= 500) return n;
    }
  }
  return 8;
}

function extractEventType(text: string): DiscoverEventType {
  for (const { type, patterns } of EVENT_KEYWORDS) {
    if (patterns.some((p) => p.test(text))) return type;
  }
  return "dinner";
}

function extractVibes(text: string): RestaurantTag[] {
  const found = new Set<RestaurantTag>();
  for (const { tag, patterns } of VIBE_KEYWORDS) {
    if (patterns.some((p) => p.test(text))) found.add(tag);
  }
  return [...found];
}

function extractCuisines(text: string): string[] {
  const found = new Set<string>();
  for (const { cuisine, patterns } of CUISINE_KEYWORDS) {
    if (patterns.some((p) => p.test(text))) found.add(cuisine);
  }
  for (const cuisine of CUISINE_OPTIONS) {
    if (text.includes(cuisine.toLowerCase())) found.add(cuisine);
  }
  return [...found];
}

function extractBudgetRange(text: string): [number, number] {
  const perPerson = text.match(
    /(?:under|below|max|budget)\s*\$?\s*(\d{1,3})(?:\s*(?:per\s*person|pp|each))?/i
  );
  if (perPerson) {
    const cap = Number(perPerson[1]);
    if (cap <= 25) return [1, 2];
    if (cap <= 40) return [2, 2];
    if (cap <= 60) return [2, 3];
    if (cap <= 100) return [3, 4];
    return [4, 4];
  }

  if (/\$\$\$\$|four\s*dollar|very\s*expensive|splurge/i.test(text)) return [4, 4];
  if (/\$\$\$|upscale|fine\s*dining/i.test(text)) return [3, 4];
  if (/\$\$|moderate|mid[- ]range/i.test(text)) return [2, 3];
  if (/\$|cheap|affordable|budget/i.test(text)) return [1, 2];

  return [2, 3];
}

function extractLocation(text: string): string {
  if (/\buptown\b/i.test(text)) return "Uptown Dallas, TX";
  if (/\bdowntown\b/i.test(text)) return "Downtown Dallas, TX";
  if (/\bdeep\s*ellum\b/i.test(text)) return "Deep Ellum, Dallas, TX";
  if (/\bplano\b/i.test(text)) return "Plano, TX (Dallas area)";
  if (/\bdallas\b/i.test(text)) return "Dallas, TX";
  return "Dallas, TX";
}

function extractUrgency(text: string): EventPlan["urgency"] {
  if (/\basap\b|\burgent\b|\bthis\s*week\b|\btomorrow\b/i.test(text)) return "asap";
  if (/\bnext\s*week\b|\bsoon\b|\bupcoming\b/i.test(text)) return "soon";
  return "flexible";
}

/** Rule-based natural language → structured EventPlan (no LLM, no DB). */
export function parseEventPlan(prompt: string): EventPlan {
  const text = prompt.trim().toLowerCase();
  const guest_count = extractGuestCount(text);
  const event_type = extractEventType(text);
  const vibe = extractVibes(text);
  const cuisine_preferences = extractCuisines(text);
  const budget_range = extractBudgetRange(text);
  const location = extractLocation(text);
  const urgency = extractUrgency(text);

  if (event_type === "corporate" && !vibe.includes("corporate")) {
    vibe.push("corporate");
  }
  if (event_type === "birthday" && !vibe.includes("casual") && !vibe.includes("loud")) {
    vibe.push("casual");
  }
  if (event_type === "date_night" && !vibe.includes("romantic")) {
    vibe.push("romantic");
  }

  return {
    event_type,
    guest_count,
    budget_range,
    cuisine_preferences,
    vibe,
    location,
    urgency,
  };
}

export function validateEventPlan(plan: EventPlan): EventPlan {
  const guest_count = Math.min(500, Math.max(1, Math.round(plan.guest_count) || 8));
  const min = Math.min(4, Math.max(1, plan.budget_range[0] ?? 2));
  const max = Math.min(4, Math.max(min, plan.budget_range[1] ?? min));
  const validTypes = new Set([
    "birthday",
    "corporate",
    "party",
    "date_night",
    "dinner",
  ]);
  const event_type = validTypes.has(String(plan.event_type))
    ? (plan.event_type as DiscoverEventType)
    : "dinner";

  const validVibes = new Set([
    "luxury",
    "romantic",
    "loud",
    "casual",
    "corporate",
    "nightlife",
    "family-friendly",
    "private-dining-focused",
  ]);

  return {
    event_type,
    guest_count,
    budget_range: [min, max],
    cuisine_preferences: (plan.cuisine_preferences ?? []).slice(0, 5),
    vibe: (plan.vibe ?? []).filter((v): v is RestaurantTag =>
      validVibes.has(v)
    ),
    location: plan.location?.trim() || "Dallas, TX",
    urgency: plan.urgency || "flexible",
  };
}

export function summarizeEventPlan(plan: EventPlan): string {
  const typeLabel = String(plan.event_type).replace(/_/g, " ");
  const cuisine =
    plan.cuisine_preferences.length > 0
      ? plan.cuisine_preferences.join(", ")
      : "any cuisine";
  const vibe =
    plan.vibe.length > 0
      ? plan.vibe.map((v) => v.replace(/-/g, " ")).join(", ")
      : "flexible vibe";
  return `${typeLabel} for ${plan.guest_count} guests in ${plan.location} — ${cuisine}, ${vibe}, budget level $${plan.budget_range[0]}–$${plan.budget_range[1]}.`;
}
