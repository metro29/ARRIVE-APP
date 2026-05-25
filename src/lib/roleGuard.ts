import type { UserRole } from "@/types";

const RESTAURANT_OWNER_STATIC = new Set([
  "/restaurant/dashboard",
  "/restaurant/bookings",
  "/restaurant/menu",
  "/restaurant/settings",
]);

const USER_STATIC = new Set([
  "/dashboard",
  "/discover",
  "/plan",
  "/bookings",
  "/settings",
]);

export function isPublicPath(pathname: string): boolean {
  return pathname === "/" || pathname === "/login" || pathname === "/signup";
}

export function isAuthPath(pathname: string): boolean {
  return pathname === "/login" || pathname === "/signup";
}

export function pathRequiresAuth(pathname: string): boolean {
  return !isPublicPath(pathname);
}

function isRestaurantDetailPath(pathname: string): boolean {
  const match = pathname.match(/^\/restaurant\/([^/]+)$/);
  if (!match) return false;
  return !RESTAURANT_OWNER_STATIC.has(pathname);
}

function isUserBookingDetail(pathname: string): boolean {
  return /^\/bookings\/[^/]+$/.test(pathname);
}

function isRestaurantBookingDetail(pathname: string): boolean {
  return /^\/restaurant\/bookings\/[^/]+$/.test(pathname);
}

export function getRequiredRoles(pathname: string): UserRole[] | null {
  if (pathname.startsWith("/admin")) return ["admin"];
  if (isRestaurantBookingDetail(pathname)) return ["restaurant_owner"];
  if (RESTAURANT_OWNER_STATIC.has(pathname)) return ["restaurant_owner"];
  if (isUserBookingDetail(pathname)) return ["user"];
  if (USER_STATIC.has(pathname) || isRestaurantDetailPath(pathname)) {
    return ["user"];
  }
  return null;
}

export function canAccessPath(role: UserRole, pathname: string): boolean {
  if (role === "admin") return true;
  const required = getRequiredRoles(pathname);
  if (!required) return true;
  return required.includes(role);
}

export function getUnauthorizedRedirect(role: UserRole): string {
  const map: Record<UserRole, string> = {
    user: "/dashboard",
    restaurant_owner: "/restaurant/dashboard",
    admin: "/admin/dashboard",
  };
  return map[role];
}
