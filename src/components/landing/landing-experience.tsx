"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  ArrowRight,
  Calendar,
  MapPin,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { StartupMesh } from "@/components/landing/startup-mesh";
import { ProductPreview } from "@/components/landing/product-preview";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { ButtonLink } from "@/components/shared/button-link";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const FEATURES = [
  {
    icon: MapPin,
    title: "Houston + Cypress",
    desc: "108 live venues across the metro — steakhouses, BBQ, ballrooms, rooftops.",
  },
  {
    icon: Zap,
    title: "Smart discovery",
    desc: "Filters and ranking that match your group size, vibe, and event type.",
  },
  {
    icon: Calendar,
    title: "One booking flow",
    desc: "Request an event, track status, and message venues in one place.",
  },
  {
    icon: Users,
    title: "Built for hosts",
    desc: "From birthdays to board dinners — capacity and tags you can trust.",
  },
];

const VENUES = [
  {
    src: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80",
    name: "Steakhouse",
  },
  {
    src: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
    name: "BBQ",
  },
  {
    src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
    name: "Rooftop",
  },
  {
    src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    name: "Events",
  },
];

export function LandingExperience() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !root.current) return;

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .from(".hero-badge", { opacity: 0, y: 16, duration: 0.6 })
        .from(".hero-title", { opacity: 0, y: 32, duration: 0.85 }, "-=0.3")
        .from(".hero-desc", { opacity: 0, y: 20, duration: 0.7 }, "-=0.45")
        .from(".hero-actions", { opacity: 0, y: 16, stagger: 0.08, duration: 0.6 }, "-=0.4")
        .from(".product-preview", { opacity: 0, y: 40, scale: 0.96, duration: 1 }, "-=0.6");

      gsap.to(".product-preview", {
        y: -12,
        duration: 2.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.utils.toArray<HTMLElement>(".feature-card").forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 36,
          duration: 0.7,
          delay: i * 0.05,
          scrollTrigger: {
            trigger: card,
            start: "top 92%",
          },
        });
      });

      gsap.to(".venue-card", {
        y: (i) => (i % 2 === 0 ? -8 : 8),
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: { each: 0.2 },
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <div ref={root} className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative px-4 pb-20 pt-12 sm:px-6 lg:pb-28 lg:pt-16">
        <StartupMesh />
        <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-2 lg:gap-12">
          <div>
            <p className="hero-badge mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/8 px-4 py-1.5 text-sm font-semibold text-primary">
              <Sparkles className="h-4 w-4" />
              Event venue marketplace
            </p>
            <h1 className="hero-title font-display text-[clamp(2.25rem,5.5vw,3.75rem)] font-bold leading-[1.08] tracking-tight text-foreground">
              Book unforgettable venues in{" "}
              <span className="text-gradient-brand">Houston</span>
            </h1>
            <p className="hero-desc mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
              Arrive is the modern way to discover restaurants and event spaces,
              plan your gathering, and send booking requests — without the chaos.
            </p>
            <div className="hero-actions mt-10 flex flex-wrap items-center gap-4">
              <ButtonLink href="/signup" size="lg" className="btn-shine h-12 px-8">
                Get started free
                <ArrowRight className="ml-2 h-4 w-4" />
              </ButtonLink>
              <ButtonLink href="/login" size="lg" variant="outline" className="h-12 px-8">
                Sign in
              </ButtonLink>
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-border pt-8">
              <div>
                <dt className="text-2xl font-bold text-foreground">108+</dt>
                <dd className="text-sm text-muted-foreground">Live venues</dd>
              </div>
              <div>
                <dt className="text-2xl font-bold text-foreground">2</dt>
                <dd className="text-sm text-muted-foreground">Metro areas</dd>
              </div>
              <div>
                <dt className="text-2xl font-bold text-foreground">0</dt>
                <dd className="text-sm text-muted-foreground">Spreadsheets</dd>
              </div>
            </dl>
          </div>
          <ProductPreview />
        </div>
      </section>

      {/* Venue strip */}
      <section className="border-y border-border bg-muted/30 py-16">
        <ScrollReveal className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="font-display text-center text-2xl font-bold text-foreground sm:text-3xl">
            Every kind of Houston event, one platform
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            From smokehouse reunions to skyline cocktail receptions.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {VENUES.map((v, i) => (
              <div
                key={v.name}
                className="venue-card group relative aspect-[4/5] overflow-hidden rounded-2xl border border-border bg-card shadow-md"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <Image
                  src={v.src}
                  alt={v.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <p className="absolute bottom-3 left-3 text-sm font-semibold text-white">
                  {v.name}
                </p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>

      {/* Features bento */}
      <section className="px-4 py-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <ScrollReveal>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Why Arrive
            </p>
            <h2 className="font-display mt-2 max-w-xl text-3xl font-bold text-foreground sm:text-4xl">
              Professional tools for people who plan real events
            </h2>
          </ScrollReveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="feature-card hover-lift group rounded-2xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-28 sm:px-6">
        <ScrollReveal className="mx-auto max-w-6xl">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-8 py-16 text-center shadow-[0_24px_60px_-20px_oklch(0.45_0.16_265/0.55)] sm:px-16">
            <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-violet-300/20 blur-3xl" />
            <h2 className="relative font-display text-3xl font-bold text-primary-foreground sm:text-4xl">
              Ready to plan your next event?
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-primary-foreground/85">
              Join Arrive and browse Houston&apos;s best venues in minutes.
            </p>
            <ButtonLink
              href="/signup"
              size="lg"
              variant="secondary"
              className="relative mt-8 h-12 bg-white px-10 text-primary hover:bg-white/95"
            >
              Create your account
            </ButtonLink>
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
