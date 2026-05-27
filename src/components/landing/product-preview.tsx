"use client";

import Image from "next/image";
import { MapPin, Sparkles, Users } from "lucide-react";

const PREVIEW_VENUES = [
  {
    name: "Killen's Steakhouse",
    tag: "Recommended",
    img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=600&q=80",
    loc: "Pearland",
    cap: 140,
  },
  {
    name: "Ninfa's on Navigation",
    tag: "Tex-Mex",
    img: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80",
    loc: "East End",
    cap: 200,
  },
];

export function ProductPreview() {
  return (
    <div className="product-preview relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/20 via-violet-400/10 to-transparent blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_24px_80px_-24px_oklch(0.35_0.12_265/0.35)] ring-1 ring-foreground/[0.04]">
        <div className="flex items-center gap-2 border-b border-border/60 bg-muted/40 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
          <span className="ml-2 text-xs font-medium text-muted-foreground">
            arrive.app / discover
          </span>
        </div>
        <div className="space-y-3 p-4">
          <div className="flex gap-2">
            <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              Houston metro
            </span>
            <span className="rounded-lg bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              108 venues
            </span>
          </div>
          {PREVIEW_VENUES.map((v) => (
            <div
              key={v.name}
              className="flex gap-3 rounded-xl border border-border/60 bg-background p-2.5 shadow-sm"
            >
              <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                <Image src={v.img} alt="" fill className="object-cover" sizes="80px" />
              </div>
              <div className="min-w-0 flex-1 py-0.5">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {v.name}
                  </p>
                  {v.tag === "Recommended" && (
                    <Sparkles className="h-3.5 w-3.5 shrink-0 text-primary" />
                  )}
                </div>
                <div className="mt-1 flex gap-3 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {v.loc}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {v.cap}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div className="h-9 rounded-xl bg-muted/50" />
        </div>
      </div>
    </div>
  );
}
