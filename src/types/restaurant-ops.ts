export type RestaurantStatus =
  | "active"
  | "inactive"
  | "pending_onboarding";

export type SubscriptionStatus =
  | "none"
  | "trial"
  | "active"
  | "inactive";

export const RESTAURANT_STATUS_LABELS: Record<RestaurantStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  pending_onboarding: "Pending onboarding",
};

export const SUBSCRIPTION_STATUS_LABELS: Record<SubscriptionStatus, string> = {
  none: "Not subscribed",
  trial: "Trial",
  active: "Active",
  inactive: "Inactive",
};
