import { Logo } from "@/components/shared/logo";
import { StartupMesh } from "@/components/landing/startup-mesh";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <StartupMesh />
      <header className="relative z-10 border-b border-border/60 bg-background/80 px-4 py-5 backdrop-blur-md sm:px-6">
        <Logo />
      </header>
      <main className="relative z-10 flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-[0_16px_48px_-20px_oklch(0.25_0.06_265/0.2)]">
          {children}
        </div>
      </main>
    </div>
  );
}
