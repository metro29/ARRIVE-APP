import { Logo } from "@/components/shared/logo";
import { HeroWebGL } from "@/components/motion/hero-webgl";
import { GrainOverlay } from "@/components/motion/grain-overlay";
import { CinematicProviders } from "@/components/motion/cinematic-providers";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CinematicProviders>
      <div className="theme-cinematic relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
        <GrainOverlay />
        <div className="absolute inset-0 -z-10 opacity-60">
          <HeroWebGL />
        </div>
        <div className="relative z-10 mb-10">
          <Logo className="text-white" />
        </div>
        <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/15 bg-[oklch(0.14_0.025_265/0.92)] p-1 shadow-[0_32px_100px_-24px_oklch(0.05_0.05_265/1)] backdrop-blur-2xl">
          <div className="rounded-[calc(1rem-4px)] bg-[oklch(0.16_0.03_265)] p-6 text-foreground sm:p-8">
            {children}
          </div>
        </div>
      </div>
    </CinematicProviders>
  );
}
