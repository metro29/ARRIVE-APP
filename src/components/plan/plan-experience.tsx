"use client";

import { useMemo, useState, useTransition } from "react";
import { ButtonLink } from "@/components/shared/button-link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Loader2,
  Sparkles,
} from "lucide-react";
import { confirmEventDraft } from "@/app/actions/event-plan";
import { eventPlanToDiscoverFilters } from "@/lib/ai/event-plan-filters";
import { generateVenueMessage } from "@/lib/ai/draft-message";
import { getMatchReasons } from "@/lib/ai/match-reasons";
import { eventPlanner, validateEventPlan } from "@/lib/ai/eventPlanner";
import { discoverRestaurants } from "@/lib/discover/restaurant-discovery";
import { PlanReviewForm } from "@/components/plan/plan-review-form";
import { PlanSuggestionCard } from "@/components/plan/plan-suggestion-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { EventDraft, EventPlan, PlanStep } from "@/types/event-plan";
import type { RestaurantEnriched, RankedRestaurant } from "@/types/restaurant";

interface PlanExperienceProps {
  restaurants: RestaurantEnriched[];
}

const STEPS: { id: PlanStep; label: string }[] = [
  { id: "describe", label: "Describe" },
  { id: "review", label: "Review plan" },
  { id: "venues", label: "Venues" },
  { id: "draft", label: "Confirm" },
];

