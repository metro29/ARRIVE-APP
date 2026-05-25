import { eventPlanToDiscoverFilters } from "@/lib/ai/event-plan-filters";
import {
  parseEventPlan,
  summarizeEventPlan,
  validateEventPlan,
} from "@/lib/ai/parse-event-plan";
import type { EventPlan } from "@/types/event-plan";

export interface EventPlannerInput {
  userMessage: string;
  userId?: string;
}

export interface EventPlannerOutput {
  plan: EventPlan;
  summary: string;
}

export interface EventPlannerService {
  parseEventRequest(input: EventPlannerInput): Promise<EventPlannerOutput>;
}

/** Deterministic planner — structures intent only; ranking stays in discover layer. */
export const eventPlanner: EventPlannerService = {
  async parseEventRequest(input) {
    const raw = parseEventPlan(input.userMessage);
    const plan = validateEventPlan(raw);
    return {
      plan,
      summary: summarizeEventPlan(plan),
    };
  },
};

export {
  eventPlanToDiscoverFilters,
  parseEventPlan,
  validateEventPlan,
  summarizeEventPlan,
};
