"use client";

import { signOut } from "@/app/actions/auth";
import { LogOut } from "lucide-react";

export function SignOutButton() {
  return (
    <form action={signOut} className="w-full">
      <button
        type="submit"
        className="flex w-full cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none hover:bg-muted"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </form>
  );
}
