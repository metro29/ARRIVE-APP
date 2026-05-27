import { Logo } from "@/components/shared/logo";
import { AuroraBg } from "@/components/motion/aurora-bg";
import { GrainOverlay } from "@/components/motion/grain-overlay";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-cinematic relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      <GrainOverlay />
      <AuroraBg />
      <div className="relative z-10 mb-10">
        <Logo />
      </div>
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/10 bg-card/60 p-1 shadow-[0_24px_80px_-24px_oklch(0.2_0.08_265/0.8)] backdrop-blur-xl">
        <div className="rounded-[calc(1rem-4px)] bg-card/90 p-6 sm:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
