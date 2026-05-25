import { getProfile, getSession } from "@/lib/auth";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default async function SettingsPage() {
  const profile = await getProfile();
  const user = await getSession();

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings"
        description="Manage your account preferences."
      />

      <Card className="max-w-lg">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input defaultValue={profile?.name ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input defaultValue={user?.email ?? ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Badge variant="secondary" className="capitalize">
              {profile?.role?.replace("_", " ") ?? "user"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Profile editing ships in Phase 2. Roles are managed via Supabase for
            restaurant owners and admins.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
