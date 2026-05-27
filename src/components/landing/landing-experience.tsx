"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { AuroraBg } from "@/components/motion/aurora-bg";
import { HeroParticles } from "@/components/motion/hero-particles";
import { Magnetic } from "@/components/motion/magnetic";
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { ButtonLink } from "@/components/shared/button-link";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const MARQUEE = [
  "Steakhouses",
  "BBQ halls",
  "Rooftops",
  "Private dining",
  "Corporate events",
  "Tex-Mex",
  "Cypress venues",
  "Houston skyline",
  "Birthday dinners",
  "Team celebrations",
];

const SHOWCASE = [
  {
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80",
    title: "Elevated dining",
    span: "col-span-2 row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1558030006-450675393462?w=800&q=80",
    title: "Texas BBQ",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=800&q=80",
    title: "Rooftop energy",
    span: "col-span-1 row-span-1",
  },
  {
    src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    title: "Event spaces",
    span: "col-span-2 row-span-1",
  },
];

export function LandingExperience() {
  const root = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !root.current) return;

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".hero-eyebrow", { opacity: 0, y: 20, duration: 0.8 })
        .from(
          ".hero-line",
          { opacity: 0, y: 80, rotateX: 12, duration: 1.2, stagger: 0.12 },
          "-=0.4"
        )
        .from(".hero-sub", { opacity: 0, y: 24, duration: 0.9 }, "-=0.6")
        .from(".hero-cta", { opacity: 0, y: 20, duration: 0.7, stagger: 0.1 }, "-=0.5")
        .from(".hero-scroll-hint", { opacity: 0, duration: 0.6 }, "-=0.2");

      gsap.to(".marquee-track", {
        xPercent: -50,
        ease: "none",
        duration: 28,
        repeat: -1,
      });

      gsap.utils.toArray<HTMLElement>(".showcase-item").forEach((el) => {
        gsap.from(el, {
          scale: 1.08,
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      });
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <div ref={root} className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative flex min-h-[100svh] flex-col items-center justify-center px-4 pb-24 pt-32 sm:px-6">
        <AuroraBg />
        <HeroParticles />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="hero-eyebrow mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-primary-foreground/90 backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5 text-[oklch(0.78_0.14_265)]" />
            Houston metro · Private events
          </p>

          <h1 className="font-display text-[clamp(2.75rem,8vw,5.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-foreground">
            <span className="hero-line block">Where</span>
            <span className="hero-line block bg-gradient-to-r from-[oklch(0.92_0.08_265)] via-[oklch(0.75_0.18_265)] to-[oklch(0.65_0.22_300)] bg-clip-text text-transparent">
              gatherings
            </span>
            <span className="hero-line block">become unforgettable</span>
          </h1>

          <p className="hero-sub mx-auto mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            Discover steakhouses, BBQ legends, and event venues across Houston
            & Cypress — then plan your moment in one cinematic flow.
          </p>

          <div className="hero-cta mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Magnetic>
              <ButtonLink
                href="/signup"
                size="lg"
                className="glow-button h-14 min-w-[200px] rounded-full px-8 text-base"
              >
                Enter Arrive
                <ArrowRight className="ml-2 h-4 w-4" />
              </ButtonLink>
            </Magnetic>
            <Magnetic strength={0.2}>
              <ButtonLink
                href="/login"
                size="lg"
                variant="outline"
                className="h-14 min-w-[160px] rounded-full border-white/15 bg-white/5 px-8 text-base backdrop-blur-sm hover:bg-white/10"
              >
                Sign in
              </ButtonLink>
            </Magnetic>
          </div>
        </div>

        <div className="hero-scroll-hint absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span>Scroll</span>
            <span className="scroll-line h-12 w-px bg-gradient-to-b from-primary/80 to-transparent" />
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="border-y border-white/8 bg-white/[0.02] py-6 overflow-hidden">
        <div className="marquee-track flex w-max gap-12 whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="font-display text-2xl font-medium tracking-tight text-foreground/40 sm:text-3xl"
            >
              {item}
              <span className="mx-6 text-primary/50">·</span>
            </span>
          ))}
        </div>
      </section>

      {/* Showcase grid */}
      <section className="px-4 py-28 sm:px-6">
        <ScrollReveal className="mx-auto max-w-6xl">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
            The marketplace
          </p>
          <h2 className="font-display mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            Not another booking form. A stage for your event.
          </h2>
        </ScrollReveal>

        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 md:[grid-template-rows:repeat(2,12rem)] lg:[grid-template-rows:repeat(2,14rem)]">
          {SHOWCASE.map((item) => (
            <ScrollReveal
              key={item.title}
              className={`showcase-item group relative overflow-hidden rounded-2xl ring-1 ring-white/10 ${item.span}`}
              y={32}
            >
              <div className="relative h-full min-h-[10rem] w-full md:min-h-0 md:h-full">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <p className="absolute bottom-4 left-4 font-display text-lg font-medium text-white">
                  {item.title}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Statement */}
      <section className="relative px-4 py-32 sm:px-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,oklch(0.45_0.16_265/0.2),transparent)]" />
        <ScrollReveal className="relative mx-auto max-w-4xl text-center">
          <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
            Plan less friction.
            <br />
            <span className="text-muted-foreground">Feel more arrival.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-lg text-muted-foreground">
            Filters that understand vibes. Rankings that respect your guest
            count. A booking flow that feels like a conversation — not paperwork.
          </p>
          <Magnetic className="mt-12">
            <ButtonLink
              href="/signup"
              size="lg"
              className="glow-button rounded-full px-10"
            >
              Start planning
            </ButtonLink>
          </Magnetic>
        </ScrollReveal>
      </section>
    </div>
  );
}
