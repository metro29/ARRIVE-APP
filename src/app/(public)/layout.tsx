import { Logo } from "@/components/shared/logo";
import { ButtonLink } from "@/components/shared/button-link";
import { MarketingMotion } from "@/components/motion/marketing-motion";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MarketingMotion>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-lg">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
            <Logo />
            <nav className="flex items-center gap-2">
              <ButtonLink href="/login" variant="ghost">
                Log in
              </ButtonLink>
              <ButtonLink href="/signup" className="btn-shine">
                Get started
              </ButtonLink>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-border bg-muted/20 py-12">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Arrive — Houston & Cypress event venues
            </p>
          </div>
        </footer>
      </div>
    </MarketingMotion>
  );
}
