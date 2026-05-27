"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SignOutButton } from "@/components/shared/sign-out-button";

interface NavItem {
  href: string;
  label: string;
}

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  userName: string;
  userRole: string;
}

export function DashboardShell({
  children,
  navItems,
  userName,
  userRole,
}: DashboardShellProps) {
  const pathname = usePathname();
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const NavLinks = ({ mobile = false }: { mobile?: boolean }) => (
    <nav
      className={cn(
        "flex gap-0.5",
        mobile ? "flex-col" : "items-center"
      )}
    >
      {navItems.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "rounded-xl px-3.5 py-2 text-sm font-medium transition-colors duration-200",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              mobile && "text-[0.9375rem]"
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="relative min-h-screen bg-background">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,oklch(0.55_0.12_265/0.08),transparent_50%)]"
        aria-hidden
      />
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-2xl">
        <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Logo />
            <div className="hidden md:block">
              <NavLinks />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Sheet>
              <SheetTrigger
                className="md:hidden"
                render={
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Open menu"
                  />
                }
              >
                <Menu className="h-5 w-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-72 border-border/60">
                <div className="mb-8">
                  <Logo />
                </div>
                <NavLinks mobile />
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button variant="ghost" className="gap-2.5 pl-1.5 pr-2">
                    <Avatar className="h-8 w-8 ring-1 ring-border/60">
                      <AvatarFallback className="text-xs font-medium">
                        {initials || "AR"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm font-medium sm:inline">
                      {userName}
                    </span>
                  </Button>
                }
              />
              <DropdownMenuContent align="end" className="w-52">
                <div className="px-3 py-2 text-xs text-muted-foreground capitalize">
                  {userRole.replace("_", " ")}
                </div>
                <DropdownMenuSeparator />
                <div className="p-1">
                  <SignOutButton />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main className="page-enter mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
