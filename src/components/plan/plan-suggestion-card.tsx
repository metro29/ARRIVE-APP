"use client";

import Image from "next/image";
import { Check, MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { PRICE_LEVEL_LABELS } from "@/types/restaurant";
import type { RankedRestaurant } from "@/types/restaurant";

interface PlanSuggestionCardProps {
  restaurant: RankedRestaurant;
  selected?: boolean;
  onSelect: () => void;
}

export function PlanSuggestionCard({
  restaurant,
  selected,
  onSelect,
}: PlanSuggestionCardProps) {
  return (
    <Card
      className={cn(
        "hover-lift overflow-hidden border-0 transition-all duration-300",
        selected && "ring-2 ring-primary/30 shadow-[0_12px_32px_-16px_oklch(0.45_0.1_265/0.25)]"
      )}
    >
      <div className="relative aspect-[16/9] bg-muted">
        <Image
          src={restaurant.image_url}
          alt={restaurant.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        {selected && (
          <div className="absolute right-3 top-3 rounded-full bg-primary p-1.5 text-primary-foreground">
            <Check className="h-4 w-4" />
          </div>
        )}
      </div>
      <CardHeader className="space-y-1">
        <CardTitle className="text-lg">{restaurant.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {restaurant.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {restaurant.location}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-4 w-4" />
            Up to {restaurant.capacity}
          </span>
          <Badge variant="outline">{PRICE_LEVEL_LABELS[restaurant.price_level]}</Badge>
        </div>
        {restaurant.matchReasons && restaurant.matchReasons.length > 0 && (
          <div className="rounded-xl bg-muted/30 px-4 py-3 ring-1 ring-foreground/[0.04]">
            <p className="mb-2 text-xs font-medium text-muted-foreground">
              Why this could work for you
            </p>
            <ul className="space-y-1.5 text-sm">
              {restaurant.matchReasons.map((reason) => (
                <li key={reason} className="flex gap-2">
                  <span className="text-primary">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          type="button"
          variant={selected ? "default" : "outline"}
          className="w-full"
          onClick={onSelect}
        >
          {selected ? "Selected" : "Choose this venue"}
        </Button>
      </CardFooter>
    </Card>
  );
}
