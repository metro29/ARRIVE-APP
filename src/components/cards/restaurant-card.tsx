"use client";

import { useRef, type MouseEvent } from "react";
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
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import type { RankedRestaurant, RestaurantEnriched } from "@/types/restaurant";

interface RestaurantCardProps {
  restaurant: RestaurantEnriched &
    Partial<Pick<RankedRestaurant, "matchScore" | "isBestMatch" | "isRecommended">>;
  featured?: boolean;
}

export function RestaurantCard({ restaurant, featured }: RestaurantCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  const perfectFor = getPerfectForLabel(restaurant);
  const isFeatured = featured ?? restaurant.isRecommended;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-4px)`;
  };

  const onLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = "";
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="transition-transform duration-200 ease-out will-change-transform"
    >
    <Card
      className={cn(
        "card-shine group relative overflow-hidden border-0 transition-[box-shadow] duration-500",
        isFeatured &&
          "ring-2 ring-primary/30 shadow-[0_20px_60px_-20px_oklch(0.45_0.14_265/0.45)]"
      )}
    >
      <div className="relative aspect-[5/3] overflow-hidden bg-muted/50">
        <Image
          src={restaurant.image_url}
          alt={restaurant.name}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge
            variant="secondary"
            className="border-0 bg-background/80 backdrop-blur-md"
          >
            {restaurant.cuisine_type}
          </Badge>
          {isFeatured && (
            <Badge className="gap-1 border-0 bg-primary/90 text-primary-foreground shadow-[0_0_20px_oklch(0.5_0.2_265/0.5)]">
              <Sparkles className="h-3 w-3" />
              Recommended
            </Badge>
          )}
        </div>
      </div>
      <CardHeader className="space-y-2 pb-0">
        <CardTitle className="font-display text-xl leading-snug tracking-tight">
          {restaurant.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-[0.8125rem]">
          {restaurant.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        {restaurant.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {restaurant.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="capitalize">
                {tag.replace(/-/g, " ")}
              </Badge>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[0.8125rem] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 opacity-70" />
            {restaurant.location}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 shrink-0 opacity-70" />
            Up to {restaurant.capacity} guests
          </span>
          <span>{PRICE_LEVEL_LABELS[restaurant.price_level]}</span>
        </div>
        <p className="text-[0.8125rem] leading-relaxed">
          <span className="text-muted-foreground">Great for </span>
          <span className="text-foreground/90">{perfectFor}</span>
        </p>
      </CardContent>
      <CardFooter className="border-t-0 bg-transparent pt-0">
        <ButtonLink
          href={`/restaurant/${restaurant.id}`}
          className="w-full rounded-xl"
          size="lg"
        >
          Plan this event
        </ButtonLink>
      </CardFooter>
    </Card>
    </div>
  );
}
