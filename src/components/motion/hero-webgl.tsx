"use client";

import dynamic from "next/dynamic";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

const HeroScene = dynamic(
  () => import("@/components/motion/hero-scene").then((m) => m.HeroScene),
  { ssr: false, loading: () => <HeroFallback /> }
);

function HeroFallback() {
  return (
    <div className="absolute inset-0 -z-[4] flex items-center justify-center">
      <div className="h-[min(70vw,420px)] w-[min(70vw,420px)] rounded-full bg-gradient-to-br from-violet-500/40 via-indigo-500/30 to-fuchsia-500/20 blur-3xl animate-pulse" />
    </div>
  );
}

export function HeroWebGL() {
  const reduced = usePrefersReducedMotion();
  if (reduced) return <HeroFallback />;
  return (
    <div className="absolute inset-0 -z-[4] opacity-90">
      <HeroScene />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />
    </div>
  );
}
