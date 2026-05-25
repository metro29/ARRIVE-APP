import { ArrowRight, Calendar, Heart, MapPin } from "lucide-react";
import { ButtonLink } from "@/components/shared/button-link";

const highlights = [
  {
    icon: MapPin,
    title: "Places made for gatherings",
    description:
      "Browse Dallas venues that actually host birthdays, dinners, and team events — not just table reservations.",
  },
  {
    icon: Calendar,
    title: "One calm place for every step",
    description:
      "From first request to confirmation, keep the conversation and details in a single, thoughtful experience.",
  },
  {
    icon: Heart,
    title: "Built for real moments",
    description:
      "Arrive is designed around the feeling of planning something meaningful — not filling out another form.",
  },
];

export default function LandingPage() {
  return (
    <div>
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,oklch(0.55_0.12_265/0.14),transparent)]" />
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-6 inline-flex rounded-full bg-primary/8 px-4 py-1.5 text-xs font-medium tracking-wide text-primary">
            Event planning, thoughtfully done
          </p>
          <h1 className="text-4xl font-medium leading-[1.15] tracking-tight sm:text-5xl lg:text-[3.25rem]">
            Find the right place for moments that matter
          </h1>
          <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
            Arrive helps you discover venues, shape your event, and reach out —
            with a calm, human experience from start to finish.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <ButtonLink href="/signup" size="lg">
              Get started
              <ArrowRight className="ml-2 h-4 w-4" />
            </ButtonLink>
            <ButtonLink href="/login" size="lg" variant="outline">
              Sign in
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-muted/20 px-4 py-20 sm:px-6">
        <div className="mx-auto grid max-w-4xl gap-10 md:grid-cols-3">
          {highlights.map((item, index) => (
            <div
              key={item.title}
              className="space-y-4 rounded-2xl bg-background/80 p-6 ring-1 ring-foreground/[0.04] transition-shadow duration-300 hover:shadow-[0_8px_24px_-12px_oklch(0.2_0.04_265/0.12)]"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/8 text-primary">
                <item.icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <h2 className="text-base font-medium tracking-tight">
                {item.title}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
