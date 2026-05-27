import { Logo } from "@/components/shared/logo";
import { ButtonLink } from "@/components/shared/button-link";
import { GrainOverlay } from "@/components/motion/grain-overlay";
import { CinematicProviders } from "@/components/motion/cinematic-providers";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CinematicProviders>
      <div className="theme-cinematic flex min-h-screen flex-col selection:bg-violet-500/30">
        <GrainOverlay />
        <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-[oklch(0.08_0.02_265/0.85)] backdrop-blur-xl">
          <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-8">
            <Logo className="text-white" />
            <nav className="flex items-center gap-2">
              <ButtonLink
                href="/login"
                variant="ghost"
                className="rounded-full text-white/80 hover:bg-white/10 hover:text-white"
              >
                Log in
              </ButtonLink>
              <ButtonLink
                href="/signup"
                className="glow-button rounded-full font-semibold"
              >
                Get started
              </ButtonLink>
            </nav>
          </div>
        </header>
        <main className="flex-1 pt-[4.5rem]">{children}</main>
        <footer className="border-t border-white/12 py-14 text-center">
          <p className="text-sm font-medium text-white/65">
            © {new Date().getFullYear()} Arrive — Houston & Cypress event venues
          </p>
        </footer>
      </div>
    </CinematicProviders>
  );
}
