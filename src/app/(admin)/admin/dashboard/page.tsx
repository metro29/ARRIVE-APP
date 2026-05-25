import { Building2, Calendar, Users } from "lucide-react";
import { countBookings } from "@/lib/data/bookings";
import { countActiveRestaurants } from "@/lib/data/restaurants";
import { countUserProfiles } from "@/lib/data/users";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/cards/stat-card";

export default async function AdminDashboardPage() {
  const [users, restaurants, bookings] = await Promise.all([
    countUserProfiles(),
    countActiveRestaurants(),
    countBookings(),
  ]);

  return (
    <div className="space-y-10">
      <PageHeader
        title="Overview"
        description="A quiet snapshot of activity across Arrive."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="People on Arrive" value={users} icon={Users} />
        <StatCard title="Live venues" value={restaurants} icon={Building2} />
        <StatCard title="Event requests" value={bookings} icon={Calendar} />
      </div>
    </div>
  );
}
