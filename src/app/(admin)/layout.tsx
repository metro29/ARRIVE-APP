import { requireRole } from "@/lib/auth";
import { DashboardShell } from "@/components/shared/dashboard-shell";

const navItems = [
  { href: "/admin/dashboard", label: "Overview" },
  { href: "/admin/users", label: "Users" },
  { href: "/admin/restaurants", label: "Restaurants" },
  { href: "/admin/bookings", label: "Bookings" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await requireRole("admin");

  return (
    <DashboardShell
      navItems={navItems}
      userName={profile.name || "Admin"}
      userRole={profile.role}
    >
      {children}
    </DashboardShell>
  );
}
