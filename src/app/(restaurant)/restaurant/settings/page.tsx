import { requireRole } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function RestaurantSettingsPage() {
  const profile = await requireRole("restaurant_owner");

  return (
    <div className="space-y-8">
      <PageHeader
        title="Venue settings"
        description="Configure your restaurant profile and availability."
      />

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Owner account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>
            <span className="font-medium text-foreground">Name:</span>{" "}
            {profile.name}
          </p>
          <p>
            <span className="font-medium text-foreground">Owner ID:</span>{" "}
            <code className="text-xs">{profile.id}</code>
          </p>
          <p className="pt-2 text-xs">
            Venue editing, hours, and capacity management will be added without
            changing this route structure.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
