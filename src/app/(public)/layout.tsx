import { Logo } from "@/components/shared/logo";
import { ButtonLink } from "@/components/shared/button-link";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border/60 bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="flex items-center gap-2">
            <ButtonLink href="/login" variant="ghost">
              Log in
            </ButtonLink>
            <ButtonLink href="/signup">Get started</ButtonLink>
          </nav>
        </div>
      </header>
      <main className="flex-1 page-enter">{children}</main>
      <footer className="border-t border-border/60 py-10 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Arrive — made for real gatherings.
      </footer>
    </div>
  );
}
