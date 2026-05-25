"use client";

import { useState, useTransition } from "react";
import { CheckCircle2 } from "lucide-react";
import { createBookingRequest } from "@/app/actions/bookings";
import { ButtonLink } from "@/components/shared/button-link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface BookingRequestFormProps {
  restaurantId: string;
  maxCapacity: number;
}

export function BookingRequestForm({
  restaurantId,
  maxCapacity,
}: BookingRequestFormProps) {
  const [pending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const minDate = new Date().toISOString().split("T")[0];

  function handleSubmit(formData: FormData) {
    setFeedback(null);
    startTransition(async () => {
      const result = await createBookingRequest(formData);
      if (!result.success) {
        setFeedback({ type: "error", text: result.error });
        return;
      }
      setFeedback({
        type: "success",
        text: "Your request has been sent. The restaurant will respond soon.",
      });
    });
  }

  if (feedback?.type === "success") {
    return (
      <Card className="border-0 bg-emerald-500/8 ring-1 ring-emerald-500/15">
        <CardContent className="flex flex-col items-center gap-5 px-6 py-12 text-center page-enter">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15">
            <CheckCircle2 className="h-7 w-7 text-emerald-700 dark:text-emerald-300" />
          </div>
          <div className="max-w-sm space-y-2">
            <p className="text-lg font-medium text-foreground">
              You&apos;re all set
            </p>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {feedback.text}
            </p>
          </div>
          <ButtonLinkGroup />
        </CardContent>
      </Card>
    );
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <input type="hidden" name="restaurant_id" value={restaurantId} />

      <div className="space-y-2">
        <Label htmlFor="event_type">What kind of event?</Label>
        <p className="text-xs text-muted-foreground">
          This helps the venue prepare the right experience.
        </p>
        <select
          id="event_type"
          name="event_type"
          defaultValue="private_dining"
          className="flex h-10 w-full rounded-xl border border-input/80 bg-background px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
        >
          <option value="private_dining">Private dining</option>
          <option value="corporate">Corporate gathering</option>
          <option value="celebration">Celebration</option>
          <option value="wedding">Wedding reception</option>
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="guest_count">How many guests?</Label>
          <p className="text-xs text-muted-foreground">
            Up to {maxCapacity} at this venue.
          </p>
          <Input
            id="guest_count"
            name="guest_count"
            type="number"
            min={1}
            max={maxCapacity}
            defaultValue={20}
            required
            className="h-10 rounded-xl"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="event_date">When is it?</Label>
          <p className="text-xs text-muted-foreground">
            Pick your preferred date.
          </p>
          <Input
            id="event_date"
            name="event_date"
            type="date"
            min={minDate}
            required
            className="h-10 rounded-xl"
          />
        </div>
      </div>

      {feedback?.type === "error" && (
        <p className="text-sm text-destructive" role="alert">
          {feedback.text}
        </p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending ? "Sending your request…" : "Send request to venue"}
      </Button>
    </form>
  );
}

function ButtonLinkGroup() {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <ButtonLink href="/bookings" size="sm">
        See your plans
      </ButtonLink>
      <ButtonLink href="/discover" size="sm" variant="outline">
        Explore more places
      </ButtonLink>
    </div>
  );
}
