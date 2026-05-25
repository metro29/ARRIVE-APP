import type { EventPlan } from "@/types/event-plan";
import type { RestaurantEnriched } from "@/types/restaurant";

/**
 * Legacy AI assistant types — superseded by EventPlan + eventPlanner in Phase 3.
 */

export interface AiEventRequestInput {
  userMessage: string;
  userId?: string;
}

export type AiStructuredFilters = EventPlan;

export interface AiAssistantOutput {
  plan: EventPlan;
  restaurants: RestaurantEnriched[];
  explanation: string;
}

export interface AiAssistantService {
  parseEventRequest(input: AiEventRequestInput): Promise<AiAssistantOutput>;
}
