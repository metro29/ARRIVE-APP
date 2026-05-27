"use client";

export function AuroraBg() {
  return (
    <div className="aurora-root pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="aurora-blob aurora-blob-1" />
      <div className="aurora-blob aurora-blob-2" />
      <div className="aurora-blob aurora-blob-3" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,oklch(0.55_0.2_265/0.35),transparent_65%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />
    </div>
  );
}
