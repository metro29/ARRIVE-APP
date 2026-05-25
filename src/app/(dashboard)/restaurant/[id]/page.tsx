import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Users } from "lucide-react";
import { getRestaurantById } from "@/lib/queries/restaurants";
import { BookingRequestForm } from "@/components/shared/booking-request-form";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/shared/button-link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const restaurant = await getRestaurantById(id);

  if (!restaurant) notFound();

  return (
    <div className="space-y-10 page-enter">
      <ButtonLink href="/discover" variant="ghost" size="sm" className="-ml-1">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to places
      </ButtonLink>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted/40 shadow-[0_12px_40px_-20px_oklch(0.2_0.04_265/0.2)] ring-1 ring-foreground/[0.04]">
          <Image
            src={restaurant.image_url}
            alt={restaurant.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="space-y-8">
          <div className="space-y-4">
            <Badge variant="secondary" className="mb-1">
              {restaurant.cuisine_type}
            </Badge>
            <h1 className="text-3xl font-medium tracking-tight sm:text-[2rem]">
              {restaurant.name}
            </h1>
            <p className="text-base leading-relaxed text-muted-foreground">
              {restaurant.description}
            </p>
            <div className="flex flex-wrap gap-5 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 opacity-70" />
                {restaurant.location}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 opacity-70" />
                Up to {restaurant.capacity} guests
              </span>
            </div>
          </div>

          <Card className="border-0">
            <CardHeader>
              <CardTitle>Plan an event here</CardTitle>
              <p className="text-sm text-muted-foreground">
                Share a few details — the venue will review and get back to you.
              </p>
            </CardHeader>
            <CardContent>
              <BookingRequestForm
                restaurantId={restaurant.id}
                maxCapacity={restaurant.capacity}
              />
            </CardContent>
          </Card>

          <div className="rounded-2xl bg-muted/25 px-5 py-4 text-sm leading-relaxed text-muted-foreground ring-1 ring-foreground/[0.04]">
            After you send a request, you can follow the conversation in{" "}
            <span className="font-medium text-foreground">Your plans</span>.
          </div>
        </div>
      </div>
    </div>
  );
}
