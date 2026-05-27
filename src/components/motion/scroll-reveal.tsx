"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  scale?: number;
  duration?: number;
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  y = 48,
  scale = 0.96,
  duration = 1.1,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (!ref.current || reduced) return;

      gsap.from(ref.current, {
        opacity: 0,
        y,
        scale,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref, dependencies: [reduced, delay, y, scale, duration] }
  );

  return (
    <div
      ref={ref}
      className={cn(className, reduced && "opacity-100")}
      style={reduced ? undefined : { opacity: 0 }}
    >
      {children}
    </div>
  );
}
