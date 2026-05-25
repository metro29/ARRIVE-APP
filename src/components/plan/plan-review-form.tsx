"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  CUISINE_OPTIONS,
  EVENT_TYPE_OPTIONS,
} from "@/types/discover";
import { ALL_VIBE_TAGS, type RestaurantTag } from "@/types/restaurant";
import type { EventPlan } from "@/types/event-plan";
import { cn } from "@/lib/utils";

interface PlanReviewFormProps {
  plan: EventPlan;
  onChange: (plan: EventPlan) => void;
}

export function PlanReviewForm({ plan, onChange }: PlanReviewFormProps) {
  function patch(partial: Partial<EventPlan>) {
    onChange({ ...plan, ...partial });
  }

  function toggleVibe(tag: RestaurantTag) {
    const next = plan.vibe.includes(tag)
      ? plan.vibe.filter((t) => t !== tag)
      : [...plan.vibe, tag];
    patch({ vibe: next });
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="space-y-2">
        <Label>Event type</Label>
        <Select
          value={String(plan.event_type)}
          onValueChange={(v) => v && patch({ event_type: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EVENT_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Guest count</Label>
        <Input
          type="number"
          min={1}
          max={500}
          value={plan.guest_count}
          onChange={(e) => patch({ guest_count: Number(e.target.value) })}
        />
      </div>

      <div className="space-y-2">
        <Label>Location</Label>
        <Input
          value={plan.location}
          onChange={(e) => patch({ location: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label>Urgency</Label>
        <Select
          value={String(plan.urgency)}
          onValueChange={(v) => v && patch({ urgency: v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asap">ASAP</SelectItem>
            <SelectItem value="soon">Within 2 weeks</SelectItem>
            <SelectItem value="flexible">Flexible</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label>Budget level (min – max)</Label>
        <div className="flex gap-3">
          <Select
            value={String(plan.budget_range[0])}
            onValueChange={(v) =>
              patch({
                budget_range: [Number(v), plan.budget_range[1]],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Min" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  Level {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={String(plan.budget_range[1])}
            onValueChange={(v) =>
              patch({
                budget_range: [plan.budget_range[0], Number(v)],
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Max" />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  Level {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label>Cuisine preference</Label>
        <Select
          value={plan.cuisine_preferences[0] ?? "any"}
          onValueChange={(v) =>
            patch({
              cuisine_preferences: !v || v === "any" ? [] : [v],
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Any cuisine" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any cuisine</SelectItem>
            {CUISINE_OPTIONS.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 sm:col-span-2">
        <Label>Vibe</Label>
        <div className="flex flex-wrap gap-2">
          {ALL_VIBE_TAGS.map((tag) => {
            const active = plan.vibe.includes(tag);
            return (
              <Badge
                key={tag}
                variant={active ? "default" : "outline"}
                className={cn("cursor-pointer capitalize")}
                onClick={() => toggleVibe(tag)}
              >
                {tag.replace(/-/g, " ")}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
