"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frame = 0;
    let raf = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 2,
      vx: (Math.random() - 0.5) * 0.0004,
      vy: -0.0003 - Math.random() * 0.0005,
      a: 0.15 + Math.random() * 0.5,
    }));

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = 1;
        if (p.x < 0 || p.x > 1) p.vx *= -1;

        const px = p.x * w;
        const py = p.y * h;
        const pulse = 0.6 + Math.sin(frame * 0.02 + p.x * 10) * 0.4;

        ctx.beginPath();
        ctx.arc(px, py, p.r * pulse, 0, Math.PI * 2);
        ctx.fillStyle = `oklch(0.75 0.15 265 / ${p.a})`;
        ctx.fill();
      }

      frame++;
      raf = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 -z-[5] h-full w-full"
      aria-hidden
    />
  );
}
