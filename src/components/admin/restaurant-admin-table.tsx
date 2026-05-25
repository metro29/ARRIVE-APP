import { Pencil, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/shared/button-link";
import { RESTAURANT_STATUS_LABELS } from "@/types/restaurant-ops";
import type { RestaurantEnriched } from "@/types/restaurant";

interface RestaurantAdminTableProps {
  restaurants: RestaurantEnriched[];
}

export function RestaurantAdminTable({
  restaurants,
}: RestaurantAdminTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl ring-1 ring-foreground/[0.06]">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b border-border/60 bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Venue</th>
            <th className="px-4 py-3 font-medium">Market</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Capacity</th>
            <th className="px-4 py-3 font-medium">Owner</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {restaurants.map((r) => (
            <tr key={r.id} className="bg-background/80 hover:bg-muted/20">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{r.name}</span>
                  {r.is_featured && (
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{r.cuisine_type}</p>
              </td>
              <td className="px-4 py-3 capitalize">{r.city ?? "—"}</td>
              <td className="px-4 py-3">
                <Badge
                  variant={
                    r.status === "active"
                      ? "default"
                      : r.status === "pending_onboarding"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {RESTAURANT_STATUS_LABELS[r.status ?? "pending_onboarding"]}
                </Badge>
                {!r.is_visible && (
                  <span className="ml-2 text-xs text-muted-foreground">
                    Hidden
                  </span>
                )}
              </td>
              <td className="px-4 py-3">{r.capacity}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {r.owner_id ? "Assigned" : "Unassigned"}
              </td>
              <td className="px-4 py-3 text-right">
                <ButtonLink
                  href={`/admin/restaurants/${r.id}/edit`}
                  variant="ghost"
                  size="sm"
                  className="gap-1"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </ButtonLink>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
