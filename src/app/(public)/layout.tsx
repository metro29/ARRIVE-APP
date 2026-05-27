import { Logo } from "@/components/shared/logo";
import { ButtonLink } from "@/components/shared/button-link";
import { GrainOverlay } from "@/components/motion/grain-overlay";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="theme-cinematic flex min-h-screen flex-col">
      <GrainOverlay />
      <header className="fixed top-0 z-50 w-full border-b border-white/6 bg-background/40 backdrop-blur-2xl">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-8">
          <Logo className="text-foreground" />
          <nav className="flex items-center gap-2">
            <ButtonLink
              href="/login"
              variant="ghost"
              className="rounded-full text-muted-foreground hover:text-foreground"
            >
              Log in
            </ButtonLink>
            <ButtonLink href="/signup" className="glow-button rounded-full">
              Get started
            </ButtonLink>
          </nav>
        </div>
      </header>
      <main className="flex-1 pt-[4.5rem]">{children}</main>
      <footer className="border-t border-white/8 py-14 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Arrive — Houston & Cypress event venues
        </p>
      </footer>
    </div>
  );
}
