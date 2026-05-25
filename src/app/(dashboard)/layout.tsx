import { requireRole } from "@/lib/auth";
import { DashboardShell } from "@/components/shared/dashboard-shell";

const navItems = [
  { href: "/plan", label: "Plan Event" },
  { href: "/dashboard", label: "Overview" },
  { href: "/discover", label: "Discover" },
  { href: "/bookings", label: "Bookings" },
  { href: "/settings", label: "Settings" },
];

export default async function UserDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireRole("user");

  return (
    <DashboardShell
      navItems={navItems}
      userName={profile.name || "Guest"}
      userRole={profile.role}
    >
      {children}
    </DashboardShell>
  );
}
