import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  canAccessPath,
  getUnauthorizedRedirect,
  isAuthPath,
  isPublicPath,
  pathRequiresAuth,
} from "@/lib/roleGuard";
import type { UserRole } from "@/types";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (user && isAuthPath(pathname)) {
    const { data: profile } = await supabase
      .from("users_profile")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = (profile?.role as UserRole) ?? "user";
    const url = request.nextUrl.clone();
    url.pathname = getUnauthorizedRedirect(role);
    return NextResponse.redirect(url);
  }

  if (!user && pathRequiresAuth(pathname) && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user && pathRequiresAuth(pathname)) {
    const { data: profile } = await supabase
      .from("users_profile")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = (profile?.role as UserRole) ?? "user";

    if (!canAccessPath(role, pathname)) {
      const url = request.nextUrl.clone();
      url.pathname = getUnauthorizedRedirect(role);
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
