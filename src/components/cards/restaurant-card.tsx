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
        "hover-lift group overflow-hidden border-0",
        isFeatured &&
          "ring-2 ring-primary/25 shadow-[0_12px_40px_-16px_oklch(0.45_0.12_265/0.35)]"
      )}
    >
      <div className="relative aspect-[5/3] overflow-hidden bg-muted/50">
        <Image
          src={restaurant.image_url}
          alt={restaurant.name}
          fill
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {restaurant.cuisine_type}
          </Badge>
          {isFeatured && (
            <Badge className="gap-1 bg-primary/90 text-primary-foreground shadow-sm">
              <Sparkles className="h-3 w-3" />
              Recommended for you
            </Badge>
          )}
        </div>
      </div>
      <CardHeader className="space-y-2 pb-0">
        <CardTitle className="text-[1.0625rem] leading-snug">
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
          className="w-full"
          size="lg"
        >
          Plan this event
        </ButtonLink>
      </CardFooter>
    </Card>
  );
}
