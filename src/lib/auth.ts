import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionUserProfile } from "@/lib/data/users";
import type { UserProfile, UserRole } from "@/types";
import { ROLE_HOME_PATH } from "@/types";

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile(): Promise<UserProfile | null> {
  return getSessionUserProfile();
}

export async function requireAuth() {
  const user = await getSession();
  if (!user) redirect("/login");
  return user;
}

export async function requireRole(allowed: UserRole | UserRole[]) {
  const profile = await getProfile();
  if (!profile) redirect("/login");

  const roles = Array.isArray(allowed) ? allowed : [allowed];
  if (!roles.includes(profile.role)) {
    redirect(ROLE_HOME_PATH[profile.role]);
  }

  return profile;
}

export function getRoleRedirectPath(role: UserRole): string {
  return ROLE_HOME_PATH[role];
}
