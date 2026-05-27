"use client";

import type { ReactNode } from "react";
import { SmoothScroll } from "@/components/motion/smooth-scroll";

/** Smooth scroll on marketing pages only — native cursor always visible */
export function MarketingMotion({ children }: { children: ReactNode }) {
  return <SmoothScroll>{children}</SmoothScroll>;
}
