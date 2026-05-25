"use client";

import { Label } from "@/components/ui/label";
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
  DEFAULT_DISCOVER_FILTERS,
  EVENT_TYPE_OPTIONS,
  GROUP_SIZE_OPTIONS,
  type DiscoverFilters,
} from "@/types/discover";
import {
  ALL_VIBE_TAGS,
  PRICE_LEVEL_LABELS,
  type PriceLevel,
  type RestaurantTag,
} from "@/types/restaurant";
import { cn } from "@/lib/utils";

export interface DiscoverFiltersPanelProps {
  filters: DiscoverFilters;
  onChange: (patch: Partial<DiscoverFilters>) => void;
  className?: string;
  variant?: "sidebar" | "inline";
}

export function DiscoverFiltersPanel({
  filters,
  onChange,
  className,
  variant = "inline",
}: DiscoverFiltersPanelProps) {
  const isSidebar = variant === "sidebar";

  function toggleVibe(tag: RestaurantTag) {
    const next = filters.vibe_tags.includes(tag)
      ? filters.vibe_tags.filter((t) => t !== tag)
      : [...filters.vibe_tags, tag];
    onChange({ vibe_tags: next });
  }

  function clearAll() {
    onChange(DEFAULT_DISCOVER_FILTERS);
  }

  return (
    <div
      className={cn(
        "space-y-6 transition-all duration-200",
        isSidebar && "surface-soft p-5",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">Refine your search</p>
        <button
          type="button"
          onClick={clearAll}
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Reset
        </button>
      </div>

      <FilterField label="What are you planning?" hint="Birthday, corporate dinner, and more">
        <Select
          value={filters.event_type ?? "all"}
          onValueChange={(v) =>
            onChange({
              event_type: v === "all" ? null : (v as DiscoverFilters["event_type"]),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Any occasion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any occasion</SelectItem>
            {EVENT_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="How many guests?" hint="We'll match venues that fit">
        <Select
          value={filters.group_size ?? "all"}
          onValueChange={(v) =>
            onChange({
              group_size: v === "all" ? null : (v as DiscoverFilters["group_size"]),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Any size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any size</SelectItem>
            {GROUP_SIZE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Cuisine">
        <Select
          value={filters.cuisine_type ?? "all"}
          onValueChange={(v) =>
            onChange({ cuisine_type: v === "all" ? null : v })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="All cuisines" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All cuisines</SelectItem>
            {CUISINE_OPTIONS.map((cuisine) => (
              <SelectItem key={cuisine} value={cuisine}>
                {cuisine}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Budget">
        <Select
          value={filters.price_level?.toString() ?? "all"}
          onValueChange={(v) =>
            onChange({
              price_level: v === "all" ? null : (Number(v) as PriceLevel),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Any budget" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any budget</SelectItem>
            {([1, 2, 3, 4] as PriceLevel[]).map((level) => (
              <SelectItem key={level} value={level.toString()}>
                {PRICE_LEVEL_LABELS[level]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Area" hint="Distance from central Dallas">
        <Select
          value={filters.location_radius_km?.toString() ?? "all"}
          onValueChange={(v) =>
            onChange({
              location_radius_km: v === "all" ? null : Number(v),
            })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Any distance" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Any distance</SelectItem>
            <SelectItem value="5">Within 5 km</SelectItem>
            <SelectItem value="15">Within 15 km</SelectItem>
            <SelectItem value="25">Within 25 km</SelectItem>
            <SelectItem value="50">Within 50 km</SelectItem>
          </SelectContent>
        </Select>
      </FilterField>

      <FilterField label="Vibe" hint="Tap what fits the mood">
        <div className="flex flex-wrap gap-2">
          {ALL_VIBE_TAGS.map((tag) => {
            const active = filters.vibe_tags.includes(tag);
            return (
              <Badge
                key={tag}
                variant={active ? "default" : "outline"}
                className={cn(
                  "cursor-pointer capitalize transition-all duration-200",
                  active && "shadow-sm"
                )}
                onClick={() => toggleVibe(tag)}
              >
                {tag.replace(/-/g, " ")}
              </Badge>
            );
          })}
        </div>
      </FilterField>
    </div>
  );
}

function FilterField({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-xs font-medium text-foreground">{label}</Label>
      {hint && (
        <p className="text-[0.6875rem] leading-relaxed text-muted-foreground">
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}
