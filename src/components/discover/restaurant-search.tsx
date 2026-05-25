"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface RestaurantSearchProps {
  value: string;
  onChange: (query: string) => void;
  disabled?: boolean;
}

export function RestaurantSearch({
  value,
  onChange,
  disabled = false,
}: RestaurantSearchProps) {
  return (
    <div className="relative space-y-2">
      <Search className="absolute left-3.5 top-[0.6875rem] h-4 w-4 text-muted-foreground/70" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search by name or neighborhood…"
        className="h-11 pl-10"
        disabled={disabled}
        aria-label="Search restaurants"
      />
      <p className="text-xs leading-relaxed text-muted-foreground">
        Start typing to narrow the list — we&apos;ll keep your filters in mind.
      </p>
    </div>
  );
}