export function PlanExperience({ restaurants }: PlanExperienceProps) {
  const [step, setStep] = useState<PlanStep>("describe");
  const [prompt, setPrompt] = useState("");
  const [plan, setPlan] = useState<EventPlan | null>(null);
  const [summary, setSummary] = useState("");
  const [parsing, startParse] = useTransition();
  const [confirming, startConfirm] = useTransition();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<EventDraft | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);

  const filters = useMemo(
    () => (plan ? eventPlanToDiscoverFilters(plan) : null),
    [plan]
  );

  const recommendations: RankedRestaurant[] = useMemo(() => {
    if (!plan || !filters) return [];
    const ranked = discoverRestaurants(restaurants, filters);
    return ranked.map((r) => ({
      ...r,
      matchReasons: getMatchReasons(r, plan, filters),
    }));
  }, [restaurants, plan, filters]);

  const selectedRestaurant = recommendations.find((r) => r.id === selectedId);

  function handleGeneratePlan() {
    setError(null);
    startParse(async () => {
      try {
        const result = await eventPlanner.parseEventRequest({
          userMessage: prompt,
        });
        setPlan(result.plan);
        setSummary(result.summary);
        setStep("review");
      } catch {
        setError("Could not parse your event. Try adding guest count and event type.");
      }
    });
  }

  function handleContinueToVenues() {
    if (!plan) return;
    setPlan(validateEventPlan(plan));
    setStep("venues");
  }

  function handleSelectVenue(restaurant: RankedRestaurant) {
    if (!plan) return;
    setSelectedId(restaurant.id);
    const eventDate = draft?.eventDate ?? "";
    setDraft({
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      plan,
      guestCount: plan.guest_count,
      eventType: String(plan.event_type),
      eventDate,
      venueMessage: generateVenueMessage(plan, restaurant.name),
    });
  }

  function handleContinueToDraft() {
    if (!draft || !selectedId) {
      setError("Select a restaurant to continue.");
      return;
    }
    setError(null);
    setStep("draft");
  }

  function handleConfirmBooking() {
    if (!draft?.eventDate) {
      setError("Please choose an event date before confirming.");
      return;
    }
    setError(null);
    startConfirm(async () => {
      const result = await confirmEventDraft({
        ...draft,
        plan: validateEventPlan(draft.plan),
      });
      if (!result.success) {
        setError(result.error);
        return;
      }
      setBookingId(result.data.bookingId);
      setStep("confirmed");
    });
  }

  const stepIndex = STEPS.findIndex((s) => s.id === step);

  return (
    <div className="space-y-8">
      {step !== "confirmed" && (
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          {STEPS.map((s, i) => (
            <span
              key={s.id}
              className={
                i <= stepIndex
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              }
            >
              {i > 0 && <span className="mx-2 text-muted-foreground">→</span>}
              {s.label}
            </span>
          ))}
        </nav>
      )}

      {step === "describe" && (
        <Card className="border-primary/20 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Sparkles className="h-6 w-6 text-primary" />
              Plan your event
            </CardTitle>
            <CardDescription>
              Describe your event in plain language. We will structure your plan and
              find the best Dallas venues — you confirm before anything is sent.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-prompt">Describe your event</Label>
              <Textarea
                id="event-prompt"
                rows={5}
                placeholder='e.g. "Birthday dinner for 12 people in Dallas under $40 per person, casual and fun"'
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <Button
              type="button"
              size="lg"
              disabled={!prompt.trim() || parsing}
              onClick={handleGeneratePlan}
            >
              {parsing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Finding the best places for your event...
                </>
              ) : (
                <>
                  Generate Plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "review" && plan && (
        <div className="space-y-6 transition-opacity duration-300">
          <Card>
            <CardHeader>
              <CardTitle>Your event plan</CardTitle>
              <CardDescription>{summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <PlanReviewForm plan={plan} onChange={setPlan} />
            </CardContent>
          </Card>
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => setStep("describe")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button type="button" onClick={handleContinueToVenues}>
              See recommended venues
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {step === "venues" && plan && (
        <div className="space-y-6 transition-opacity duration-300">
          <div>
            <h2 className="text-xl font-semibold">Recommended venues</h2>
            <p className="text-sm text-muted-foreground">
              Ranked using your structured plan — same scoring as Discover.
            </p>
          </div>

          {recommendations.length > 0 ? (
            <div className="grid gap-6 lg:grid-cols-2">
              {recommendations.slice(0, 8).map((restaurant) => (
                <PlanSuggestionCard
                  key={restaurant.id}
                  restaurant={restaurant}
                  selected={selectedId === restaurant.id}
                  onSelect={() => handleSelectVenue(restaurant)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                No venues match this plan. Adjust cuisine, vibe, or group size in the
                previous step.
              </CardContent>
            </Card>
          )}

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => setStep("review")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Edit plan
            </Button>
            <Button
              type="button"
              disabled={!selectedId}
              onClick={handleContinueToDraft}
            >
              Continue with selected venue
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {step === "draft" && draft && selectedRestaurant && (
        <div className="space-y-6 transition-opacity duration-300">
          <Card>
            <CardHeader>
              <CardTitle>Event draft</CardTitle>
              <CardDescription>
                Review your request for {draft.restaurantName}. Nothing is sent until
                you confirm.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="draft-date">Event date</Label>
                  <Input
                    id="draft-date"
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={draft.eventDate}
                    onChange={(e) =>
                      setDraft({ ...draft, eventDate: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="draft-guests">Guest count</Label>
                  <Input
                    id="draft-guests"
                    type="number"
                    min={1}
                    max={selectedRestaurant.capacity}
                    value={draft.guestCount}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        guestCount: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="draft-message">Message to restaurant</Label>
                <Textarea
                  id="draft-message"
                  rows={8}
                  value={draft.venueMessage}
                  onChange={(e) =>
                    setDraft({ ...draft, venueMessage: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="outline" onClick={() => setStep("venues")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <Button
              type="button"
              size="lg"
              disabled={confirming || !draft.eventDate}
              onClick={handleConfirmBooking}
            >
              {confirming ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting request...
                </>
              ) : (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Confirm & send booking request
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {step === "confirmed" && bookingId && (
        <Card className="border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/30">
          <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
            <CheckCircle2 className="h-14 w-14 text-emerald-600" />
            <div>
              <h2 className="text-xl font-semibold text-emerald-900 dark:text-emerald-100">
                Booking request sent
              </h2>
              <p className="mt-2 text-sm text-emerald-800/90 dark:text-emerald-200/90">
                Your event draft was submitted. The venue will review your request
                and you can follow up in messages.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <ButtonLink href={`/bookings/${bookingId}`}>
                View booking
              </ButtonLink>
              <ButtonLink href="/plan" variant="outline">
                Plan another event
              </ButtonLink>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function PlanExperienceSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-6 w-64" />
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-10 w-40" />
    </div>
  );
}
