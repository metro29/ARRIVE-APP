import { Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserProfile } from "@/types";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("users_profile")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Users"
        description="All platform accounts and roles."
      />

      {users && users.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(users as UserProfile[]).map((user) => (
            <Card key={user.id}>
              <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
                <CardTitle className="text-base">{user.name || "Unnamed"}</CardTitle>
                <Badge variant="secondary" className="capitalize">
                  {user.role.replace("_", " ")}
                </Badge>
              </CardHeader>
              <CardContent className="text-xs text-muted-foreground">
                <p className="font-mono truncate">{user.id}</p>
                <p className="mt-1">
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Users}
          title="No users yet"
          description="Users appear here after signup once the database migration is applied."
        />
      )}
    </div>
  );
}
