import { requireRole } from "@/lib/auth";
import { DashboardShell } from "@/components/shared/dashboard-shell";

const navItems = [
  { href: "/restaurant/dashboard", label: "Overview" },
  { href: "/restaurant/bookings", label: "Bookings" },
  { href: "/restaurant/menu", label: "Menu" },
  { href: "/restaurant/settings", label: "Settings" },
];

export default async function RestaurantLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireRole("restaurant_owner");

  return (
    <DashboardShell
      navItems={navItems}
      userName={profile.name || "Owner"}
      userRole={profile.role}
    >
      {children}
    </DashboardShell>
  );
}
