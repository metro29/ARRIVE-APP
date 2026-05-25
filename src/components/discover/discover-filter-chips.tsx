"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  countActiveFilters,
  DEFAULT_DISCOVER_FILTERS,
  GROUP_SIZE_OPTIONS,
  type DiscoverFilters,
} from "@/types/discover";
import { EVENT_TYPE_LABELS, PRICE_LEVEL_LABELS } from "@/types/restaurant";
import { cn } from "@/lib/utils";

interface DiscoverFilterChipsProps {
  filters: DiscoverFilters;
  onChange: (patch: Partial<DiscoverFilters>) => void;
  onOpenFilters?: () => void;
  className?: string;
}

export function DiscoverFilterChips({
  filters,
  onChange,
  onOpenFilters,
  className,
}: DiscoverFilterChipsProps) {
  const activeCount = countActiveFilters(filters);

  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  if (filters.event_type) {
    chips.push({
      key: "event",
      label: EVENT_TYPE_LABELS[filters.event_type],
      onRemove: () => onChange({ event_type: null }),
    });
  }
  if (filters.group_size) {
    const label =
      GROUP_SIZE_OPTIONS.find((o) => o.value === filters.group_size)?.label ??
      filters.group_size;
    chips.push({
      key: "group",
      label,
      onRemove: () => onChange({ group_size: null }),
    });
  }
  if (filters.cuisine_type) {
    chips.push({
      key: "cuisine",
      label: filters.cuisine_type,
      onRemove: () => onChange({ cuisine_type: null }),
    });
  }
  if (filters.price_level) {
    chips.push({
      key: "price",
      label: PRICE_LEVEL_LABELS[filters.price_level],
      onRemove: () => onChange({ price_level: null }),
    });
  }
  if (filters.location_radius_km) {
    chips.push({
      key: "radius",
      label: `${filters.location_radius_km} km`,
      onRemove: () => onChange({ location_radius_km: null }),
    });
  }
  filters.vibe_tags.forEach((tag) => {
    chips.push({
      key: `vibe-${tag}`,
      label: tag.replace(/-/g, " "),
      onRemove: () =>
        onChange({
          vibe_tags: filters.vibe_tags.filter((t) => t !== tag),
        }),
    });
  });

  return (
    <div
      className={cn(
        "space-y-3 transition-all duration-200 ease-out lg:hidden",
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium text-foreground">Active filters</p>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={() => onChange(DEFAULT_DISCOVER_FILTERS)}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              Clear
            </button>
          )}
          {onOpenFilters && (
            <button
              type="button"
              onClick={onOpenFilters}
              className="text-xs font-medium text-primary"
            >
              {activeCount > 0 ? `Adjust (${activeCount})` : "Add filters"}
            </button>
          )}
        </div>
      </div>

      {chips.length > 0 ? (
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {chips.map((chip) => (
            <Badge
              key={chip.key}
              variant="secondary"
              className="shrink-0 gap-1 pr-1 capitalize"
            >
              {chip.label}
              <button
                type="button"
                aria-label={`Remove ${chip.label} filter`}
                onClick={chip.onRemove}
                className="rounded-full p-0.5 hover:bg-background/60"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          Tap filters above to shape what you&apos;re looking for.
        </p>
      )}
    </div>
  );
}
