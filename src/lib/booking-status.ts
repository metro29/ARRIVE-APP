import type { BookingStatus } from "@/types";

/** Canonical booking statuses — must match public.booking_status enum exactly */
export const BOOKING_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
} as const satisfies Record<string, BookingStatus>;

export const BOOKING_STATUSES = [
  BOOKING_STATUS.PENDING,
  BOOKING_STATUS.ACCEPTED,
  BOOKING_STATUS.REJECTED,
] as const;

export function isFinalBookingStatus(status: BookingStatus): boolean {
  return (
    status === BOOKING_STATUS.ACCEPTED || status === BOOKING_STATUS.REJECTED
  );
}

/** Human-facing copy — DB values unchanged */
export const BOOKING_STATUS_UX: Record<
  BookingStatus,
  { label: string; description: string }
> = {
  pending: {
    label: "Waiting for response",
    description: "The restaurant is reviewing your request",
  },
  accepted: {
    label: "Confirmed",
    description: "Your event is on the calendar",
  },
  rejected: {
    label: "Not available",
    description: "The venue couldn't accommodate this date",
  },
};
