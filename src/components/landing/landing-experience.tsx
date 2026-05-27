"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { HeroWebGL } from "@/components/motion/hero-webgl";
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
  "Cypress",
  "Houston",
  "Galas",
  "Celebrations",
];

const HORIZONTAL = [
  {
    src: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=900&q=80",
    title: "Steakhouse nights",
    meta: "Uptown · 120 guests",
  },
  {
    src: "https://images.unsplash.com/photo-1558030006-450675393462?w=900&q=80",
    title: "Texas BBQ",
    meta: "East End · 90 guests",
  },
  {
    src: "https://images.unsplash.com/photo-1551218808-94e220e084d2?w=900&q=80",
    title: "Rooftop socials",
    meta: "Downtown · 200 guests",
  },
  {
    src: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900&q=80",
    title: "Ballroom events",
    meta: "Galleria · 350 guests",
  },
  {
    src: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=900&q=80",
    title: "Tex-Mex feasts",
    meta: "Heights · 180 guests",
  },
];

const STATS = [
  { value: "108+", label: "Live venues" },
  { value: "2", label: "Metro markets" },
  { value: "1", label: "Planning flow" },
];

export function LandingExperience() {
  const root = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (reduced || !root.current) return;

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".hero-eyebrow", { opacity: 0, x: -24, duration: 0.9 })
        .from(
          ".hero-line",
          { opacity: 0, y: 60, duration: 1.1, stagger: 0.1 },
          "-=0.5"
        )
        .from(".hero-sub", { opacity: 0, y: 20, duration: 0.8 }, "-=0.55")
        .from(".hero-cta", { opacity: 0, y: 16, stagger: 0.08, duration: 0.7 }, "-=0.45")
        .from(".hero-stat", { opacity: 0, y: 20, stagger: 0.1, duration: 0.6 }, "-=0.35");

      gsap.to(".marquee-track", {
        xPercent: -50,
        ease: "none",
        duration: 24,
        repeat: -1,
      });

      if (horizontalRef.current && window.innerWidth >= 768) {
        const track = horizontalRef.current.querySelector(".h-scroll-track");
        if (track) {
          gsap.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth + 80),
            ease: "none",
            scrollTrigger: {
              trigger: horizontalRef.current,
              start: "top top",
              end: () => `+=${track.scrollWidth}`,
              pin: true,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          });
        }
      }
    },
    { scope: root, dependencies: [reduced] }
  );

  return (
    <div ref={root} className="overflow-x-hidden">
      {/* Hero — split layout */}
      <section className="hero-vignette relative min-h-[100svh]">
        <HeroWebGL />

        <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-center gap-12 px-4 py-28 lg:grid-cols-[1fr_1.1fr] lg:gap-16 lg:px-8">
          <div className="order-2 lg:order-1 lg:py-12">
            <p className="hero-eyebrow mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white shadow-lg backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" />
              Houston · Cypress
            </p>

            <h1 className="font-display text-hero text-[clamp(2.5rem,6.5vw,4.25rem)] font-bold leading-[0.98] tracking-[-0.03em]">
              <span className="hero-line block">The venue</span>
              <span className="hero-line block text-gradient-hero">is the experience.</span>
            </h1>

            <p className="hero-sub mt-6 max-w-md text-lg leading-relaxed text-hero-muted">
              Arrive is a live marketplace for private events — steakhouses, BBQ,
              rooftops, and ballrooms across the Houston metro.
            </p>

            <div className="hero-cta mt-10 flex flex-wrap gap-4">
              <Magnetic>
                <ButtonLink
                  href="/signup"
                  size="lg"
                  className="glow-button h-14 rounded-full px-9 text-base font-semibold"
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
                  className="h-14 rounded-full border-white/25 bg-white/10 px-9 text-base font-medium text-white hover:bg-white/15 hover:text-white"
                >
                  Sign in
                </ButtonLink>
              </Magnetic>
            </div>

            <div className="mt-14 grid grid-cols-3 gap-6 border-t border-white/15 pt-8">
              {STATS.map((s) => (
                <div key={s.label} className="hero-stat">
                  <p className="font-display text-3xl font-bold text-white sm:text-4xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-sm font-medium text-white/70">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 hidden min-h-[320px] lg:order-2 lg:block" aria-hidden />
        </div>
      </section>

      {/* Marquee */}
      <section className="border-y border-white/12 bg-white/[0.04] py-7">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
          {[...MARQUEE, ...MARQUEE].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold tracking-tight text-white/75"
            >
              {item}
              <span className="mx-8 text-violet-400/80">◆</span>
            </span>
          ))}
        </div>
      </section>

      {/* Horizontal scroll gallery — pinned on desktop, swipe on mobile */}
      <section
        ref={horizontalRef}
        className="relative overflow-hidden py-16 md:h-[100svh] md:py-0"
      >
        <div className="mb-8 px-4 md:absolute md:left-8 md:top-8 md:z-10 md:mb-0">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
            Scroll the city
          </p>
          <h2 className="font-display mt-2 max-w-sm text-3xl font-bold text-white sm:text-4xl">
            Venues worth arriving for
          </h2>
        </div>
        <div className="flex items-center md:h-full">
          <div className="h-scroll-track flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 md:gap-8 md:overflow-visible md:pl-[max(1rem,4vw)] md:pb-0">
            {HORIZONTAL.map((item) => (
              <article
                key={item.title}
                className="group relative h-[min(65vh,480px)] w-[min(88vw,400px)] shrink-0 snap-center overflow-hidden rounded-3xl ring-1 ring-white/20 md:h-[min(70vh,520px)] md:w-[min(85vw,420px)]"
              >
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="420px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 sm:p-8">
                  <p className="font-display text-2xl font-bold text-white sm:text-3xl">
                    {item.title}
                  </p>
                  <p className="mt-2 text-sm font-medium text-white/80">{item.meta}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Statement */}
      <section className="relative px-4 py-32 sm:px-8">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_50%,oklch(0.45_0.2_265/0.25),transparent)]" />
        <ScrollReveal className="relative mx-auto max-w-4xl text-center">
          <h2 className="font-display text-4xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
            Plan the gathering.
            <br />
            <span className="text-gradient-hero">Own the night.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-lg text-lg text-hero-muted">
            Smart filters. Honest rankings. Booking that feels like a conversation
            — built for Houston hosts who care where people remember being.
          </p>
          <Magnetic className="mt-12 inline-block">
            <ButtonLink
              href="/signup"
              size="lg"
              className="glow-button h-14 rounded-full px-12 text-base font-semibold"
            >
              Start planning
            </ButtonLink>
          </Magnetic>
        </ScrollReveal>
      </section>
    </div>
  );
}
