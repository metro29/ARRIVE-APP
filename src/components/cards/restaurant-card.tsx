"use client";

import Image from "next/image";
import { MapPin, Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/shared/button-link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPerfectForLabel } from "@/lib/discover/restaurant-discovery";
import { cn } from "@/lib/utils";
import { PRICE_LEVEL_LABELS } from "@/types/restaurant";
import type { RankedRestaurant, RestaurantEnriched } from "@/types/restaurant";

interface RestaurantCardProps {
  restaurant: RestaurantEnriched &
    Partial<Pick<RankedRestaurant, "matchScore" | "isBestMatch" | "isRecommended">>;
  featured?: boolean;
}

export function RestaurantCard({ restaurant, featured }: RestaurantCardProps) {
  const perfectFor = getPerfectForLabel(restaurant);
  const isFeatured = featured ?? restaurant.isRecommended;

  return (
    <Card
      className={cn(
        "card-shine hover-lift group overflow-hidden border border-border bg-card",
        isFeatured && "ring-2 ring-primary/25"
      )}
    >
      <div className="relative aspect-[5/3] overflow-hidden bg-muted">
        <Image
          src={restaurant.image_url}
          alt={restaurant.name}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge className="border-0 bg-white/95 text-foreground shadow-sm">
            {restaurant.cuisine_type}
          </Badge>
          {isFeatured && (
            <Badge className="gap-1 border-0 bg-primary text-primary-foreground">
              <Sparkles className="h-3 w-3" />
              Recommended
            </Badge>
          )}
        </div>
      </div>
      <CardHeader className="space-y-2 pb-0">
        <CardTitle className="font-display text-lg font-semibold text-foreground">
          {restaurant.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm text-muted-foreground">
          {restaurant.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {restaurant.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {restaurant.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="capitalize text-foreground">
                {tag.replace(/-/g, " ")}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {restaurant.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-primary" />
            Up to {restaurant.capacity} guests
          </span>
          <span className="font-medium text-foreground">
            {PRICE_LEVEL_LABELS[restaurant.price_level]}
          </span>
        </div>
        <p className="text-sm">
          <span className="text-muted-foreground">Great for </span>
          <span className="font-medium text-foreground">{perfectFor}</span>
        </p>
      </CardContent>
      <CardFooter className="border-t border-border/60 bg-muted/20 pt-0">
        <ButtonLink
          href={`/restaurant/${restaurant.id}`}
          className="w-full"
          size="lg"
        >
          Plan this event
        </ButtonLink>
      </CardFooter>
    </Card>
  );
}
